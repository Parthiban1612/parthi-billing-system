import * as React from "react";
import { formatRupees } from "../../lib/convertRuppee";
import html2canvas from "html2canvas";
import moment from "moment/moment";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TextField } from "@mui/material";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FaDownload, FaIndianRupeeSign } from "react-icons/fa6";
import DatePicker from "react-datepicker";

export class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
    this.state = {
      purchasedItems: [],
      date: new Date(),
      customerName: "",
      balanceAmountTotal: "",
      finalTotal: "",
      paidAmountTotal: ""
    };
  }

  canvasEl;

  componentDidMount() {

    const storedCombinedArray = JSON.parse(localStorage.getItem("currentBill"));
    this.setState({ purchasedItems: storedCombinedArray || [] });

    const storedPendingAmounts = JSON.parse(localStorage.getItem("pendingAmounts"));
    const balanceAmountTotal = storedPendingAmounts
      .filter(item => item.value > 0) // Get only positive values
      .reduce((sum, item) => sum + item.value, 0); // Sum the values
    this.setState({ balanceAmountTotal: balanceAmountTotal });
    const varavuAmountTotal = storedPendingAmounts
      .filter(item => item.value < 0) // Get only positive values
      .reduce((sum, item) => sum + item.value, 0); // Sum the values
    this.setState({ paidAmountTotal: varavuAmountTotal });

    const finalTotal = storedPendingAmounts.reduce((acc, amount) => acc + amount.value, 0);
    this.setState({ finalTotal: finalTotal });

    console.log(finalTotal);

    const ctx = this.canvasEl.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(95, 50, 40, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = "rgb(200, 0, 0)";
      ctx.fillRect(85, 40, 20, 20);
      ctx.save();
    }
  }

  handleCheckboxOnChange = () =>
    this.setState({ checked: !this.state.checked });

  setRef = (ref) => (this.canvasEl = ref);

  //...............

  takeScreenShot = () => {
    const element = document.getElementById("divToTakeScreenshot");
    if (!element) {
      return;
    }
    html2canvas(element).then((canvas) => {
      let image = canvas.toDataURL("image/jpeg");
      const a = document.createElement("a");
      a.href = image;
      a.download = `${this.state.customerName}_${moment(this.state.date).format("DD-MM-YYYY")}.jpg`;
      a.click();
    }).catch(err => {
      console.log("Error to take screen shot");
    })
  }

  render() {

    const purchasedItems = this.state?.purchasedItems;


    const balanceAmountTotal = this.state.balanceAmountTotal;

    const paidAmountTotal = this.state.paidAmountTotal;

    return (
      <div className="relativeCSS">
        <Stack className="mb-1 px-2 pt-2" direction="row" spacing={2}>
          <Button
            className="w-100"
            onClick={this.takeScreenShot}
            variant="contained"
            color="secondary"
            startIcon={<FaDownload />}>
            Download
          </Button>
        </Stack>
        <style type="text/css" media="print">
          {"@page { size: landscape; }"}
        </style>
        <div className="flash" />
        <div id="divToTakeScreenshot" className="p-2">
          <div className="bill-container">
            <div className="contact mb-0">
              <div>
                <strong style={{ color: "green" }}>MANI</strong>
                <br />
                <span style={{ color: "green" }}>96556 02225</span>
                <br />
                <span style={{ color: "green" }}>63830 34607</span>
              </div>
              <div className="d-flex flex-column gap-0">
                <p className="mb-0" style={{ color: "green", fontWeight: "bold", textAlign: "center" }}>
                  பொறையாத்தம்மன் துணை
                </p>
                <p className="mb-0" style={{ color: "green", fontWeight: "bold", textAlign: "center" }}>
                  ஓம் ஆதிபராசக்தி துணை
                </p>
              </div>
              <div>
                <strong style={{ color: "green" }}>MARI</strong>
                <br />
                <span style={{ color: "green" }}>80723 36539</span>
              </div>
            </div>
            <div className="header position-relative">
              <h1 className="mt-0">
                <span style={{ fontFamily: "serif", left: "130px", top: "5px", transform: "rotate(-15deg)", fontSize: "15px", display: "inline-block" }}>Carrot</span> MANI
              </h1>
              <p className="fw-bold">மொத்தம் மற்றும் சில்லறை வியாபாரம்</p>
              <p className="fw-bold" style={{ color: "#b30059" }}>
                C-24,C-29, பெரியார் காய்கறி மார்கெட் கோயம்பேடு, சென்னை-92
              </p>
              <hr className="my-1" style={{ border: "1px solid green" }} />
            </div>
            <div className="details"></div>
            <div className="handwritten"></div>
          </div>
          <div className="row align-items-center ms-1">
            {/* <div className="col-12 mb-0">
              <p className="mb-0 text-end me-2" style={{ opacity: .6, fontSize: "12px" }}>parthi-billing-system</p>
            </div> */}
            <div className="col-8">
              <TextField
                className="w-100"
                id="standard-basic"
                variant="standard"
                label="Customer name"
                onChange={(e) => this.setState({ customerName: e.target.value })}
              />
            </div>
            <div className="col-4 ps-0">
              <div className="d-flex align-center gap-2 mt-3">
                {/* <FaRegCalendarAlt color="#9c27b0" size={33} /> */}
                <DatePicker
                  format="DD-MM-YYYY"
                  className="w-100 border-0 fw-bold"
                  popperPlacement="top-start" // or "top-end", "bottom-start", "bottom-end", etc.
                  selected={this.state.date}
                  dateFormat="dd-MM-yyyy"
                  onChange={(date) => this.setState({ date: date })} />
              </div>
            </div>
          </div>
          <table className="testClass table table-striped text-center mt-2">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Item</th>
                <th scope="col">Name</th>
                <th scope="col">Qnt</th>
                <th scope="col">Price</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="d-none">
                <td>
                  <canvas height="100" ref={this.setRef} width="200">
                    Your browser does not support the HTML5 canvas tag.
                  </canvas>
                </td>
              </tr>
              {purchasedItems && (
                <>
                  {purchasedItems?.map((item, index) => (
                    <tr key={index} className="table-row">
                      <th scope="row">{index + 1}</th>
                      <td className="px-0">
                        <img
                          style={{ width: "50px", height: "50px" }}
                          src={item.image}
                          alt={item.name}
                        />
                      </td>
                      <td className="px-0">{item.name}</td>
                      <td className="px-0">
                        {item.quantity}
                      </td>
                      <td className="px-0">
                        {formatRupees(item.price)}
                      </td>
                      <td className="px-0">{formatRupees(item?.total)}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          <div className="row me-1">
            <p className="fw-bold text-end">Total :
              <FaIndianRupeeSign />
              {formatRupees(this?.props?.total)}</p>
          </div>
          <div className="text-end me-2 d-flex flex-column justify-content-end">
            {balanceAmountTotal > 0 &&
              <>
                <h6>
                  Balance ₹{balanceAmountTotal} <br />
                </h6><hr className="my-2" />
                <h6 >
                  SubTotal ₹{this?.props?.total + balanceAmountTotal}
                </h6>
              </>
            }
            {paidAmountTotal < 0 &&
              <>
                <h6>
                  Varavu ₹{paidAmountTotal}
                </h6>
                <hr className="my-2" />
              </>
            }
          </div>
          {paidAmountTotal < 0 &&
            <h6 className="fw-bold text-end">Final Total: ₹{this?.props?.total + balanceAmountTotal + paidAmountTotal}</h6>
          }
        </div>
      </div>
    );
  }
}
//
export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrint ref={ref} text={props.text} total={props?.totalPrice} />;
});
