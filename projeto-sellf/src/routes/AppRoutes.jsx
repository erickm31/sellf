import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Landing from "../pages/Landing";
import Admin from "../pages/Admin";
import Home from "../pages/Home";
import CadastroProduto from "../pages/CadastroProduto";
import MinhaLoja from "../pages/MinhaLoja";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cadastroProduto" element={<CadastroProduto />} />
      <Route path="/minhaLoja" element={<MinhaLoja />} />
    </Routes>
  );
}