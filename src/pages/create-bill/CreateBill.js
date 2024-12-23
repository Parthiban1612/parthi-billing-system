// import React, { useEffect, useState } from "react";
import CustomizedButtons from "../../components/CustomizedButtons";
// import { Button, Container, TextField } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { combinedArray } from "../../lib/product-list/productList";
// import { styled } from "@mui/material/styles";
// import { purple } from "@mui/material/colors";
// import { useNavigate } from "react-router-dom";
// import { formatRupees } from "../../lib/convertRuppee";
// import { Autocomplete, Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
// import { FaIndianRupeeSign } from "react-icons/fa6";

// export default function CreateBill() {
//    const [priceList, setPriceList] = useState([]);
//    const [purchasedItems, setPurchasedItems] = useState([]);
//    const [totalPrice, setTotalPrice] = useState(0);
//    const navigate = useNavigate();
//    const [productId, setProductId] = useState('');
//    const [quantity, setQuantity] = useState('');



//    useEffect(() => {
//       if (!localStorage?.getItem("combinedArray")) {
//          localStorage.setItem("combinedArray", JSON.stringify(combinedArray));
//       }
//       const storedCombinedArray = JSON.parse(localStorage.getItem("combinedArray"));
//       setPriceList(storedCombinedArray);
//    }, []);

//    useEffect(() => {
//       const storedCombinedArray = JSON.parse(localStorage.getItem("currentBill"));
//       setPurchasedItems(storedCombinedArray || []);
//    }, []);

//    const handleGetProduct = (productId, quantity) => {
//       const selectedItem = priceList.find((item) => item.id === productId);
//       const newItem = { ...selectedItem, quantity: parseInt(quantity), total: quantity * selectedItem?.price };
//       setPurchasedItems((prevItems) => [...(prevItems || []), newItem]);
//       setQuantity(null);
//       setProductId(null);
//    };

//    useEffect(() => {
//       if (Array.isArray(purchasedItems) && purchasedItems.length > 0) {
//          const total = purchasedItems.reduce(
//             (acc, item) => acc + item.price * item.quantity,
//             0
//          );
//          setTotalPrice(total);
//          localStorage.setItem("currentBill", JSON.stringify(purchasedItems));
//       }
//    }, [purchasedItems]);

//    const handleAddItem = () => {
//       if (!isNaN(productId) && !isNaN(quantity)) {
//          handleGetProduct(productId, quantity);
//          setProductId(null);
//          setQuantity('');
//       }
//    };

//    const handleQuantityChange = (index, quantity) => {
//       const updatedItems = [...purchasedItems];
//       updatedItems[index].quantity = parseFloat(quantity); // Use parseFloat to allow .5 values
//       updatedItems[index].total = purchasedItems[index]?.price * quantity; // Use parseFloat to allow .5 values
//       setPurchasedItems(updatedItems);
//       localStorage.setItem("currentBill", JSON.stringify(updatedItems));
//    };

//    const handlePriceChange = (index, price) => {
//       const updatedItems = [...purchasedItems];
//       updatedItems[index].price = parseFloat(price); // Use parseFloat to allow .5 values
//       updatedItems[index].total = purchasedItems[index]?.quantity * price; // Use parseFloat to allow .5 values
//       setPurchasedItems(updatedItems);
//       localStorage.setItem("currentBill", JSON.stringify(updatedItems));
//    };

//    const handleDeleteItem = (id) => {
//       const updatedItems = purchasedItems.filter((_, _index) => _index !== id);
//       setPurchasedItems(updatedItems);
//       localStorage.setItem("currentBill", JSON.stringify(updatedItems));
//    };

//    const ColorButton = styled(Button)(({ theme }) => ({
//       color: theme.palette.getContrastText(purple[500]),
//       backgroundColor: purple[500],
//       "&:hover": {
//          backgroundColor: purple[700],
//       },
//    }));

