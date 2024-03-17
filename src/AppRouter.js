import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllCurrentVegetablePrices from "./pages/AllCurrentVegetablePrices";
import Home from "./pages/Home";
import CreateBill from "./pages/CreateBill";

export default function AppRouter() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/all-prices" element={<AllCurrentVegetablePrices />} />
            <Route path="/create-bill" element={<CreateBill />} />
            <Route path="/" element={<Home />} />
         </Routes>
      </BrowserRouter>
   );
}
