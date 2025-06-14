import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from "react-redux";
import { makeStore } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from 'react-router-dom';
import BottomNavigation from "./components/bottom-nav/BottomNavigation"
import App from './App';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import ShoppingListApp from './ShoppingListApp';

const { store, persistor } = makeStore();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
                <ToastContainer />
                <BottomNavigation />
                {/* <ShoppingListApp /> */}
            </PersistGate>
        </Provider >
    </BrowserRouter>

);

reportWebVitals();
