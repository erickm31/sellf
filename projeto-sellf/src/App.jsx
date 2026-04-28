import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;