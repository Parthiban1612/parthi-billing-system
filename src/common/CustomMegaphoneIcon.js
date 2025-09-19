import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    width={18}
    height={19}
    fill="none"
    {...props}
  >
    <Path

      fill={props.fill || "#000"}
      d="M18 18a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7.489a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79v10.51Zm-2-1V7.978L9 2.533 2 7.978V17h14Z"
    />
  </Svg>
)

export default SvgComponent