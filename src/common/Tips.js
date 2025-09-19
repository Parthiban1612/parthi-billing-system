// File: assets/images/Tips.js

import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Tips = (props) => (
    <Svg
        width={16}
        height={16}
        fill="none"
        {...props}
    >
        <Path
            fill={props.fill || "#938EA2"}
            d="M6 11.333S10.667 12 12.667 14h.666a.667.667 0 0 0 .667-.667V9.291a1.334 1.334 0 0 0 0-2.582V2.667A.667.667 0 0 0 13.333 2h-.666C10.667 4 6 4.667 6 4.667H3.333C2.597 4.667 2 5.264 2 6v4c0 .736.597 1.333 1.333 1.333H4l.667 3.334H6v-3.334Zm1.333-5.559a22.64 22.64 0 0 0 1.627-.412c1.118-.329 2.54-.847 3.707-1.646v8.568c-1.167-.8-2.589-1.317-3.707-1.647a22.621 22.621 0 0 0-1.627-.411V5.774Zm-4 .226H6v4H3.333V6Z"
        />
    </Svg>
)

export default Tips;