import { Container } from "@mui/material";
import React from "react";
import CustomizedButtons from "../components/CustomizedButtons";
import axios from "axios";

export default function Home() {

   const handlePost = () => {
      axios.post("https://api-parthi-billing-system-v2.vercel.app/products", {
         id: 11,
         title: 'Added from front end'
      })
         .then(function (response) {
            console.log(response);
         })
         .catch(function (error) {
            console.log(error);
         });
   }

   return (
      <Container sx={{ padding: 1 }}>
         <h3>Home</h3>
         <CustomizedButtons fullWidth name='Stack' path={"/stack"} />
         <div className="my-3">
            <CustomizedButtons fullWidth name='Customers Pending' path={"/customers-pending"} />
         </div>

         <button className="btn btn-success" onClick={handlePost}>Post</button>

      </Container>
   );
}
