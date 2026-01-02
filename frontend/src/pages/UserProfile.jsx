import React, { useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import { IdCard, Truck, House, Heart, Power } from 'lucide-react'
import PersonalDetails from '../components/userProfile/PersonalDetails'
import MyOrders from '../components/userProfile/MyOrders'
import MyAdresses from '../components/userProfile/MyAdresses'
import Favourites from '../components/userProfile/Favourites'
import axios from 'axios'
import { serverUrl } from '../../url'
import Cookies from "js-cookie";
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import api from '../utils/axiosInstance'
import CategoryNav from '../components/CategoryNav'

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState('personal-details')
  const nav = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await api.post(serverUrl + '/user/logout', {
        withCrendentials: true
      })
      Cookies.remove('authToken')
      localStorage.removeItem('user')
      console.log(response)
      nav('/')
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='bg-[#f7f6f2] min-h-screen w-full overflow-x-hidden'>
      <AnnouncementBar />
      <Navbar />
      <CategoryNav />
      
      <div className='maincontainer md:w-[85%] w-[94%] max-w-[1400px] min-h-[85vh] mx-auto mb-10 relative flex flex-col md:flex-row items-start justify-start gap-10 mt-10'>

        {/* LEFT CONTAINER */}
        <div className='leftContainer flex flex-col gap-3 w-full md:w-[25%] rounded-[20px]'>
          {/* MENU BOX */}
          <div className='leftBox bg-white w-full md:w-full flex-1 rounded-[20px] flex md:flex-col overflow-x-auto md:overflow-hidden shadow-sm'>
            {[
              { name: 'Personal Details', icon: <IdCard strokeWidth={1} className='w-6 h-6' />, section: 'personal-details' },
              { name: 'My Orders', icon: <Truck strokeWidth={1} className='w-6 h-6' />, section: 'my-orders' },
              { name: 'My Addresses', icon: <House strokeWidth={1} className='w-6 h-6' />, section: 'my-addresses' },
              { name: 'Favourites', icon: <Heart strokeWidth={1} className='w-6 h-6' />, section: 'favourites' },
            ].map((item) => (
              <p
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`flex items-center gap-3 font-Poppins p-3 text-sm md:text-base cursor-pointer whitespace-nowrap transition-all duration-300 ease-in-out 
                ${activeSection === item.section ? 'bg-[#f0efea] text-[#0f708a] font-semibold' : 'hover:bg-[#f8f8f8]'}`}
              >
                {item.icon} {item.name}
              </p>
            ))}
          </div>

          {/* LOGOUT BOX */}
          <div className='leftLogoutBox bg-white w-full md:w-full rounded-[20px] shadow-sm overflow-hidden'>
            <p className='flex items-center gap-3 font-Poppins p-3 hover:bg-[#f8f8f8] transition-all duration-300 ease-in-out cursor-pointer text-sm md:text-base' onClick={handleLogout}>
              <Power strokeWidth={1} className='w-6 h-6' /> Logout
            </p>
          </div>
        </div>

        {/* RIGHT CONTAINER */}
        <div className='rightContainer bg-white w-full md:w-[75%] rounded-[20px] p-4 md:p-6 shadow-sm min-h-[60vh]'>
          {activeSection === 'personal-details' && <PersonalDetails />}
          {activeSection === 'my-orders' && <MyOrders />}
          {activeSection === 'my-addresses' && <MyAdresses />}
          {activeSection === 'favourites' && <Favourites />}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default UserProfile
