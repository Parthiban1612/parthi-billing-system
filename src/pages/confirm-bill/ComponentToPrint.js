import * as React from "react";
import { formatRupees } from "../../lib/convertRuppee";


export class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
    this.state = {
      purchasedItems: []
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

  render() {

    const purchasedItems = this.state?.purchasedItems;

    return (
      <div className="relativeCSS">
        <style type="text/css" media="print">
          {"@page { size: landscape; }"}
        </style>
        <div className="flash" />
        <table className="testClass table table-striped text-center">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Item</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Qnt</th>
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
                  <tr key={index}>
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
                      {formatRupees(item.price)}
                    </td>
                    <td className="px-0">
                      {item.quantity}
                    </td>
                    <td className="px-0">{formatRupees(item?.total)}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
        <div className="float-end me-3">
          <p className="fw-bold">Total : ₹ {formatRupees(this?.props?.total)}</p>
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrint ref={ref} text={props.text} total={props?.totalPrice} />;
});
