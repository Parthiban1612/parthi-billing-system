import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import CustomBack from "../components/custom-back/CustomBack";
import axios from "axios";
import { Config } from "../api/config";
import { combinedArray } from "../lib/product-list/productList"

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


export default function AllCurrentVegetablePrices() {
   const [priceList, setPriceList] = useState([]);

   console.log(priceList);

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

   const [productsList, setProductsList] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // useEffect(() => {
   //    const fetchData = async () => {
   //       try {
   //          const response = await axios.get(Config.GET_ALL_PRODUCTS);
   //          setProductsList(response.data);
   //       } catch (err) {
   //          setError(err);
   //       } finally {
   //          setLoading(false);
   //       }
   //    };

   //    fetchData();
   // }, []);

   return (
      <>
         <CustomBack title={"Set products rate"} />
         <Container sx={{ padding: 1 }}>
            <Box pt={6}>
               <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                     <TableHead>
                        <TableRow>
                           <StyledTableCell align="right">Id</StyledTableCell>
                           <StyledTableCell>Image</StyledTableCell>
                           <StyledTableCell className="text-center">
                              Vegetable name
                           </StyledTableCell>
                           <StyledTableCell align="right">Price</StyledTableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {priceList?.map((row, index) => (
                           <StyledTableRow key={index}>
                              <StyledTableCell
                                 className="text-center"
                                 component="th"
                                 scope="row"
                              >
                                 {row.id}
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                 <img
                                    style={{ width: "50px", height: "50px" }}
                                    src={row?.image}
                                    alt="" />
                              </StyledTableCell>
                              <StyledTableCell
                                 className="w-100 text-center"
                                 component="th"
                                 scope="row"
                              >
                                 {row?.name}
                              </StyledTableCell>
                              <StyledTableCell className="w-100" align="right">
                                 <input
                                    type="number"
                                    className="w-100 text-end border-0 bg-transparent"
                                    value={row?.price} // Corrected line
                                    onChange={(e) => handlePriceChange(index, parseInt(e.target.value))}
                                 />
                              </StyledTableCell>
                           </StyledTableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Box>
         </Container>
      </>
   );
}
