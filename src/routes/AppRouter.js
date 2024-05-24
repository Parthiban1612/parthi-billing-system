import React from "react";
import { Route, Routes } from "react-router-dom";
import AllCurrentVegetablePrices from "../pages/AllCurrentVegetablePrices";
import Home from "../pages/Home";
import CreateBill from "../pages/create-bill/CreateBill";
import CreateOrderList from "../pages/create-product-list/CreateOrderList";
import ProductList from "../pages/product-list/ProductList";
import Settings from "../pages/settings/Settings";
import AboutUs from "../pages/about-us/AboutUs";
import ConfirmBill from "../pages/confirm-bill/ConfirmBill";

export default function AppRouter() {
   return (
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/all-prices" element={<AllCurrentVegetablePrices />} />
         <Route path="/create-bill" element={<CreateBill />} />
         <Route path="/create-product-list" element={<CreateOrderList />} />
         <Route path="/products-list" element={<ProductList />} />
         <Route path="/settings" element={<Settings />} />
         <Route path="/about-us" element={<AboutUs />} />
         <Route path="/confirm-bill" element={<ConfirmBill />} />
      </Routes>
   );
}
