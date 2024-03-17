import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";

const ColorButton = styled(Button)(({ theme }) => ({
   color: theme.palette.getContrastText(purple[500]),
   backgroundColor: purple[500],
   "&:hover": {
      backgroundColor: purple[700],
   },
}));

export default function CustomizedButtons({ path, type }) {
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
         className="w-50"
         startIcon={
            type === "create" ? <ReceiptLongIcon /> : <CurrencyRupeeIcon />
         }
         variant="contained"
      >
         {type === "create" ? "Create bill" : "Set price"}
      </ColorButton>
   );
}
