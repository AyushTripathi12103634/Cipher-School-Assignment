import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./Pages/Login";
import TestJoin from "./Pages/TestJoin";
import Tests from "./Pages/Tests";
import Submit from "./Pages/Submit";
function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Tests />} />
            <Route path="/test/:id" element={<TestJoin />} />
            <Route path="/submit/:id" element={<Submit />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition="Bounce"
        />
    </>
  );
}

export default App;