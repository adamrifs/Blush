import React, { useContext, useState, useSyncExternalStore } from 'react'
import upload from '../assets/upload.png'
import { toast } from 'react-toastify'
import { serverUrl } from '../../urls'
import axios from 'axios'
import { productContext } from '../context/ProductContext'

const CreateProduct = () => {
  const { fetchProducts } = useContext(productContext)

  const categories = [
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
    "Vase Arrangements"
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
    "Al Ain"
  ];
  const [availableIn, setAvailableIn] = useState([]);
  const [loading, setLoading] = useState(false)
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)
  const [image5, setImage5] = useState(null)

  const [name, setName] = useState('')
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState('')
  const [regularPrice, setRegularPrice] = useState("");
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [occasions, setOccasions] = useState('')
  const [type, setType] = useState("simple");
  const [category, setCategory] = useState('')
  const [isFeatured, setIsFeatured] = useState(false);
  const [addons, setAddons] = useState([{
    name: "",
    price: "",
    image: null
  }])

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("sku", sku);
      formData.append("price", price);
      formData.append("regularPrice", regularPrice); // base price
      formData.append("stock", stock);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("occasions", occasions);
      formData.append("availableIn", JSON.stringify(availableIn));
      formData.append("isFeatured", isFeatured);

      formData.append(
        "addons",
        JSON.stringify(addons.map(({ image, ...rest }) => rest))
      );

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      image5 && formData.append("image5", image5);

      const response = await axios.post(
        `${serverUrl}/product/addProduct`,
        formData,
        { withCredentials: true }
      );

      toast.success("Product successfully added");
      fetchProducts();

      // Reset values
      setImage1(null);
      setImage2(null);
      setImage3(null);
      setImage4(null);
      setImage5(null);
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setOccasions("");
      setCategory("");
      setType("simple");
      setSku("");
      setRegularPrice("");
      setIsFeatured(false);
      setAvailableIn([]); 
      setAddons([{ name: "", price: "", image: null }]);
    } catch (error) {
      toast.error("Error occured");
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='md:w-full w-screen h-auto px-8'>
      {/* __________________ heading ________________ */}
      <div className='flex justify-between items-center mt-3'>
        <h1 className=' font-montserrat md:text-4xl text-xl font-medium'>Create a new product</h1>
      </div>

      {/* ______________ main box ____________________ */}
      <div className='w-full h-[350px] border-2 border-[#F2F4F7] mt-5 rounded-[20px] flex items-start justify-between px-5 py-5'>
        <h2 className='font-montserrat text-sm  font-medium'>Basic Details</h2>

        <div className='w-[250px] md:w-[700px]'>
          <input type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Product Name' className=' outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-xs md:text-sm text-[#6C737F] font-Poppins' />

          {/* description */}

          <textarea type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Write something' className=' w-[250px] md:w-[700px] p-2 h-[220px] rounded-[8px] border-2 border-[#F2F4F7] text-[#6C737F] text-xs md:text-sm outline-0 font-Poppins mt-4' />
        </div>

      </div>

      {/* ____________ image ______________  */}
      <div className='w-full h-[220px] md:h-[200px] border-2 border-[#F2F4F7] mt-5 rounded-[20px] flex items-start justify-between px-5 py-5'>
        <h2 className='font-montserrat text-sm  font-medium'>Images</h2>

        <div className='w-[250px] md:w-[700px] bg-[#f1f3f6] h-[180px] md:h-[150px] rounded-[8px] px-4 transition duration-300 '>
          {/* <label htmlFor="file-upload" className='cursor-pointer flex items-center justify-center gap-2 h-full'>
            <img src={upload} alt="upload image" />
            <div>
              <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">PNG, JPG, or PDF (max 10MB)</p>
            </div>
          </label>
          <input type="file" id='file-upload' className='hidden' /> */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
            {/* Image 1 */}
            <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-full aspect-square p-2 overflow-hidden hover:scale-90 transition">
              <img
                src={image1 ? URL.createObjectURL(image1) : upload}
                alt="Upload"
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                type="file"
                name="image1"
                onChange={(e) => setImage1(e.target.files[0])}
                hidden
              />
            </label>

            {/* Image 2 */}
            <label className="p-2 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-full aspect-square overflow-hidden hover:scale-90 transition">
              <img
                src={image2 ? URL.createObjectURL(image2) : upload}
                alt="Upload"
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                type="file"
                name="image2"
                onChange={(e) => setImage2(e.target.files[0])}
                hidden
              />
            </label>

            {/* Image 3 */}
            <label className="p-2 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-full aspect-square overflow-hidden hover:scale-90 transition">
              <img
                src={image3 ? URL.createObjectURL(image3) : upload}
                alt="Upload"
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                type="file"
                name="image3"
                onChange={(e) => setImage3(e.target.files[0])}
                hidden
              />
            </label>

            {/* Image 4 */}
            <label className="p-2 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-full aspect-square overflow-hidden hover:scale-90 transition">
              <img
                src={image4 ? URL.createObjectURL(image4) : upload}
                alt="Upload"
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                type="file"
                name="image4"
                onChange={(e) => setImage4(e.target.files[0])}
                hidden
              />
            </label>

            {/* Image 5 */}
            <label className="p-2 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-full aspect-square overflow-hidden hover:scale-90 transition">
              <img
                src={image5 ? URL.createObjectURL(image5) : upload}
                alt="Upload"
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                type="file"
                name="image5"
                onChange={(e) => setImage5(e.target.files[0])}
                hidden
              />
            </label>
          </div>

        </div>
      </div>

      {/* _______________________ price ____________________ */}
      <div className='w-full h-auto border-2 border-[#F2F4F7] mt-5 rounded-[20px] flex items-start justify-between px-5 py-5'>
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
          {/* sale price */}
          <input
            type="number"
            placeholder="Sale Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="font-Poppins outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-lg text-sm text-[#6C737F]"
          />

          {/* regular price */}
          <input
            type="number"
            placeholder="Regular Price"
            value={regularPrice}
            onChange={(e) => setRegularPrice(e.target.value)}
            className="font-Poppins outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-lg text-sm text-[#6C737F]"
          />

          {/* stock */}
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="font-Poppins outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-lg text-sm text-[#6C737F]"
          />

          {/* type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="font-Poppins outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-lg text-sm text-[#6C737F]"
          >
            <option value="simple">Simple Product</option>
            <option value="variable">Variable Product</option>
          </select>

          {/* SKU */}
          <input
            type="text"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="font-Poppins outline-0 border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-lg text-sm text-[#6C737F]"
          />

          {/* ======= category dropdown ===== */}
          <select value={category} onChange={(e) => setCategory(e.target.value)} className='cursor-pointer border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 font-Poppins rounded-[8px] text-sm text-[#6C737F] outline-0'>
            <option value="">Select Option</option>
            {
              categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))
            }
          </select>

          {/* ==================== occasions dropdown============= */}
          <select value={occasions} onChange={(e) => setOccasions(e.target.value)} className='cursor-pointer border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-[8px] text-sm text-[#6C737F] outline-0 font-Poppins'>
            <option value="">Select Option</option>
            {
              occasion.map((occ, index) => (
                <option value={occ} key={index}>
                  {occ}
                </option>
              ))
            }
          </select>

          {/* ====================== emirates dropdown ======================== */}
          <select
            multiple
            value={availableIn}
            onChange={(e) =>
              setAvailableIn(
                Array.from(e.target.selectedOptions, option => option.value)
              )
            }
            className='cursor-pointer border-2 border-[#E5E7EB] w-[250px] md:w-[700px] p-2 rounded-lg text-sm text-[#6C737F] outline-0 h-28 font-Poppins'
          >
            {emiratesList.map((emirate, index) => (
              <option key={index} value={emirate}>
                {emirate}
              </option>
            ))}
          </select>

          <small className="text-gray-500 font-Poppins">
            Hold CTRL (Windows) or CMD (Mac) to select multiple emirates.
          </small>


          {/* ================= addons ================= */}

          <div className=' border-2 border-[#E5E7EB] p-2 rounded-[8px] flex flex-col gap-2'>
            {addons.map((addon, index) => (
              <div key={index} className='flex flex-col gap-3 border border-gray-200 p-3 rounded-[10px]'>

                <div className='flex items-center gap-2 flex-wrap'>
                  {/* 🧾 Addon Name */}
                  <input
                    type="text"
                    placeholder="Addon Name"
                    value={addon.name}
                    onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                    className='outline-0 border-2 border-[#E5E7EB] p-2 rounded-[8px] text-sm text-gray-500 font-Poppins'
                  />

                  {/* 💰 Addon Price */}
                  <input
                    type="number"
                    placeholder="Addon Price"
                    value={addon.price}
                    onChange={(e) => handleAddonChange(index, 'price', e.target.value)}
                    className='outline-0 border-2 border-[#E5E7EB] p-2 rounded-[8px] text-sm text-gray-500 font-Poppins'
                  />

                  {/* 🖼️ Addon Image Upload */}
                  <div className='w-[220px] md:w-[310px] px-2 bg-[#f1f3f6] h-[80px] rounded-[8px] active:scale-90 transition duration-300'>
                    <label htmlFor={`addon-image-${index}`} className='cursor-pointer flex items-center justify-center gap-2 h-full'>
                      <img src={upload} alt="upload icon" className="w-5 h-5" />
                      <p className="text-gray-700 text-xs font-Poppins">Click to upload or drag and drop</p>
                      <input
                        type="file"
                        id={`addon-image-${index}`}
                        className='hidden'
                        onChange={(e) => handleAddonImage(index, e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                {/* 🗑️ Remove button (optional) */}
                {addons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAddon(index)}
                    className="text-red-500 text-sm underline w-fit cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" className='px-4 py-2 cursor-pointer bg-[#2F3746] text-white rounded-[8px] hover:bg-[#5b6983]' onClick={addNewAddon}>
              Add Addon
            </button>
          </div>

          {/* isfeatured */}
          <label className="flex items-center gap-2 text-sm font-Poppins">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured Product
          </label>
        </div>
      </div>

      {/* ______________ button ________________ */}
      <div className='w-full flex justify-end'>
        <button className='px-8 py-3 cursor-pointer text-white font-montserrat bg-[#2F3746] rounded-[10px] hover:bg-[#5b6983] my-5 active:scale-90 transition duration-300' onClick={handleSubmit}>{loading ? "uploading..." : "Create"}</button>
      </div>
    </div>
  )
}

export default CreateProduct