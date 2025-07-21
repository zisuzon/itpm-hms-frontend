import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

// core styles
import "./scss/volt.scss";

// vendor styles
import "react-datetime/css/react-datetime.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import { ToastProvider } from "./shared/context/toast-context";

ReactDOM.render(
  <HashRouter>
    <ScrollToTop />
    <ToastProvider>
      <HomePage />
    </ToastProvider>
  </HashRouter>,
  document.getElementById("root")
);
