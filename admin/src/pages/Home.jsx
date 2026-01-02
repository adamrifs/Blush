import React from 'react'
import SideBar from '../components/SideBar'
import Navbar from '../components/Navbar'
import ListProduct from '../components/ListProduct'
import { useState } from 'react'
import CreateProduct from '../components/CreateProduct'
import BulkCreate from '../components/BulkCreate'
import AdminOrders from '../components/AdminOrders'
import { registerAdminPush } from "../utils/pushNotification";
import OrderAnalytics from '../components/OrderAnalytics'
import CustomerList from '../components/CustomerList'
import Settings from '../components/Settings'
import Overview from '../components/Overview'

const Home = ({ setIsAuth }) => {
    const [activePage, setActivePage] = useState('overview')
    const [isSidebarOpen, setIsSideBarOpen] = useState(false)

    return (
        <div className='flex h-screen'>
            <div className='w-[280px]'>
                <SideBar
                    setActivePage={setActivePage}
                    activePage={activePage}
                    isSidebarOpen={isSidebarOpen}
                    setIsSideBarOpen={setIsSideBarOpen} />
            </div>

            <div className='flex-1'>
                <Navbar
                    setIsSideBarOpen={setIsSideBarOpen}
                    isSidebarOpen={isSidebarOpen} />

                <div>

                    {/* ________________________ overview______________ */}
                    {activePage === 'overview' && (<Overview />)}

                    {/* ___________________account ______________________ */}
                    {/* {activePage === 'account' && (<h2> Account</h2>)} */}

                    {/* __________________ customers list ____________________ */}
                    {activePage === 'customer-list' && <CustomerList />}

                    {/* __________________ product list___________________ */}
                    {activePage === 'product-list' && (<ListProduct setActivePage={setActivePage} />)}

                    {/* _________________________ product create____________ */}
                    {activePage === 'product-create' && (<CreateProduct />)}

                    {/* ______________________ bulk create _______________ */}
                    {activePage === 'bulk-create' && <BulkCreate />}

                    {/* _______________________ Order ____________________ */}
                    {activePage === 'orders' && <AdminOrders />}

                    {/* ________________________ order analytics____________ */}
                    {activePage === 'order-analytics' && <OrderAnalytics />}

                    {/* ________________________ settings ____________ */}
                    {activePage === 'settings' && <Settings setIsAuth={setIsAuth} />}

                </div>
            </div>
        </div>
    )
}

export default Home