import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ProductContextProvider from './context/ProductContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { LoaderProvider } from './context/LoaderContext.jsx'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW registration failed:", err));
}


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProductContextProvider>
      <ToastProvider>
        <LoaderProvider>
          <App />
        </LoaderProvider>
      </ToastProvider>
    </ProductContextProvider>
  </BrowserRouter>
)