//    return (
//       <Container sx={{ padding: 1 }}>
//          <div>
//             <div className="d-flex my-3 gap-1">
//                <CustomizedButtons name='Set Price' path={"/all-prices"} />
//                <Button
//                   disabled={productId === '' || quantity === ''}
//                   className="w-50"
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={handleAddItem}
//                >
//                   Add
//                </Button>
//             </div>
//             <div className="d-flex gap-2">
//                <Autocomplete
//                   fullWidth
//                   id="demo-simple-autocomplete"
//                   options={combinedArray}
//                   getOptionLabel={(option) => option?.name || ''}
//                   value={combinedArray.find((option) => option?.id === productId) || null}
//                   onChange={(event, newValue) => {
//                      setProductId(newValue?.id);
//                   }}
//                   renderInput={(params) => (
//                      <TextField
//                         {...params}
//                         label="Product"
//                         variant="outlined"
//                      />
//                   )}
//                   renderOption={(props, option) => (
//                      <ListItem {...props} key={option.id}>
//                         <ListItemAvatar>
//                            <Avatar src={option?.image} />
//                         </ListItemAvatar>
//                         <ListItemText primary={option?.name} />
//                      </ListItem>
//                   )}
//                />
//                <TextField
//                   className="w-50"
//                   label="Quantity"
//                   variant="outlined"
//                   type="number"
//                   value={quantity || ''}
//                   onChange={(event) => setQuantity(event?.target?.value)}
//                />
//             </div>
//          </div>
//          <table className="table table-striped text-center mt-2">
//             <thead>
//                <tr>
//                   <th scope="col">#</th>
//                   <th scope="col">Item</th>
//                   <th scope="col">Name</th>
//                   <th scope="col">Qnt</th>
//                   <th scope="col">Price</th>
//                   <th scope="col">Total</th>
//                </tr>
//             </thead>
//             <tbody>
//                {purchasedItems && (
//                   <>
//                      {purchasedItems?.map((item, index) => (
//                         <tr key={index}>
//                            <th scope="row">{index + 1}</th>
//                            <td className="px-0">
//                               <img
//                                  style={{ width: "50px", height: "50px" }}
//                                  src={item.image}
//                                  alt={item.name}
//                               />
//                            </td>
//                            <td className="px-0">{item.name}</td>
//                            <td className="px-0">
//                               <input
//                                  className="text-center border-0 bg-transparent w-100"
//                                  value={item.quantity}
//                                  onChange={(e) =>
//                                     handleQuantityChange(
//                                        index,
//                                        e.target.value
//                                     )
//                                  }
//                                  type="number"
//                               />
//                            </td>
//                            <td className="px-0">
//                               <input
//                                  className="text-center border-0 bg-transparent w-100"
//                                  value={formatRupees(item.price)}
//                                  onChange={(e) =>
//                                     handlePriceChange(
//                                        index,
//                                        e.target.value
//                                     )
//                                  }
//                                  type="number"
//                               />
//                            </td>
//                            <td className="px-0">{formatRupees(item?.total)}</td>
//                            <td className="px-0 py-1">
//                               <Button className="p-0 m-1">
//                                  <DeleteIcon
//                                     onClick={() =>
//                                        handleDeleteItem(index)
//                                     }
//                                     color="red"
//                                  />{" "}
//                               </Button>
//                            </td>
//                         </tr>
//                      ))}
//                   </>
//                )}
//             </tbody>
//          </table>
//          <div className="row me-1">
//             <p className="fw-bold text-end">Total :
//                <FaIndianRupeeSign />
//                {totalPrice}</p>
//          </div>
//          <div className="mx-2">
//             {purchasedItems?.length > 0 &&
//                <div className="mb-5 pb-3">
//                   <ColorButton className="w-100" onClick={() => navigate("/confirm-bill")}>Print</ColorButton>
//                </div>
//             }
//          </div>
//       </Container >
//    );
// }

import React, { useEffect, useState } from "react";
import { Button, Container, TextField, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { Autocomplete, Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { combinedArray } from "../../lib/product-list/productList";
import { formatRupees } from "../../lib/convertRuppee";


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

   const handleAddItem = () => {
      if (!isNaN(productId) && !isNaN(quantity)) {
         const selectedItem = priceList.find((item) => item.id === productId);
         const newItem = { ...selectedItem, quantity: parseFloat(quantity), total: quantity * selectedItem?.price };
         setPurchasedItems((prevItems) => [...(prevItems || []), newItem]);
         setProductId('');
         setQuantity('');
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
         } else if (reason === "Varavu") {
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
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
      "&:hover": {
         backgroundColor: purple[700],
      },
   }));

   const finalTotal = totalPrice + pendingAmounts.reduce((acc, amount) => acc + amount.value, 0);

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
                     Add balance and Less Varavu
                  </h6>
               </DialogTitle>
               <DialogContent className="px-2 pt-2 pb-0">
                  <div className="d-flex mb-3 gap-2 mx-2">
                     <TextField
                        className="w-50"
                        label="Additional Amount"
                        variant="outlined"
                        value={extraAmount}
                        onChange={(e) => setExtraAmount(e.target.value)}
                        type="number"
                     />
                     <TextField
                        className="w-50"
                        label="Reason"
                        variant="outlined"
                        select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                     >
                        <MenuItem value="Balance">Balance</MenuItem>
                        <MenuItem value="Varavu">Varavu</MenuItem>
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
         <div>
            <div className="d-flex my-3 gap-2">
               <CustomizedButtons name='Set Price' path={"/all-prices"} />
               <Button
                  disabled={productId === '' || quantity === ''}
                  className="w-50"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
               >
                  Add Item
               </Button>
               <Button variant="contained" onClick={handleClickOpen}>
                  Amount
               </Button>
            </div>
            <div className="d-flex gap-2">
               <Autocomplete
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
                  className="w-50"
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  value={quantity || ''}
                  onChange={(event) => setQuantity(event.target.value)}
               />
            </div>
         </div>
         <table className="table table-striped text-center mt-2">
            <thead>
               <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
               </tr>
            </thead>
            <tbody>
               {purchasedItems.map((item, index) => (
                  <tr key={index}>
                     <th>{index + 1}</th>
                     <td>
                        <img style={{ width: "50px", height: "50px" }} src={item.image} alt={item.name} />
                     </td>
                     <td>{item.name}</td>
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
                     <td>
                        <Button onClick={() => handleDeleteItem(index)}><DeleteIcon /></Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <h6 className="fw-bold float-end me-2">Total of the Bill: ₹{totalPrice}</h6>
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
                           <h6>
                              ₹{amount.value} - {amount.reason}
                           </h6>
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
            <h6>
               Total {totalPrice}
            </h6>
            <h6>
               Balance {balanceAmountTotal} <br />
            </h6>
            <hr />
            <h6>
               SubTotal {totalPrice + balanceAmountTotal}
            </h6>
            <h6>
               Varavu {paidAmountTotal}
            </h6>
            <hr />
         </div>
         <h6 className="fw-bold text-end">Final Total: ₹{finalTotal}</h6>
         <div className="d-flex mb-3 gap-2">
            <ColorButton className="w-100" onClick={() => navigate("/confirm-bill")}>Print</ColorButton>
         </div>
      </Container>
   );
}
