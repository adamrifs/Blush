import { lazy, Suspense, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { GoogleOAuthProvider } from '@react-oauth/google'
import GlobalLoader from "./components/GlobalLoader"
import RouteLoader from "./components/RouteLoader"
import ErrorBoundary from "./components/error/ErrorBoundary"
import { useLoader } from "./context/LoaderContext"
import { injectLoader } from "./utils/axiosInstance"

// ─── Lazy-loaded page components (downloaded only when navigated to) ──────────
const Home               = lazy(() => import("./pages/Home"))
const ProductListing     = lazy(() => import("./pages/ProductListing"))
const Product            = lazy(() => import("./pages/Product"))
const CartPage           = lazy(() => import("./pages/CartPage"))
const AiPage             = lazy(() => import("./pages/AiPage"))
const Login              = lazy(() => import("./pages/Login"))
const ForgotPassword     = lazy(() => import("./pages/ForgotPassword"))
const ResetPassword      = lazy(() => import("./pages/ResetPassword"))
const Checkout           = lazy(() => import("./pages/Checkout"))
const UserProfile        = lazy(() => import("./pages/UserProfile"))
const OrderSuccess       = lazy(() => import("./pages/OrderSuccess"))
const TrackOrder         = lazy(() => import("./pages/TrackOrder"))
const AboutUs            = lazy(() => import("./pages/AboutUs"))
const ContactUsPage      = lazy(() => import("./pages/ContactUsPage"))
const PrivacyPolicy      = lazy(() => import("./pages/PrivacyPolicy"))
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"))
const DeliveryPolicy     = lazy(() => import("./pages/DeliverPolicy"))
const RefundPolicy       = lazy(() => import("./pages/RefundPolicy"))
const StoreLocation      = lazy(() => import("./pages/StoreLocation"))
const PaymentSuccess     = lazy(() => import("./pages/PaymentSuccess"))
const PaymentFailed      = lazy(() => import("./pages/PaymentFailed"))
const PaymentStatus      = lazy(() => import("./pages/PaymentStatus"))
const ErrorPage          = lazy(() => import("./pages/ErrorPage"))


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

        <Suspense fallback={
          <div className="fixed inset-0 z-[9998] bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-gray-600" />
          </div>
        }>
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
        </Suspense>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  )
}

export default App
