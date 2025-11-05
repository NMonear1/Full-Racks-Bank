import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Welcome from "./components/Welcome";
import Account from "./account/Account.jsx";
import Checking from "./account/AccountDetail.jsx";
import CreditCard from "./account/CreditCard.jsx";
import Stocks from "./account/Stocks.jsx";
import Error404 from "./Error404";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />

    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        <Route path="account">
          <Route index element={<Account />} />
          <Route path=":accountId" element={<Checking />} />
        </Route>
        <Route path="credit-card">
          <Route path=":accountId" element={<CreditCard />} />
        </Route>
        <Route path="stocks" element={<Stocks />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  </>
  );
}
