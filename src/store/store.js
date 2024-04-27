import storage from "./customStorage";
import { persistReducer, persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const persistConfig = {
   key: "root",
   storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
   const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware({
            serializableCheck: false,
         }),
   });

   const persistor = persistStore(store);

   return { store, persistor };
};
