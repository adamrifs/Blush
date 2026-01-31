import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import ProductListing from "./pages/ProductListing"
import Product from "./pages/Product"
import CartPage from "./pages/CartPage"
import AiPage from "./pages/AiPage"
import Login from "./pages/Login"
import Checkout from "./pages/Checkout"
import { ToastContainer } from "react-toastify"
import UserProfile from "./pages/UserProfile"
import { GoogleOAuthProvider } from '@react-oauth/google';
import OrderSuccess from "./pages/OrderSuccess"
import TrackOrder from "./pages/TrackOrder"
import GlobalLoader from "./components/GlobalLoader"
import { useLoader } from "./context/LoaderContext"
import { injectLoader } from "./utils/axiosInstance"
import RouteLoader from "./components/RouteLoader"
import { useEffect } from "react"
import AboutUs from "./pages/AboutUs"
import ContactUsPage from "./pages/ContactUsPage"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsAndConditions from "./pages/TermsAndConditions"
import DeliveryPolicy from "./pages/DeliverPolicy"
import RefundPolicy from "./pages/RefundPolicy"
import ErrorPage from "./pages/ErrorPage"
import ErrorBoundary from "./components/error/ErrorBoundary"
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentFailed from "./pages/PaymentFailed"
import StoreLocation from "./pages/StoreLocation"
import PaymentStatus from "./pages/PaymentStatus"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"


function App() {
  const { setLoading } = useLoader();

  useEffect(() => {
    injectLoader(setLoading);
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <ToastContainer />
        <GlobalLoader />
        <RouteLoader />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-listing" element={<ProductListing />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart-page" element={<CartPage />} />
          <Route path="/ai-page" element={<AiPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password/:token" element={<ResetPassword/>}/>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track-order/:id" element={<TrackOrder />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us-page" element={<ContactUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/term-and-conditions" element={<TermsAndConditions />} />
          <Route path="/delivery-policy" element={<DeliveryPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/store-location" element={<StoreLocation />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/payment/status" element={<PaymentStatus />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  )
}

export default App
