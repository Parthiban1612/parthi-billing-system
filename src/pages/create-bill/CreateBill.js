import React, { useEffect, useRef, useState } from "react";
import { Button, Container, TextField, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { orange, purple } from "@mui/material/colors";
import { Autocomplete, Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { combinedArray } from "../../lib/product-list/productList";
import { formatRupees } from "../../lib/convertRuppee";
import lottieRecorder from "../../images/record.json";
import Lottie from "lottie-react";
import { CgPlayStopO } from "react-icons/cg";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from "react-toastify";
import { MdRecordVoiceOver } from "react-icons/md";

export default function CreateBill() {
   const [priceList, setPriceList] = useState([]);
   const [purchasedItems, setPurchasedItems] = useState([]);
   const [totalPrice, setTotalPrice] = useState(0);
   const [pendingAmounts, setPendingAmounts] = useState([]);
   const [extraAmount, setExtraAmount] = useState('');
   const [reason, setReason] = useState('');
   const [productId, setProductId] = useState('');
   const [quantity, setQuantity] = useState('');
   const navigate = useNavigate();

   const [open, setOpen] = useState(false);

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   // Filter positive values and sum them up
   const balanceAmountTotal = pendingAmounts
      .filter(item => item.value > 0) // Get only positive values
      .reduce((sum, item) => sum + item.value, 0); // Sum the values


   // Filter positive values and sum them up
   const paidAmountTotal = pendingAmounts
      .filter(item => item.value < 0) // Get only positive values
      .reduce((sum, item) => sum + item.value, 0); // Sum the values

   useEffect(() => {
      if (!localStorage?.getItem("combinedArray")) {
         localStorage.setItem("combinedArray", JSON.stringify(combinedArray));
      }
      const storedCombinedArray = JSON.parse(localStorage.getItem("combinedArray"));
      setPriceList(storedCombinedArray);

      const storedPendingAmounts = JSON.parse(localStorage.getItem("pendingAmounts"));
      if (storedPendingAmounts) setPendingAmounts(storedPendingAmounts);

      const storedCurrentBill = JSON.parse(localStorage.getItem("currentBill"));
      setPurchasedItems(storedCurrentBill || []);
   }, []);

   useEffect(() => {
      localStorage.setItem("pendingAmounts", JSON.stringify(pendingAmounts));
   }, [pendingAmounts]);

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

   const handleAddItem = (productId, quantity) => {

      if (!isNaN(productId) && !isNaN(quantity)) {

         const selectedItem = priceList.find((item) => item.id === productId);

         const newItem = { ...selectedItem, quantity: parseFloat(quantity), total: quantity * selectedItem?.price };
         setPurchasedItems((prevItems) => [...(prevItems || []), newItem]);
         setProductId('');
         setQuantity('');
         stopListening();
         setIsListening(false);
         // Defer scroll to allow render to complete
         setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }
   };

   const handleQuantityChange = (index, quantity) => {
      const updatedItems = [...purchasedItems];
      updatedItems[index].quantity = parseFloat(quantity);
      updatedItems[index].total = updatedItems[index]?.price * quantity;
      setPurchasedItems(updatedItems);
   };

   const handlePriceChange = (index, price) => {
      const updatedItems = [...purchasedItems];
      updatedItems[index].price = parseFloat(price);
      updatedItems[index].total = updatedItems[index]?.quantity * price;
      setPurchasedItems(updatedItems);
   };

   const handleDeleteItem = (id) => {
      const updatedItems = purchasedItems.filter((_, index) => index !== id);
      setPurchasedItems(updatedItems);
   };

   const handleAddExtraAmount = () => {
      if (!isNaN(extraAmount) && extraAmount.trim() !== '' && reason.trim() !== '') {
         let newExtraAmount;
         if (reason === "Balance") {
            newExtraAmount = { value: parseFloat(extraAmount), reason };
         } else if (reason === "Cash") {
            newExtraAmount = { value: -parseFloat(extraAmount), reason };
         }
         setPendingAmounts((prev) => [...prev, newExtraAmount]);
         setExtraAmount('');
         setReason('');
      }
   };

   const handleRemovePendingAmount = (index) => {
      const updatedPendingAmounts = pendingAmounts.filter((_, i) => i !== index);
      setPendingAmounts(updatedPendingAmounts);
   };

   const ColorButton = styled(Button)(({ theme }) => ({
      fontSize: 13,
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
      "&:hover": {
         backgroundColor: purple[700],
      },
   }));

   const ResetButton = styled(Button)(({ theme }) => ({
      fontSize: 13,
      color: theme.palette.getContrastText(orange[500]),
      backgroundColor: orange[500],
      "&:hover": {
         backgroundColor: orange[700],
      },
   }));

   const finalTotal = totalPrice + pendingAmounts.reduce((acc, amount) => acc + amount.value, 0);

   const [isListening, setIsListening] = useState(false);
   const [mediaStream, setMediaStream] = useState(null);
   const bottomRef = useRef(null);

   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
   const recognition = SpeechRecognition ? new SpeechRecognition() : null;
   useEffect(() => {
      if (!recognition) {
         alert("Speech recognition not supported");
         return;
      }

      const handleStreamStart = async () => {
         try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMediaStream(stream);
         } catch (err) {
            console.error("Microphone error:", err);
         }
      };

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
         setIsListening(true);
         handleStreamStart(); // Start visualizer stream
      };

      recognition.onresult = (event) => {
         const speechToText = event.results[0][0].transcript;
         const lowerText = speechToText.toLowerCase();

         const matchedProduct = combinedArray
            .map((product) => ({
               ...product,
               matchIndex: lowerText.indexOf(product.name.toLowerCase()),
            }))
            .filter((p) => p.matchIndex !== -1)
            .sort((a, b) => b.name.length - a.name.length)[0];

         if (matchedProduct) {
            const qtyMatch = lowerText.match(/(\d+)\s*(kg|kilograms)?/);
            const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;

            setProductId(matchedProduct?.id);
            setQuantity(quantity);
            handleAddItem(matchedProduct?.id, quantity);
         } else {
            toast.error("Doesn't match");
            stopListening();
            setIsListening(false);
         }

         stopListening(); // Ensure everything resets
      };

      recognition.onerror = (event) => {
         console.error("Recognition error:", event.error);
         stopListening();
      };

      recognition.onend = () => {
         stopListening();
      };
   }, [recognition]);

   const startListening = async () => {
      if (recognition && !isListening) {
         try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMediaStream(stream);
            setIsListening(true);
            recognition.start();
         } catch (err) {
            console.error("Microphone access denied", err);
            toast.error("Microphone access denied.");
            setIsListening(false);
         }
      }
   };

   const stopListening = () => {
      if (recognition && isListening) {
         recognition.stop();
         setIsListening(false);

         if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
         }
      }
   };

   return (
      <Container sx={{ padding: 1 }}>
         <React.Fragment>
            <Dialog
               open={open}
               onClose={handleClose}
               aria-labelledby="alert-dialog-title"
               aria-describedby="alert-dialog-description"
            >
               <DialogTitle id="alert-dialog-title">
                  <h6 className="fw-bold">
                     Add balance and Less Cash
                  </h6>
               </DialogTitle>
               <DialogContent className="px-2 pt-2 pb-0">
                  <div className="d-flex mb-3 gap-2 mx-2">
                     <TextField
                        size="small"
                        className="w-50"
                        label="Additional Amount"
                        variant="outlined"
                        value={extraAmount}
                        onChange={(e) => setExtraAmount(e.target.value)}
                        type="number"
                     />
                     <TextField
                        size="small"
                        className="w-50"
                        label="Reason"
                        variant="outlined"
                        select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                     >
                        <MenuItem value="Balance">Balance</MenuItem>
                        <MenuItem value="Cash">Cash</MenuItem>
                     </TextField>
                     <ColorButton onClick={handleAddExtraAmount} className="w-25">
                        Add
                     </ColorButton>

                  </div>
               </DialogContent>
               <DialogActions>
                  <Button onClick={handleClose} autoFocus>
                     Close
                  </Button>
               </DialogActions>
            </Dialog>
         </React.Fragment>
         <div className="sticky-top bg-light mb-2">
            <div>
               <div className="d-flex mb-3 gap-2">
                  <ResetButton className="text-light w-100" onClick={() => {
                     localStorage.removeItem("currentBill");
                     setPurchasedItems([]);
                     setTotalPrice(0);
                     setExtraAmount(0);
                     setPendingAmounts([]);
                  }}>
                     Reset
                  </ResetButton>
                  <Button
                     style={{ fontSize: "13px !important" }}
                     disabled={productId === '' || quantity === ''}
                     className="w-100"
                     variant="contained"
                     onClick={() => handleAddItem(productId, quantity)}
                  >
                     Add Item
                  </Button>
                  <Button
                     style={{ fontSize: "13px !important" }}
                     variant="contained" className="w-100" onClick={handleClickOpen}>
                     Amount
                  </Button>
               </div>
               <div className="d-flex gap-2">
                  <Autocomplete
                     size="small"
                     fullWidth
                     options={combinedArray}
                     getOptionLabel={(option) => option?.name || ''}
                     value={combinedArray.find((option) => option?.id === productId) || null}
                     onChange={(event, newValue) => setProductId(newValue?.id)}
                     renderInput={(params) => (
                        <TextField {...params} label="Product" variant="outlined" />
                     )}
                     renderOption={(props, option) => (
                        <ListItem {...props} key={option.id}>
                           <ListItemAvatar>
                              <Avatar src={option?.image} />
                           </ListItemAvatar>
                           <ListItemText primary={option?.name} />
                        </ListItem>
                     )}
                  />
                  <TextField
                     size="small"
                     className="w-50"
                     label="Quantity"
                     variant="outlined"
                     type="number"
                     value={quantity || ''}
                     onChange={(event) => setQuantity(event.target.value)}
                  />
               </div>
            </div>
            {!isListening &&
               <Button size="small" endIcon={<MdRecordVoiceOver />} className="w-100 mt-2" variant="contained" disabled={isListening} onClick={startListening} color="secondary">Start record</Button>
            }
            {isListening && (
               <div className="d-flex align-items-center justify-content-center">
                  <Lottie style={{ height: "50px" }} animationData={lottieRecorder} loop={true} />
                  <CgPlayStopO onClick={stopListening} disabled={!isListening} size={33} color="red" />
               </div>
            )}
         </div>
         <table className="table table-striped text-center mt-2">
            <thead>
               <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Name</th>
                  <th>Qnt</th>
                  <th>Price</th>
                  <th>Total</th>
               </tr>
            </thead>
            <tbody>
               {purchasedItems.map((item, index) => (
                  <tr key={index}>
                     <th>{index + 1}</th>
                     <td>
                        <img style={{ width: "35px", height: "35px" }} src={item.image} alt={item.name} />
                     </td>
                     <td className="text-start ps-2">{item.name}</td>
                     <td>
                        <input
                           className="text-center border-0 bg-transparent w-100"
                           value={item.quantity}
                           onChange={(e) => handleQuantityChange(index, e.target.value)}
                           type="number"
                        />
                     </td>
                     <td>
                        <input
                           className="text-center border-0 bg-transparent w-100"
                           value={item.price}
                           onChange={(e) => handlePriceChange(index, e.target.value)}
                           type="number"
                        />
                     </td>
                     <td>{formatRupees(item?.total)}</td>
                     <td className="px-0">
                        <Button className="p-0" onClick={() => handleDeleteItem(index)}><DeleteIcon /></Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <div ref={bottomRef} />
         <h6 className="fw-bold float-end me-2 fs-14">Total of the Bill: ₹{totalPrice}</h6>
         <div className="mt-5">
            {pendingAmounts.length > 0 && (
               <div className="mb-3">
                  <ul className="d-flex flex-column w-100 px-0" style={{ listStyleType: "none", padding: 0 }}>
                     {pendingAmounts.map((amount, index) => (
                        <li
                           className="w-100 ps-2 pe-0 p-1"
                           key={index}
                           style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderRadius: "4px",
                           }}
                        >
                           <p className="fs-13">
                              ₹{amount.value} - {amount.reason}
                           </p>
                           <Button onClick={() => handleRemovePendingAmount(index)} >
                              <DeleteIcon />
                           </Button>
                        </li>
                     ))}
                  </ul>
               </div>
            )}
         </div>
         <div className="text-end me-2">
            <p className="mb-0 fs-13">
               Total ₹{totalPrice}
            </p>
            <p className="mb-0 fs-13">
               Balance ₹{balanceAmountTotal} <br />
            </p>
            <hr />
            <p className="mb-0 fs-13">
               SubTotal ₹{totalPrice + balanceAmountTotal}
            </p>
            <p className="mb-0 fs-13">
               Cash ₹{paidAmountTotal}
            </p>
            <hr />
         </div>
         <p className="text-end fs-14 fw-bold">Final Total: ₹{finalTotal}</p>
         <div className="d-flex mb-3 pb-5 gap-2">
            <ColorButton className="w-100" disabled={!localStorage?.getItem("currentBill")} onClick={() => navigate("/confirm-bill")}>Print</ColorButton>
         </div>
      </Container>
   );
}
