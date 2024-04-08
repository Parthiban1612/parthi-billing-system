import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllCurrentVegetablePrices from "../pages/AllCurrentVegetablePrices";
import Home from "../pages/Home";
import CreateBill from "../pages/create-bill/CreateBill";
import CreateOrderList from "../pages/create-product-list/CreateOrderList";
import ProductList from "../pages/product-list/ProductList";
import Settings from "../pages/settings/Settings";

export default function AppRouter() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-prices" element={<AllCurrentVegetablePrices />} />
            <Route path="/create-bill" element={<CreateBill />} />
            <Route path="/create-product-list" element={<CreateOrderList />} />
            <Route path="/products-list" element={<ProductList />} />
            <Route path="/settings" element={<Settings />} />
         </Routes>
      </BrowserRouter>
   );
}
