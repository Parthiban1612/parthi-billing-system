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
    };
  }

  canvasEl;

  componentDidMount() {

    const storedCombinedArray = JSON.parse(localStorage.getItem("currentBill"));
    this.setState({ purchasedItems: storedCombinedArray || [] });

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
    const formattedDate = moment(this.state.date).format("DD-MM-YYYY");

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
        <div id="divToTakeScreenshot" className="px-2">
          <div className="row align-items-center ms-1 pt-2">
            <div className="col-12 mb-0">
              <p className="mb-0 text-end me-2" style={{ opacity: .6, fontSize: "12px" }}>parthi-billing-system</p>
            </div>
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
                <FaRegCalendarAlt color="#9c27b0" size={33} />
                <DatePicker
                  className="w-100 border-0 fw-bold"
                  popperPlacement="top-start" // or "top-end", "bottom-start", "bottom-end", etc.
                  selected={new Date()}
                  onChange={(date) => console.log(date)} />
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
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrint ref={ref} text={props.text} total={props?.totalPrice} />;
});
