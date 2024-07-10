import { Box, Container, Typography } from "@mui/material";
import React from "react";
import CustomizedButtons from "../components/CustomizedButtons";
import axios from "axios";
import { IoCall } from "react-icons/io5";

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
         {/* <CustomizedButtons fullWidth name='Stack' path={"/stack"} />
         <div className="my-3">
            <CustomizedButtons fullWidth name='Customers Pending' path={"/customers-pending"} />
         </div> */}

         {/* <button className="btn btn-success" onClick={handlePost}>Post</button> */}

         <Box>
            <Typography className='text-muted' sx={{ fontSize: "15px", textAlign: "justify", marginBottom: 1 }}>
               Welcome to Parthi billing system, the creators of the innovative Retail Billing System. Our mission is to simplify the billing process for retail stores, helping them save time and improve efficiency.
            </Typography>
            <Typography className='text-muted' sx={{ fontSize: "15px", textAlign: "justify", marginBottom: 1 }}>
               At Parthi billing system, we understand the challenges faced by retail businesses when it comes to managing billing and inventory. That's why we developed our billing system to be user-friendly, intuitive, and packed with features that make billing a breeze.
            </Typography>
            <Typography className='text-muted' sx={{ fontSize: "15px", textAlign: "justify", marginBottom: 1 }}>
               With our Retail Billing System, you can easily add, edit, and manage your shop items, create bills for customers with just a few clicks, and generate PDF invoices for easy sharing and record-keeping. Our system also allows you to filter past bills by date, giving you quick access to your billing history.
            </Typography>
            <Typography className='text-muted' sx={{ fontSize: "15px", textAlign: "justify", marginBottom: 1 }}>
               Our team is dedicated to providing top-notch support and ensuring that our billing system meets the needs of our users. We are constantly updating and improving our system to provide you with the best possible experience.
            </Typography>
            <Typography className='text-muted' sx={{ fontSize: "15px", textAlign: "justify", marginBottom: 1 }}>
               Join the thousands of retail businesses that have already simplified their billing process with Parthi billing system. Sign up for a free trial today and experience the difference!
            </Typography>
            <Typography className='text-muted' sx={{ fontSize: "15px", textAlign: "justify", marginBottom: 1 }}>
               Have questions or need support? Contact our developers at <IoCall className='mx-1' color='#9c27b0' size={15} />
               <a href="tel:6383044009">+91 6383044009</a>
            </Typography>
         </Box>
      </Container>
   );
}
