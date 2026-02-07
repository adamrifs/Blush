import axios from "axios";
import { Children, createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { serverUrl } from "../../urls";

export const productContext = createContext()

export const ProductProvider = ({ children }) => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${serverUrl}/product/getProduct`, {
                withCredentials: true,
            });
            // console.log(response.data);
            setProducts(response.data.products);
        } catch (error) {
            console.log(error);
            toast.error("Error occured");
        }
    };

    const values = { products, setProducts, fetchProducts }
    return (
        <productContext.Provider value={values}>
            {children}
        </productContext.Provider>
    )
}