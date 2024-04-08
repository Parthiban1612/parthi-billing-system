import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import AppRouter from './routes/AppRouter';
import { Provider } from "react-redux";
import { makeStore } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

const { store, persistor } = makeStore();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AppRouter />
        </PersistGate>
    </Provider >
);

reportWebVitals();
