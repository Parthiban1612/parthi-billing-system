import { Container } from "@mui/material";
import React from "react";
import CustomizedButtons from "../components/CustomizedButtons";

export default function Home() {
   return (
      <Container sx={{ padding: 1 }}>
         <h3>Home</h3>
         <CustomizedButtons fullWidth name='Stack' path={"/stack"} />
      </Container>
   );
}
