import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <div className="app-container">
        {/* <Container> */}
        <AppRoutes />
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
        closeButton={false}
        transition={Bounce}
      />
    </>
  );
}

export default App;
