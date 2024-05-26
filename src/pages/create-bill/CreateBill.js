import React, { useEffect, useState, useRef } from "react";
import CustomizedButtons from "../../components/CustomizedButtons";
import { Button, Container, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { combinedArray } from "../../lib/product-list/productList";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { formatRupees } from "../../lib/convertRuppee";

export default function CreateBill() {
   const [priceList, setPriceList] = useState([]);
   const [purchasedItems, setPurchasedItems] = useState([]);
   const [totalPrice, setTotalPrice] = useState(0);
   const quantityInputRef = useRef(null);
   const navigate = useNavigate();

   useEffect(() => {
      if (!localStorage?.getItem("combinedArray")) {
         localStorage.setItem("combinedArray", JSON.stringify(combinedArray));
      }
      const storedCombinedArray = JSON.parse(localStorage.getItem("combinedArray"));
      setPriceList(storedCombinedArray);
   }, []);

   useEffect(() => {
      const storedCombinedArray = JSON.parse(localStorage.getItem("currentBill"));
      setPurchasedItems(storedCombinedArray || []);
   }, []);

   const handleGetProduct = (productId, quantity) => {
      const selectedItem = priceList.find((item) => item.id === productId);
      const newItem = { ...selectedItem, quantity: parseInt(quantity), total: quantity * selectedItem?.price };
      setPurchasedItems((prevItems) => [...(prevItems || []), newItem]);
      quantityInputRef.current.value = ""; // Clear quantity input
   };

   useEffect(() => {
      if (Array.isArray(purchasedItems) && purchasedItems.length > 0) {
         const total = purchasedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
         );
         setTotalPrice(total);
         localStorage.setItem("currentBill", JSON.stringify(purchasedItems));
      }
   }, [purchasedItems]);

   const handleAddItem = () => {
      const productId = parseInt(document.getElementById("outlined-basic").value);
      const quantity = parseFloat(quantityInputRef.current.value); // Use parseFloat to allow .5 values
      if (!isNaN(productId) && !isNaN(quantity)) {
         handleGetProduct(productId, quantity);
         document.getElementById("outlined-basic").value = "";
      }
   };

   const handleQuantityChange = (index, quantity) => {
      const updatedItems = [...purchasedItems];
      updatedItems[index].quantity = parseFloat(quantity); // Use parseFloat to allow .5 values
      updatedItems[index].total = purchasedItems[index]?.price * quantity; // Use parseFloat to allow .5 values
      setPurchasedItems(updatedItems);
      localStorage.setItem("currentBill", JSON.stringify(updatedItems));
   };

   const handlePriceChange = (index, price) => {
      const updatedItems = [...purchasedItems];
      updatedItems[index].price = parseFloat(price); // Use parseFloat to allow .5 values
      updatedItems[index].total = purchasedItems[index]?.quantity * price; // Use parseFloat to allow .5 values
      setPurchasedItems(updatedItems);
      localStorage.setItem("currentBill", JSON.stringify(updatedItems));
   };

   const handleDeleteItem = (id) => {
      const updatedItems = purchasedItems.filter((_, _index) => _index !== id);
      setPurchasedItems(updatedItems);
      localStorage.setItem("currentBill", JSON.stringify(updatedItems));
   };

   const ColorButton = styled(Button)(({ theme }) => ({
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
      "&:hover": {
         backgroundColor: purple[700],
      },
   }));

   return (
      <Container sx={{ padding: 1 }}>
         <div>
            <div className="d-flex my-3 gap-1">
               <CustomizedButtons name='Set Price' path={"/all-prices"} />
               <Button
                  className="w-50"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
               >
                  Add
               </Button>
            </div>
            <div className="d-flex gap-2">
               <TextField
                  list="product-list"
                  className="w-50"
                  max={10}
                  id="outlined-basic"
                  label="Item ID"
                  variant="outlined"
                  type="number"
                  inputProps={{
                     list: "product-list"
                  }}
               />
               <datalist id="product-list">
                  {combinedArray?.map((data, index) => {
                     return (
                        <option key={index} value={data?.id}>{data?.name}</option>
                     )
                  })}
               </datalist>
               <TextField
                  className="w-50"
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  inputRef={quantityInputRef}
               />
            </div>
         </div>
         <table className="table table-striped text-center">
            <thead>
               <tr>
                  <th scope="col">#</th>
                  <th scope="col">Item</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Qnt</th>
                  <th scope="col">Total</th>
               </tr>
            </thead>
            <tbody>
               {purchasedItems && (
                  <>
                     {purchasedItems?.map((item, index) => (
                        <tr key={index}>
                           <th scope="row">{index + 1}</th>
                           <td className="px-0">
                              <img
                                 style={{ width: "50px", height: "50px" }}
                                 src={item.image}
                                 alt={item.name}
                              />
                           </td>
                           <td className="px-0">{item.name}</td>
                           <td className="px-0">
                              <input
                                 className="text-center border-0 bg-transparent w-100"
                                 value={formatRupees(item.price)}
                                 onChange={(e) =>
                                    handlePriceChange(
                                       index,
                                       e.target.value
                                    )
                                 }
                                 type="number"
                              />
                           </td>
                           <td className="px-0">
                              <input
                                 className="text-center border-0 bg-transparent w-100"
                                 value={item.quantity}
                                 onChange={(e) =>
                                    handleQuantityChange(
                                       index,
                                       e.target.value
                                    )
                                 }
                                 type="number"
                              />
                           </td>
                           <td className="px-0">{formatRupees(item?.total)}</td>
                           <td className="px-0 py-1">
                              <Button className="p-0 m-1">
                                 <DeleteIcon
                                    onClick={() =>
                                       handleDeleteItem(index)
                                    }
                                    color="red"
                                 />{" "}
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </>
               )}
            </tbody>
         </table>
         <p className="float-end pe-2">Total : {totalPrice}</p>
         <br />
         {purchasedItems?.length > 0 &&
            <div className="mb-5 pb-5">
               <div className="w-100">
                  <ColorButton onClick={() => navigate("/confirm-bill")}>Print</ColorButton>
               </div>
            </div>
         }
      </Container>
   );
}
