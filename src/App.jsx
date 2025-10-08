import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Welcome from "./components/Welcome";
import Account from "./components/Account";
import Error404 from "./Error404";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path ="/account" element={<Account />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
