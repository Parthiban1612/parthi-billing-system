import React from "react";
import CustomizedButtons from "../components/CustomizedButtons";

export default function Home() {
   return (
      <div className="container">
         <div className="row align-items-center justify-content-center gap-2 my-5">
            <h3 className="text-center">Selva vegetables</h3>
            <h6 className="text-center">Parthi billing system</h6>
            <CustomizedButtons path={"/create-bill"} type={"create"} />
         </div>
      </div>
   );
}
