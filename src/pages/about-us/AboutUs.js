import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import CustomBack from '../../components/custom-back/CustomBack'

export default function AboutUs() {
  return (
    <>
      <CustomBack title={"About us"} />
      <Container>
        <Box pt={7}>
          <Typography sx={{ textAlign: "justify", marginBottom: 1 }}>
            Welcome to Parthi billing system, the creators of the innovative Retail Billing System. Our mission is to simplify the billing process for retail stores, helping them save time and improve efficiency.
          </Typography>
          <Typography sx={{ textAlign: "justify", marginBottom: 1 }}>
            At Parthi billing system, we understand the challenges faced by retail businesses when it comes to managing billing and inventory. That's why we developed our billing system to be user-friendly, intuitive, and packed with features that make billing a breeze.
          </Typography>
          <Typography sx={{ textAlign: "justify", marginBottom: 1 }}>
            With our Retail Billing System, you can easily add, edit, and manage your shop items, create bills for customers with just a few clicks, and generate PDF invoices for easy sharing and record-keeping. Our system also allows you to filter past bills by date, giving you quick access to your billing history.
          </Typography>
          <Typography sx={{ textAlign: "justify", marginBottom: 1 }}>
            Our team is dedicated to providing top-notch support and ensuring that our billing system meets the needs of our users. We are constantly updating and improving our system to provide you with the best possible experience.
          </Typography>
          <Typography sx={{ textAlign: "justify", marginBottom: 1 }}>
            Join the thousands of retail businesses that have already simplified their billing process with Parthi billing system. Sign up for a free trial today and experience the difference!
          </Typography>
        </Box>
      </Container>
    </>
  )
}
