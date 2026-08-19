import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Landing from "../pages/Landing";
import Admin from "../pages/Admin";
import Home from "../pages/Home";
import CadastroProduto from "../pages/CadastroProduto";
import MinhaLoja from "../pages/MinhaLoja";
import Product from "../pages/Product";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cadastroProduto" element={<CadastroProduto />} />
      <Route path="/minhaLoja" element={<MinhaLoja />} />
      <Route path="/product/:id" element={<Product />} />
    </Routes>
  );
}