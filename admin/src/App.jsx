import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { serverUrl } from "../urls";
import { ToastContainer } from "react-toastify";

function App() {
  const [isAuth, setIsAuth] = useState(null); // null = checking auth

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${serverUrl}/admin/me`, {
          withCredentials: true,
        });
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  // 🔥 BLOCK ROUTES UNTIL AUTH IS KNOWN
  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-700" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <Routes>
        <Route
          path="/register"
          element={
            isAuth ? <Navigate to="/" replace /> : <Register setIsAuth={setIsAuth} />
          }
        />
        <Route
          path="/"
          element={
            isAuth ? <Home setIsAuth={setIsAuth} /> : <Navigate to="/register" replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
