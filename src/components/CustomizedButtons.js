import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { green } from "@mui/material/colors";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";

const ColorButton = styled(Button)(({ theme }) => ({
   // color: theme.palette.getContrastText(white[500]),
   backgroundColor: green[500],
   "&:hover": {
      backgroundColor: green[700],
   },
}));

export default function CustomizedButtons({ path, type, name, fullWidth }) {
   const navigate = useNavigate();
   return (
      <ColorButton
         onClick={() => {
            if (type === "create") {
               localStorage.removeItem("currentBill");
               navigate(path);
            } else {
               navigate(path);
            }
         }}
         // style={{ color: "white !important" }}
         className={`${fullWidth ? "w-100" : `w-50`}`}
         startIcon={
            type === "create" ? <ReceiptLongIcon /> : <CurrencyRupeeIcon />
         }
         variant="contained"
      >
         {name}
      </ColorButton>
   );
}
