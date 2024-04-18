import React, { useEffect, useState, useRef } from "react";
import CustomizedButtons from "../../components/CustomizedButtons";
import { Button, Container, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import carrot from "../../images/carrot.png";
import beans from "../../images/beans.png";
import beat from "../../images/beat.png";
import avara from "../../images/avara.png";
import chilly from "../../images/chilly.png";
import sambar from "../../images/sambar.png";
import capsi from "../../images/capsi.png";
import ginger from "../../images/ginger.png";
import pattani from "../../images/pattani.png";
import drum_stick from "../../images/drumstick.png";
import brinjal from "../../images/brinjal_vari.png";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import BottomNavigation from "../../components/bottom-nav/BottomNavigation";
// import html2canvas from 'html2canvas';
// import html2pdf from 'html2pdf.js';

const combinedArray = [
   { id: 1, image: carrot, name: "Carrot", price: 70 },
   { id: 2, image: beat, name: "Beatroot", price: 35 },
   { id: 3, image: beans, name: "Beans", price: 65 },
   { id: 4, image: brinjal, name: "Vari", price: 20 },
   { id: 5, image: avara, name: "Avara", price: 20 },
   { id: 6, image: ginger, name: "Ginger", price: 120 },
   { id: 7, image: drum_stick, name: "Drum stick", price: 20 },
   { id: 8, image: capsi, name: "Capsicum", price: 40 },
   { id: 9, image: sambar, name: "Sambar", price: 45 },
   { id: 10, image: chilly, name: "Chilly", price: 35 },
   { id: 11, image: pattani, name: "Pattani", price: 65 },
];

export default function CreateBill() {
   const [priceList, setPriceList] = useState([]);
   const [purchasedItems, setPurchasedItems] = useState([]);
   const [totalPrice, setTotalPrice] = useState(0);
   const quantityInputRef = useRef(null);

   // const { authDetails } = useSelector((state) => state.authData)

   useEffect(() => {
      if (!localStorage?.getItem("combinedArray")) {
         localStorage.setItem("combinedArray", JSON.stringify(combinedArray));
      }
      const storedCombinedArray = JSON.parse(
         localStorage.getItem("combinedArray")
      );
      setPriceList(storedCombinedArray);
   }, []);

   useEffect(() => {
      const storedCombinedArray = JSON.parse(
         localStorage.getItem("currentBill")
      );
      setPurchasedItems(storedCombinedArray);
   }, []);

   const handleGetProduct = (productId, quantity) => {
      const selectedItem = priceList.find((item) => item.id === productId);
      const newItem = { ...selectedItem, quantity: parseInt(quantity) };
      setPurchasedItems((prevItems) => [...(prevItems || []), newItem]); // Ensuring prevItems is always an array
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
      const productId = parseInt(
         document.getElementById("outlined-basic").value
      );
      const quantity = parseInt(quantityInputRef.current.value);
      if (!isNaN(productId) && !isNaN(quantity)) {
         handleGetProduct(productId, quantity);
         document.getElementById("outlined-basic").value = "";
      }
   };

   const handleQuantityChange = (index, quantity) => {
      const updatedItems = [...purchasedItems];
      updatedItems[index].quantity = parseInt(quantity);
      setPurchasedItems(updatedItems);
      localStorage.setItem("currentBill", JSON.stringify(updatedItems));
   };

   const handlePriceChange = (index, price) => {
      const updatedItems = [...purchasedItems];
      updatedItems[index].price = parseInt(price);
      setPurchasedItems(updatedItems);
      localStorage.setItem("currentBill", JSON.stringify(updatedItems));
   };

   const handleDeleteItem = (id) => {
      const updatedItems = purchasedItems.filter(
         (item, _index) => _index !== id
      );
      setPurchasedItems(updatedItems);
      localStorage.setItem("currentBill", JSON.stringify(updatedItems));
   };

   // const billingData = [
   //    {
   //       invoiceNumber: "INV-001",
   //       date: "2024-04-07",
   //       customerName: "John Doe",
   //       address: "123 Main St, City, Country"
   //    },
   //    {
   //       invoiceNumber: "INV-002",
   //       date: "2024-04-08",
   //       customerName: "Jane Smith",
   //       address: "456 Elm St, Town, Country"
   //    },
   //    // Add more billing data objects as needed
   // ];

   const pdfRef = useRef(null);

   // const generatePDF = () => {
   //    const element = pdfRef.current;

   //    html2canvas(element).then(canvas => {
   //       const pdf = new html2pdf();
   //       pdf.from(canvas).save('billing_list.pdf');
   //    });
   // };

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
               <input
                  list="product-list"
                  className="w-50"
                  max={10}
                  id="outlined-basic"
                  label="Item ID"
                  variant="outlined"
                  type="number"
               />
               <datalist id="product-list">
                  <option value={'1'}>Carrot</option>
                  <option value={'2'}>Beatroot</option>
                  <option value={'3'}>Beans</option>
                  <option value={'4'}>Brinjal</option>
                  <option value={'5'}>Broad Beans</option>
                  <option value={'6'}>Ginger</option>
                  <option value={'7'}>Drum stick</option>
               </datalist>
               <TextField
                  className="w-50"
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  inputRef={quantityInputRef}
               />
            </div>
            {/* {purchasedItems?.length > 0 && (
               <div ref={pdfRef} className="my-4">
                  <table className="table table-striped text-center">
                     <thead>
                        <tr>
                           <th scope="col">#</th>
                           <th scope="col">Item</th>
                           <th scope="col">Name</th>
                           <th scope="col">Rs</th>
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
                                    <td>
                                       <img
                                          style={{ width: "50px", height: "50px" }}
                                          src={item.image}
                                          alt={item.name}
                                       />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>
                                       <input
                                          className="text-center border-0 bg-transparent w-100"
                                          value={item.price}
                                          onChange={(e) =>
                                             handlePriceChange(
                                                index,
                                                e.target.value
                                             )
                                          }
                                          type="number"
                                       />
                                    </td>
                                    <td>
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
                                    <td>{item.price * item.quantity}</td>
                                    <td className="p-1">
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
                  <h5 className="float-end">Total : {totalPrice}</h5>
               </div>
            )} */}
         </div>
         <div>
            {/* <button onClick={generatePDF}>Generate PDF</button> */}
            <div ref={pdfRef}>
               <table className="table table-striped text-center">
                  <thead>
                     <tr>
                        <th scope="col">#</th>
                        <th scope="col">Item</th>
                        <th scope="col">Name</th>
                        <th scope="col">Rs</th>
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
                                 <td>
                                    <img
                                       style={{ width: "50px", height: "50px" }}
                                       src={item.image}
                                       alt={item.name}
                                    />
                                 </td>
                                 <td>{item.name}</td>
                                 <td>
                                    <input
                                       className="text-center border-0 bg-transparent w-100"
                                       value={item.price}
                                       onChange={(e) =>
                                          handlePriceChange(
                                             index,
                                             e.target.value
                                          )
                                       }
                                       type="number"
                                    />
                                 </td>
                                 <td>
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
                                 <td>{item.price * item.quantity}</td>
                                 <td className="p-1">
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
               <p className="float-end mb-0 pe-2">Total : {totalPrice}</p>
            </div>
         </div>
      </Container>
   );
}
