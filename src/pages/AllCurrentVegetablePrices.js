import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import carrot from "../images/carrot.png";
import beans from "../images/beans.png";
import beat from "../images/beat.png";
import avara from "../images/avara.png";
import chilly from "../images/chilly.png";
import sambar from "../images/sambar.png";
import capsi from "../images/capsi.png";
import ginger from "../images/ginger.png";
import pattani from "../images/pattani.png";
import drum_stick from "../images/drumstick.png";
import brinjal from "../images/brinjal_vari.png";
import { useEffect, useState } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
   },
   // hide last border
   "&:last-child td, &:last-child th": {
      border: 0,
   },
}));

// Separate arrays for each property
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

export default function AllCurrentVegetablePrices() {
   const [priceList, setPriceList] = useState([]);

   useEffect(() => {
      if (!localStorage?.getItem("combinedArray")) {
         localStorage.setItem("combinedArray", JSON.stringify(combinedArray));
      }
      const storedCombinedArray = JSON.parse(
         localStorage.getItem("combinedArray")
      );
      setPriceList(storedCombinedArray);
   }, []);

   const handlePriceChange = (index, newPrice) => {
      const updatedPriceList = [...priceList];
      updatedPriceList[index].price = newPrice;
      setPriceList(updatedPriceList);
      localStorage.setItem("combinedArray", JSON.stringify(updatedPriceList));
   };

   return (
      <TableContainer component={Paper}>
         <Table aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Image</StyledTableCell>
                  <StyledTableCell className="text-center">
                     Vegetable name
                  </StyledTableCell>
                  <StyledTableCell align="right">Price</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {priceList.map((row, index) => (
                  <StyledTableRow key={row.name}>
                     <StyledTableCell component="th" scope="row">
                        <img
                           style={{ width: "50px", height: "50px" }}
                           src={row?.image}
                           alt=""
                        />
                     </StyledTableCell>
                     <StyledTableCell
                        className="w-100 text-center"
                        component="th"
                        scope="row"
                     >
                        {row.name}
                     </StyledTableCell>
                     <StyledTableCell className="w-100" align="right">
                        <input
                           type="number"
                           className="w-100 text-end border-0 bg-transparent"
                           value={priceList[index].price} // Corrected line
                           onChange={(e) =>
                              handlePriceChange(index, parseInt(e.target.value))
                           }
                        />
                     </StyledTableCell>
                  </StyledTableRow>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
}
