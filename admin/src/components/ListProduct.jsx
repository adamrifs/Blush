import React, { useContext } from 'react'
import { useState } from 'react'
import { FiSearch } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'
import { productContext } from '../context/ProductContext';
import { serverUrl } from '../../urls';
import { toast } from 'react-toastify';
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from 'axios';
import upload from '../assets/upload.png'
import CustomSelect from './CustomSelect';
import CustomDropdown from './CustomSelect';

const ListProduct = ({ setActivePage }) => {
    const categories = [
        "All Categories",
        "Bouquet",
        "Bouquet in Bag",
        "Box Arrangements",
        "Cake",
        "Cakes and Flowers",
        "Chocolate",
        "Chocolate and Flowers",
        "Combo Deals",
        "Flowers",
        "Forever Flowers",
        "Fresh Cakes",
        "Flower Basket",
        "Fruits and Flowers",
        "Hand Bouquet",
        "Mini Bag Arrangements",
        "Mini Bouquet",
        "Necklace",
        "Plants",
        "Vase Arrangements",
    ];

    const occasion = ["Mother's Day",
        "Valentine's Day",
        "Eid",
        "National Day",
        "Birthday",
        "Anniversary",
        "Graduation",
        "New Year",]
    const emiratesList = [
        "Abu Dhabi",
        "Dubai",
        "Sharjah",
        "Ajman",
        "Umm Al Quwain",
        "Ras Al Khaimah",
        "Fujairah",
        "Al Ain",
    ];

    const nav = useNavigate()
    const { products, fetchProducts } = useContext(productContext)
    const [loading, setLoading] = useState(false)
    const [availableIn, setAvailableIn] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null)
    const [actionOpen, setActionOpen] = useState('')
    const [expandedProduct, setExpandedProduct] = useState(null);
    // FILTER STATES
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterOccasion, setFilterOccasion] = useState("all");
    const [filterStock, setFilterStock] = useState("all");
    const [sortBy, setSortBy] = useState("default");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50; // You can change this to 5, 8, etc.

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [images, setImages] = useState([null, null, null, null, null]);
    const [name, setName] = useState('')
    const [type, setType] = useState("simple");
    const [sku, setSku] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [description, setDescription] = useState('')
    const [occasions, setOccasions] = useState('')
    const [category, setCategory] = useState('')
    const [isFeatured, setIsFeatured] = useState(false);
    const [addons, setAddons] = useState([{
        name: "",
        price: "",
        image: null
    }])

    const handleEditOption = (product) => {
        setEditingProduct(product);

        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setRegularPrice(product.regularPrice || product.price);
        setStock(product.stock);

        setType(product.type || "simple");
        setSku(product.sku || "");
        setIsFeatured(product.isFeatured || false);

        setCategory(product.category);
        setOccasions(product.occasions);
        setAvailableIn(product.availableIn || []);
        setAddons(product.addons || [{ name: "", price: "", image: null }]);

        setImages([
            product.image?.[0] || null,
            product.image?.[1] || null,
            product.image?.[2] || null,
            product.image?.[3] || null,
            product.image?.[4] || null,
        ]);

    }

    const handleImageChange = (index, file) => {
        const updatedImages = [...images];
        updatedImages[index] = file;
        setImages(updatedImages);
    };

    const handleActionOpen = (productId) => {
        setActionOpen(actionOpen === productId ? null : productId)
    }

    const handleExpand = (id) => {
        setExpandedProduct(expandedProduct === id ? null : id);
    };

    const handleDeleteProduct = async (id) => {
        setLoading(true)
        try {
            const response = await axios.delete(`${serverUrl}/product/deleteProduct/${id}`, { withCredentials: true })
            console.log(response)
            fetchProducts()
            toast.success('Product deleted')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAddonChange = (index, field, value) => {
        const updatedAddons = [...addons]
        updatedAddons[index][field] = value
        setAddons(updatedAddons)
    }

    // 📸 Handle image upload
    const handleAddonImage = (index, file) => {
        const updatedAddons = [...addons]
        updatedAddons[index].image = file
        setAddons(updatedAddons)
    }

    // ➕ Add new addon input box
    const addNewAddon = () => {
        setAddons([...addons, { name: "", price: "", image: null }])
    }

    // 🗑️ (Optional) Remove an addon
    const removeAddon = (index) => {
        const updatedAddons = addons.filter((_, i) => i !== index)
        setAddons(updatedAddons)
    }

    const handleEdit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Basic product data
            formData.append("name", name || editingProduct.name);
            formData.append("price", price || editingProduct.price);
            formData.append("stock", stock || editingProduct.stock);
            formData.append("description", description || editingProduct.description);
            formData.append("category", category || editingProduct.category);
            formData.append("occasions", occasions || editingProduct.occasions);
            formData.append("type", type);
            formData.append("sku", sku);
            formData.append("regularPrice", regularPrice);
            formData.append("isFeatured", isFeatured);

            // 🖼 Append all images (new files or existing URLs)
            images.forEach((img) => {
                if (img instanceof File) {
                    formData.append("image", img); // backend must handle multiple 'image' fields
                }
            });

            // Include existing image URLs
            const existingImages = images.filter((img) => typeof img === "string");
            if (existingImages.length > 0) {
                formData.append("existingImages", JSON.stringify(existingImages));
            }

            // 🧩 Addons (send as JSON string)
            formData.append("addons", JSON.stringify(addons));
            formData.append("availableIn", JSON.stringify(availableIn));

            // 🔥 Send request
            const response = await axios.put(
                `${serverUrl}/product/editProduct/${editingProduct._id}`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            toast.success("Product Updated Successfully");
            fetchProducts();

            // Reset form
            setName("");
            setDescription("");
            setPrice("");
            setOccasions("");
            setCategory("");
            setAddons([{ name: "", price: "", image: null }]);
            setEditingProduct(null);

        } catch (error) {
            console.log(error);
            toast.error("Error occurred while updating");
        } finally {
            setLoading(false);
        }
    };
    console.log('products:', products)

    // ================== FILTER + SORT LOGIC ===================
    const filteredProducts = products
        .filter((item) => {
            const term = searchTerm.toLowerCase();

            return (
                item.name?.toLowerCase().includes(term) ||
                item.sku?.toLowerCase().includes(term)
            );
        })
        .filter((item) =>
            filterCategory === "all" ? true : item.category === filterCategory
        )
        .filter((item) =>
            filterOccasion === "all" ? true : item.occasions === filterOccasion
        )
        .filter((item) => {
            if (filterStock === "low") return item.stock > 0 && item.stock < 5;
            if (filterStock === "out") return item.stock === 0;
            if (filterStock === "in") return item.inStock === true;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "low-high") return a.price - b.price;
            if (sortBy === "high-low") return b.price - a.price;
            return 0;
        });


    // ================== PAGINATION ===================
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Total pages
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Change Page
    const goToPage = (page) => setCurrentPage(page);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    // Select single product
    const handleSelectProduct = (id) => {
        let updated = [...selectedProducts];

        if (updated.includes(id)) {
            updated = updated.filter((pid) => pid !== id);
        } else {
            updated.push(id);
        }

        setSelectedProducts(updated);

        // Auto uncheck "Select All" if needed
        if (updated.length !== currentProducts.length) {
            setSelectAll(false);
        }
    };

    // Select All toggle
    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);

        if (checked) {
            const pageProductIds = currentProducts.map((item) => item._id);
            setSelectedProducts(pageProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0)
            return toast.error("No products selected");

        if (!window.confirm(`Delete ${selectedProducts.length} products?`)) return;

        try {
            setLoading(true);

            await axios.post(
                `${serverUrl}/product/bulkDelete`,
                { ids: selectedProducts },
                { withCredentials: true }
            );

            toast.success("Selected products deleted");
            fetchProducts();
            setSelectedProducts([]);
            setSelectAll(false);

        } catch (error) {
            console.log(error);
            toast.error("Failed to delete multiple products");
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await axios.get(
                `${serverUrl}/product/export-excel`,
                {
                    withCredentials: true,
                    responseType: "blob" // IMPORTANT
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "products.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Excel downloaded");

        } catch (error) {
            console.log(error);
            toast.error("Failed to download Excel");
        }
    };

    return (
        <div className="md:w-full w-screen h-auto px-3 md:px-8 ">
            {/* __________________ heading ________________ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-3 gap-3">
                <h1 className="font-montserrat text-lg md:text-4xl font-medium">
                    Products
                </h1>
                {/* <button className="font-montserrat bg-[#6366F1] text-white md:rounded-[12px] rounded-[8px] px-3 md:px-5 py-1 md:py-2 cursor-pointer hover:bg-[#4f51c8] transition duration-300">
                    + Add
                </button> */}

                <button onClick={downloadExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer">
                    Download Excel
                </button>
            </div>

            {/* ______________ main box ____________________ */}
            <div className="w-full h-auto border-2 border-[#F2F4F7] mt-5 rounded-[20px] overflow-x-auto">

                {/* ================= FILTER BAR ================= */}
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-[#F2F4F7] bg-white font-Poppins">

                    {/* Search */}
                    <div className="flex items-center bg-[#FAFAFA] border border-[#EAECF0] px-3 rounded-lg w-full">
                        <FiSearch className="text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ml-2 bg-transparent outline-none text-sm py-2 "
                        />
                    </div>

                    <CustomDropdown
                        value={filterCategory}
                        onChange={setFilterCategory}
                        placeholder="All Categories"
                        options={categories.map(c => ({ label: c, value: c }))}
                    />

                    <CustomDropdown
                        value={filterOccasion}
                        onChange={setFilterOccasion}
                        placeholder="All Occasions"
                        options={occasion.map(o => ({ label: o, value: o }))}
                    />

                    <CustomDropdown
                        value={filterStock}
                        onChange={setFilterStock}
                        placeholder="All Stock Levels"
                        options={[
                            { label: "Low Stock (1–4)", value: "low" },
                            { label: "In Stock", value: "in" },
                            { label: "Out of Stock", value: "out" },
                        ]}
                    />

                    <CustomDropdown
                        value={sortBy}
                        onChange={setSortBy}
                        placeholder="Sort"
                        options={[
                            { label: "Price: Low → High", value: "low-high" },
                            { label: "Price: High → Low", value: "high-low" },
                        ]}
                    />

                    {/* Clear Filters */}
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setFilterCategory("all");
                            setFilterOccasion("all");
                            setFilterStock("all");
                            setSortBy("default");
                        }}
                        className="
            ml-auto
            text-sm
            px-4 py-2
            border border-[#EAECF0]
            rounded-lg
            text-[#344054]
            hover:bg-[#F9FAFB] cursor-pointer
        "
                    >
                        Clear filters
                    </button>
                </div>


                {/* ________________________ list box headings _______________________ */}
                <div className="bg-[#F8F9FA] flex items-center h-[50px] justify-between md:px-8 px-3 font-medium text-gray-600">
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="mr-3"
                    />

                    <p className="w-[40%]">Name</p>
                    <p className="w-[30%]">Category</p>
                    <p className="w-[30%]">Stock</p>
                    <p className="w-[20%] text-left">Price</p>
                </div>
                {/* Bulk Delete Button */}
                {selectedProducts.length > 0 && (
                    <div className="flex justify-end p-3">
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
                        >
                            Delete Selected ({selectedProducts.length})
                        </button>
                    </div>
                )}

                {/* ________________________ Product list _______________________ */}
                <div className="flex flex-col divide-y divide-[#F2F4F7] min-w-[400px] md:min-w-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-700" />
                        </div>
                    ) : currentProducts.length === 0 ? (
                        //  NO PRODUCTS STATE
                        <div className="text-center py-16 text-gray-500">
                            No products found
                        </div>
                    ) : (
                        currentProducts.map((item, index) => (
                            <div key={index}>
                                {/* Product Row (collapsed view) */}
                                <div
                                    className={`font-Poppins flex items-center justify-between md:px-8 px-4 py-3 hover:bg-gray-50 transition duration-300 cursor-pointer ${expandedProduct === item._id ? "bg-gray-50" : ""
                                        }`}
                                    onClick={() => handleExpand(item._id)}
                                >
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(item._id)}
                                        onChange={() => handleSelectProduct(item._id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="mr-3"
                                    />
                                    {/* name */}
                                    <div className="flex items-center gap-3 md:w-[35%]">
                                        {(item.image || []).slice(0, 1).map((img, i) => (
                                            <img
                                                key={i}
                                                src={img || upload}
                                                alt="product"
                                                className="w-[80px] h-[80px] rounded-lg object-cover border border-gray-200"
                                            />
                                        ))}

                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-800 text-xs truncate">
                                                {item.name}
                                            </p>

                                            <div className="flex gap-2 mt-1 text-[10px]">
                                                <span className="px-2 py-[2px] rounded bg-gray-200">
                                                    {item.type}
                                                </span>

                                                {item.inStock ? (
                                                    <span className="px-2 py-[2px] rounded bg-green-100 text-green-700">
                                                        In stock
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-[2px] rounded bg-red-100 text-red-700">
                                                        Out
                                                    </span>
                                                )}

                                                {item.isFeatured && (
                                                    <span className="px-2 py-[2px] rounded bg-yellow-100 text-yellow-700">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    {/* category */}
                                    <div className="w-[25%] text-left font-medium md:text-sm text-xs text-gray-700">
                                        {item.category}
                                    </div>

                                    {/* stock */}
                                    <div className="w-[20%] text-left font-medium md:text-sm text-xs text-gray-700">
                                        {item.stock}
                                    </div>

                                    {/* price */}
                                    <div className="w-[20%] text-left pl-7 font-medium text-gray-700">
                                        AED {item.price}
                                    </div>
                                </div>

                                {/* Expanded Product Details */}
                                {expandedProduct === item._id && (
                                    <div className="bg-[#F9FAFB] px-8 py-5 text-sm text-gray-700 animate-[slideDown_0.3s_ease-in-out] font-Poppins">
                                        <p className="mb-2"><b>Full Description:</b>{" "}{item.description}</p>
                                        <p className="mb-2"><b>Category:</b>{" "}{item.category}</p>
                                        <p className="mb-2"><b>Occasions:</b>{" "}{item.occasions}</p>
                                        <p className="mb-2"><b>Stock:</b>{" "}{item.stock}</p>
                                        <p className="mb-2"><b>SKU:</b> {item.sku || "—"}</p>
                                        <p className="mb-2"><b>Type:</b> {item.type}</p>
                                        <p className="mb-2"><b>Regular Price:</b> AED {item.regularPrice}</p>
                                        <p className="mb-2"><b>Slug:</b> {item.slug}</p>
                                        <p className="mb-2"><b>Featured:</b> {item.isFeatured ? "Yes" : "No"}</p>
                                        <p className="mb-2"><b>Stock Status:</b> {item.inStock ? "In Stock" : "Out of Stock"}</p>

                                        <div className="flex gap-3 mt-4">
                                            <button className="px-5 py-[4px] rounded-[8px] hover:bg-[#5b6983] cursor-pointer transition duration-300 bg-[#2F3746] text-white" onClick={() => handleEditOption(item)}>
                                                Edit
                                            </button>
                                            <button
                                                className="px-5 py-[4px] rounded-[8px] hover:bg-[#cc0000] cursor-pointer transition duration-300 bg-[red] text-white"
                                                onClick={() => handleDeleteProduct(item._id)}
                                            >
                                                {loading ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {
                                    editingProduct && editingProduct._id === item._id && (
                                        <div className='md:w-[900px] md:h-auto w-[400px] h-auto p-4 pt-0 bg-white  shadow-2xl rounded-[20px]'>
                                            <div className='flex items-center justify-end p-4 mt-2 h-0'>
                                                <IoCloseCircleOutline className='text-2xl cursor-pointer hover:text-gray-400 active:scale-90 transition duration-300' onClick={() => setEditingProduct(null)} />
                                            </div>

                                            {/* _______________ editing starts here ____________ */}
                                            <div className='w-full h-[350px] border-2 border-[#F2F4F7] mt-5 rounded-[20px] flex items-start justify-between px-5 py-5'>
                                                <h2 className='font-montserrat text-sm font-medium'>Basic Details</h2>

                                                <div className='w-[250px] md:w-[700px]'>
                                                    <input type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder='Product Name' className=' outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F] font-Poppins' />

                                                    {/* description */}

                                                    <textarea type="text"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        placeholder='Write something' className=' w-[250px] md:w-[700px] p-2 h-[230px] rounded-[8px] border-2 border-[#F2F4F7] text-[#6C737F] text-xs md:text-sm outline-0 font-Poppins mt-4' />
                                                </div>

                                            </div>
                                            {/* ________ image ________________ */}
                                            <div className='w-full h-[220px] md:h-[200px] border-2 border-[#F2F4F7] mt-5 rounded-[20px] flex items-start justify-between px-5 py-5'>
                                                <h2 className='font-montserrat text-sm font-medium'>Images</h2>

                                                <div className='w-[250px] md:w-[700px] bg-[#f1f3f6] h-[180px] md:h-[150px] rounded-[8px] px-4 transition duration-300 '>
                                                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                                                        {/* Image 1 */}
                                                        {images.map((img, index) => (
                                                            <label key={index} className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-full aspect-square p-2 overflow-hidden hover:scale-90 transition">
                                                                <img
                                                                    src={
                                                                        img
                                                                            ? img instanceof File
                                                                                ? URL.createObjectURL(img)
                                                                                : typeof img === "string"
                                                                                    ? img
                                                                                    : upload
                                                                            : upload
                                                                    }
                                                                    alt={`Upload-${index}`}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                                                                    hidden
                                                                />
                                                            </label>
                                                        ))}


                                                    </div>

                                                </div>
                                            </div>
                                            <div className='w-full h-auto border-2 border-[#F2F4F7] mt-5 rounded-[20px] flex items-start justify-between px-5 py-5 font-Poppins'>
                                                <div className='flex flex-col justify-evenly gap-12'>
                                                    <h2 className='font-montserrat text-sm  font-medium'>Sale Price</h2>
                                                    <h2 className='font-montserrat text-sm  font-medium'>Regular Price</h2>
                                                    <h2 className='font-montserrat text-sm  font-medium'>Stock</h2>
                                                    <h2 className='font-montserrat text-sm  font-medium'>Type</h2>
                                                    <h2 className='font-montserrat text-sm  font-medium'>SKU</h2>
                                                    <h2 className='font-montserrat text-sm  font-medium'>Category</h2>
                                                    <h2 className='font-montserrat text-sm  font-medium'>Occasions</h2>
                                                    <h2 className='font-montserrat text-sm  font-medium'>Available In (Emirates)</h2>
                                                    <h2 className='font-montserrat text-sm  font-medium'>Addons</h2>
                                                </div>

                                                <div className='flex flex-col justify-evenly gap-6 pl-2'>
                                                    <input type="number"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        placeholder='Product Price' className=' outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]' />

                                                    <input
                                                        type="number"
                                                        placeholder="Regular Price"
                                                        value={regularPrice}
                                                        onChange={(e) => setRegularPrice(e.target.value)}
                                                        className="outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]"
                                                    />

                                                    <input type="number"
                                                        value={stock}
                                                        onChange={(e) => setStock(e.target.value)}
                                                        placeholder='Product Stock' className=' outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]' />

                                                    {/*  new fields */}

                                                    <select
                                                        value={type}
                                                        onChange={(e) => setType(e.target.value)}
                                                        className="outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]"
                                                    >
                                                        <option value="simple">Simple</option>
                                                        <option value="variable">Variable</option>
                                                    </select>

                                                    <input
                                                        type="text"
                                                        placeholder="SKU"
                                                        value={sku}
                                                        onChange={(e) => setSku(e.target.value)}
                                                        className="outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]"
                                                    />

                                                    <select
                                                        value={category}
                                                        onChange={(e) => setCategory(e.target.value)}
                                                        className='outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]'>
                                                        <option value={category}>{category}</option>
                                                        {categories.map((item, i) => <option key={i} value={item}>{item}</option>)}
                                                    </select>
                                                    <select
                                                        value={occasions}
                                                        onChange={(e) => setOccasions(e.target.value)}
                                                        className='outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]'>
                                                        <option value={occasions}>{occasions}</option>
                                                        {occasion.map((item, i) => <option key={i} value={item}>{item}</option>)}
                                                    </select>

                                                    {/* emirates */}
                                                    <select
                                                        multiple
                                                        value={availableIn}
                                                        onChange={(e) =>
                                                            setAvailableIn(
                                                                Array.from(e.target.selectedOptions, option => option.value)
                                                            )
                                                        }
                                                        className='cursor-pointer border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-sm text-[#6C737F] outline-0 h-28'
                                                    >
                                                        {emiratesList.map((emirate, index) => (
                                                            <option key={index} value={emirate}>
                                                                {emirate}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <small className="text-gray-500">
                                                        Hold CTRL (Windows) or CMD (Mac) to select multiple emirates.
                                                    </small>


                                                    {/* addons */}
                                                    <div className='flex flex-col gap-3'>
                                                        {addons.map((addon, index) => (
                                                            <div key={index} className='flex items-center gap-3 flex-wrap'>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Addon Name"
                                                                    value={addon.name}
                                                                    onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                                                                    className='outline-0 border-2 border-[#E5E7EB] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]'
                                                                />
                                                                <input
                                                                    type="number"
                                                                    placeholder="Addon Price"
                                                                    value={addon.price}
                                                                    onChange={(e) => handleAddonChange(index, 'price', e.target.value)}
                                                                    className='outline-0 border-2 border-[#E5E7EB] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]'
                                                                />
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleAddonImage(index, e.target.files[0])}
                                                                    className='outline-0 border-2 border-[#E5E7EB] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F]'
                                                                />
                                                            </div>
                                                        ))}
                                                        <button type='button' onClick={addNewAddon} className='bg-[#2F3746] py-1 text-white rounded-[6px] cursor-pointer hover:bg-[#5b6983] font-semibold text-xs md:text-sm '>+ Add More Addons</button>
                                                    </div>
                                                    <label className="flex items-center gap-2 font-Poppins">
                                                        <input
                                                            type="checkbox"
                                                            checked={isFeatured}
                                                            onChange={(e) => setIsFeatured(e.target.checked)}
                                                        />
                                                        Featured Product
                                                    </label>

                                                </div>

                                            </div>
                                            <button className='px-4 py-2 rounded-[12px] bg-[#2F3746] text-white mt-5 hover:bg-[#5b6983] cursor-pointer' onClick={handleEdit}>{loading ? 'Saving...' : "Save Changes"}</button>
                                        </div>
                                    )
                                }
                            </div>
                        ))
                    )}

                </div>
            </div>
            {/* =============== PAGINATION UI =============== */}
            <div className="flex items-center justify-center gap-2 py-4">

                {/* Prev Button */}
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 cursor-pointer rounded-lg border ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-gray-100"
                        }`}
                >
                    Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 cursor-pointer rounded-lg border ${currentPage === page ? "bg-[#2F3746] text-white" : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Button */}
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 cursor-pointer rounded-lg border  ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-gray-100"
                        }`}
                >
                    Next
                </button>

            </div>

        </div>
    )
}

export default ListProduct
