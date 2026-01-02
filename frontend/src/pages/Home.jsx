import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import BeautifullHome from '../components/BeautifullHome'
import Events from '../components/Events'
import BestLoved from '../components/BestLoved'
import Footer from '../components/Footer'
import AnnouncementBar from '../components/AnnouncementBar'
import BestSellers from '../components/BestSellers'
import CuratedforYou from '../components/CuratedforYou'
import ContactUs from '../components/ContactUs'
import FreshFabulous from '../components/FreshFabulous'
import { ProductContext } from '../context/ProductContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import AboutUsComponent from '../components/AboutUsComponent'
import Featured from '../components/Featured'
import CategoryNav from '../components/CategoryNav'
import EditorialProductShowcase from '../components/EditorialProductShowcase'

const Home = () => {
  const { loading } = useContext(ProductContext)

  return (
    <div>
            <AnnouncementBar />
            <Navbar />
            <CategoryNav/>
            <Banner />
            <EditorialProductShowcase/>
            <BeautifullHome />
            <Events />
            <BestLoved />
            <BestSellers />
            <FreshFabulous />
            <Featured/>
            <CuratedforYou />
            <AboutUsComponent />
            <ContactUs />
            <Footer />
    </div>
  )
}

export default Home