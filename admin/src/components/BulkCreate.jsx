import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../../urls'
import { toast } from 'react-toastify';
import { useState } from 'react';
import upload from '../assets/upload.png'
import done from '../assets/done.png'
import { useContext } from 'react';
import { productContext } from '../context/ProductContext';
import CustomDropdown from './CustomSelect';

const BulkCreate = () => {
    const [file, setFile] = useState(null);
    const { fetchProducts } = useContext(productContext)

    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [skippedRows, setSkippedRows] = useState([]);
    const [showSkippedModal, setShowSkippedModal] = useState(false);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");
    const LIMIT = 50;

    useEffect(() => {
        fetchMediaHistory(page);
    }, [page, sortOrder]);

    useEffect(() => {
        setSelected([]);
    }, [page]);

    const getSortableKey = (img) => {
        const name = img.originalName || "";
        const base = name.split(".")[0];
        return base.split("-").map(n => Number(n));
    };


    const naturalSort = (a, b) => {
        const aParts = getSortableKey(a);
        const bParts = getSortableKey(b);

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const diff = (aParts[i] || 0) - (bParts[i] || 0);
            if (diff !== 0) return diff;
        }
        return 0;
    };


    const handlePreview = async () => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(
            `${serverUrl}/product/bulk-preview`,
            formData,
            { withCredentials: true }
        );

        setPreviewData(res.data);
        setShowPreview(true);
    };

    const handleConfirmUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post(
            `${serverUrl}/product/bulkUpload`,
            formData,
            { withCredentials: true }
        );

        toast.success("Products uploaded successfully");
        setShowPreview(false);
        fetchProducts();
    };


    const fetchMediaHistory = async (pageNumber = 1) => {
        try {
            const res = await axios.get(
                `${serverUrl}/media/all?page=${pageNumber}&limit=${LIMIT}&sort=${sortOrder}`,
                { withCredentials: true }
            );

            setImages(res.data.media);
            setTotalPages(res.data.pagination.pages);
            setPage(res.data.pagination.page);
        } catch (err) {
            toast.error("Failed to load media history");
        }
    };



    // upload cloudinary images
    const uploadImages = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        const formData = new FormData();
        Array.from(files).forEach(file =>
            formData.append("images", file)
        );

        setUploading(true);

        try {
            const res = await axios.post(
                `${serverUrl}/media/upload`,
                formData,
                { withCredentials: true }
            );
            setImages(prev => [...prev, ...res.data.images]);
            toast.success("Images uploaded to Cloudinary");

        } catch (err) {
            toast.error("Image upload failed");
            console.log(err)
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await axios.post(
                serverUrl + `/product/bulkUpload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            fetchProducts();

            toast.success(
                `Uploaded ${response.data.uploaded} products`
            );

            if (response.data.skipped > 0) {
                setSkippedRows(response.data.skippedRows);
                setShowSkippedModal(true);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const filteredImages = images.filter(img =>
        img.url.toLowerCase().includes(search.toLowerCase())
    );

    const allSelected =
        filteredImages.length > 0 &&
        filteredImages.every(img =>
            selected.some(sel => sel._id === img._id)
        );

    const toggleSelectAll = () => {
        if (allSelected) {
            // unselect all visible
            setSelected(prev =>
                prev.filter(sel =>
                    !filteredImages.some(img => img._id === sel._id)
                )
            );
        } else {
            // select all visible
            setSelected(prev => {
                const newOnes = filteredImages.filter(
                    img => !prev.some(sel => sel._id === img._id)
                );
                return [...prev, ...newOnes];
            });
        }
    };

    const copySelected = () => {
        const urls = selected.map(i => i.url).join(", ");
        navigator.clipboard.writeText(urls);
        toast.success("Multiple URLs copied");
    };

    const deleteImage = async (mediaId) => {
        if (!window.confirm("Delete this image permanently?")) return;

        try {
            await axios.delete(
                `${serverUrl}/media/delete/${mediaId}`,
                { withCredentials: true }
            );

            setImages(prev => prev.filter(img => img._id !== mediaId));
            setSelected(prev => prev.filter(img => img._id !== mediaId));

            toast.success("Image deleted");

        } catch (err) {
            toast.error("Failed to delete image");
        }
    };

    const deleteSelectedImages = async () => {
        if (selected.length === 0) return;

        const confirmDelete = window.confirm(
            `Delete ${selected.length} selected image(s) permanently?`
        );
        if (!confirmDelete) return;

        try {
            const ids = selected.map(img => img._id);

            await axios.post(
                `${serverUrl}/media/bulk-delete`,
                { ids },
                { withCredentials: true }
            );

            setImages(prev => prev.filter(img => !ids.includes(img._id)));
            setSelected([]);

            toast.success("Selected images deleted");

        } catch (err) {
            toast.error("Bulk delete failed");
        }
    };


    return (
        <div className='md:w-full w-screen h-auto px-8'>
            {/* __________________ heading ________________ */}
            <div className='flex justify-between items-center mt-3'>
                <h1 className=' font-montserrat md:text-4xl text-xl font-medium'>Upload Bulk Products</h1>
            </div>

            {/* ______________ main box ____________________ */}
            <div className='w-full h-[350px] border-2 border-[#F2F4F7] mt-5 rounded-[20px] flex items-start justify-between px-5 py-5'>
                <form onSubmit={handleUpload}>
                    <label htmlFor="file-upload" className='cursor-pointer flex items-center justify-center gap-2 h-full'>
                        <img src={file ? done : upload} className='w-[100px] h-[100px] rounded-[8px]' alt="upload image" />
                        <div>
                            <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                        </div>
                    </label>
                    <input type="file" id='file-upload' className='hidden' accept=".xlsx, .xls, .csv" onChange={(e) => setFile(e.target.files[0])} />
                    <button type="submit" className='mt-10 ml-2 bg-[#2F3746] text-white rounded-[8px] px-5 py-2 hover:bg-[#4a4b90] transition duration-300 cursor-pointer active:scale-95'>Upload Excel</button>

                    {/* Preview */}

                    <button
                        type='button'
                        onClick={handlePreview}
                        disabled={!file}
                        className="
mt-10 ml-2 bg-[#2F3746] text-white rounded-[8px] px-5 py-2 hover:bg-[#4a4b90] transition duration-300 cursor-pointer active:scale-95
    "
                    >
                        Preview Upload
                    </button>
                </form>
            </div>

            {/* cloudinary */}
            {/* ================= MEDIA LIBRARY ================= */}
            <div className="w-full bg-white border border-[#F2F4F7] rounded-2xl p-6 mb-10 shadow-sm font-Poppins mt-5">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Media Library
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Upload images and copy URLs for Excel bulk upload
                        </p>
                    </div>

                    {/* Upload Button */}
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={uploadImages}
                        />

                        <div
                            className="
          px-6 py-3 rounded-[10px] font-medium text-white
          bg-[#2F3746]
          border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] active:scale-95 transition
        "
                        >
                            Upload Images
                        </div>
                    </label>
                </div>
                <p className="text-xs text-orange-600 mt-1 font-Poppins">
                    Max 100 images
                </p>
                {/* Search Images */}
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Search images..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className=" w-full px-5 py-3 text-sm rounded-full border border-[#E4E7EC] focus:outline-none focus:ring-2 focus:ring-[#b89bff]"
                    />
                </div>

                {/* Select All */}
                {filteredImages.length > 0 && (
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <div className='"mt-3 flex items-center gap-3'>
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                className="h-4 w-4 accent-[#6366F1] cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">
                                Select all images on this page
                            </span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <CustomDropdown
                                value={sortOrder}
                                onChange={(value) => setSortOrder(value)}
                                options={[
                                    { label: "Sort: Ascending", value: "asc" },
                                    { label: "Sort: Descending", value: "desc" },
                                ]} />
                        </div>
                    </div>
                )}

                {/* Copy Selected URLs */}
                {selected.length > 0 && (
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            {selected.length} image{selected.length > 1 ? "s" : ""} selected
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={copySelected}
                                className="
          px-6 py-2 rounded-full text-sm font-medium text-white
          bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
          hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)]
          active:scale-95 transition
        "
                            >
                                Copy Selected URLs
                            </button>

                            <button
                                onClick={deleteSelectedImages}
                                className="
          px-6 py-2 rounded-full text-sm font-medium text-white
          bg-red-500 hover:bg-red-600
          active:scale-95 transition
        "
                            >
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}


                {/* Uploading state */}
                {uploading && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-4">
                        <div className="animate-spin h-4 w-4 border-2 border-[#b89bff] border-t-transparent rounded-full" />
                        Uploading images to Cloudinary...
                    </div>
                )}

                {/* Images Grid */}

                {filteredImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mt-6">
                        {filteredImages.map((img, index) => (
                            <div
                                key={index}
                                className="
            bg-[#F8F9FC] border border-[#E4E7EC]
            rounded-2xl p-3 group
            hover:shadow-md transition
          "
                            >
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selected.some(i => i.url === img.url)}
                                        onChange={() => {
                                            setSelected(prev =>
                                                prev.some(i => i.url === img.url)
                                                    ? prev.filter(i => i.url !== img.url)
                                                    : [...prev, img]
                                            );
                                        }}
                                        className="
      absolute top-2 left-2 z-10
      h-4 w-4 cursor-pointer
      accent-[#6366F1]
    "
                                    />
                                    <button
                                        onClick={() => deleteImage(img._id)}
                                        className="
    absolute top-2 right-2 z-10
    h-6 w-6 rounded-full
    bg-red-500 text-white text-xs
    flex items-center justify-center
    hover:bg-red-600 transition cursor-pointer
  ">
                                        ✕
                                    </button>

                                    <img
                                        src={img.url}
                                        alt="media"
                                        className="h-28 w-full object-cover rounded-xl"
                                    />

                                    {/* Hover overlay */}
                                    <div
                                        className="
                absolute inset-0 bg-black/40 rounded-xl
                opacity-0 group-hover:opacity-100
                flex items-center justify-center transition
              "
                                    >
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(img.url);
                                                toast.success("Image URL copied");
                                            }}
                                            className="
                  px-4 py-2 text-sm text-white rounded-full
                  bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] cursor-pointer
                "
                                        >
                                            Copy URL
                                        </button>
                                    </div>
                                </div>

                                {/* URL hint */}
                                <p className="mt-2 text-xs text-gray-700 font-medium truncate">
                                    {img.originalName || "image"}
                                </p>

                                <p className="text-[10px] text-gray-400 truncate">
                                    {img.url}
                                </p>

                            </div>
                        ))}
                    </div>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-8">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="
        px-4 py-2 rounded-full text-sm
        border border-[#E4E7EC]
        disabled:opacity-40 cursor-pointer
      "
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`
          h-9 w-9 rounded-full text-sm cursor-pointer
          ${page === i + 1
                                        ? "bg-[#6366F1] text-white"
                                        : "border border-[#E4E7EC] text-gray-600"}
        `}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="
        px-4 py-2 rounded-full text-sm
        border border-[#E4E7EC]
        disabled:opacity-40 cursor-pointer
      "
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!uploading && images.length === 0 && (
                    <div className="mt-8 text-center text-gray-400 text-sm">
                        No images uploaded yet
                    </div>
                )}
            </div>

            {/* Skipped Rows Modal */}
            {showSkippedModal && (
                <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
                    <div className="bg-white rounded-2xl w-[90%] max-w-[600px] p-6 shadow-lg">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-red-500">
                                Skipped Rows
                            </h2>
                            <button
                                onClick={() => setShowSkippedModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Some rows were skipped due to errors. Please fix them and re-upload.
                        </p>

                        <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="p-2 text-left">Row</th>
                                        <th className="p-2 text-left">Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {skippedRows.map((row, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-2 font-medium">
                                                {row.row}
                                            </td>
                                            <td className="p-2 text-red-600">
                                                {row.reason}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowSkippedModal(false)}
                                className="
            px-6 py-2 rounded-full text-white
            bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
          "
                            >
                                Okay
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {showPreview && previewData && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-[900px] p-6 rounded-2xl">

                        <h2 className="text-xl font-semibold mb-4">
                            Bulk Upload Preview
                        </h2>

                        <p className="text-sm text-gray-600 mb-3">
                            Valid: {previewData.validCount} | Skipped: {previewData.skippedCount}
                        </p>

                        {/* VALID PRODUCTS */}
                        <div className="max-h-[300px] overflow-auto border rounded mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Price</th>
                                        <th className="p-2">Stock</th>
                                        <th className="p-2">Category</th>
                                        <th className="p-2">Images</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.validProducts.map((p, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-2">{p.name}</td>
                                            <td className="p-2">{p.price}</td>
                                            <td className="p-2">{p.stock}</td>
                                            <td className="p-2">{p.category}</td>
                                            <td className="p-2">{p.imageCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-4 py-2 border rounded-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmUpload}
                                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] text-white"
                            >
                                Confirm Upload
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default BulkCreate