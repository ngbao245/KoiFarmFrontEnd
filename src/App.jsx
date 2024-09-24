import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Product from "./pages/Product/Product";
import Admin from "./pages/Admin/Admin";
import { Bounce, ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";
import Register from "./pages/Register/Register";

function App() {
  return (
    <>
      <div className="app-container">
        {/* <Container> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product" element={<Product />} />
          <Route path="/register" element={<Register />} />

        </Routes>
        {/* </Container> */}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;
