import React from "react";
import { Container } from "@mui/material";
import BottomNavigation from "../components/bottom-nav/BottomNavigation";

export default function Home() {

   return (
      <Container>
         <div className="row align-items-center justify-content-center gap-2 my-5">
            <p className="text-center poppins-semibold">Parthi billing system</p>
         </div>
         <BottomNavigation />
      </Container>
   );
}
