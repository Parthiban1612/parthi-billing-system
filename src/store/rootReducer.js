import { combineReducers } from "redux";
import loginSlice from "./slices/auth";

const rootReducer = combineReducers({
   authData: loginSlice,
});

export default rootReducer;
