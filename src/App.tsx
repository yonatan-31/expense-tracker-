import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CustomLoginForm from "./pages/Login";
import CustomSignupForm from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomLoginForm />} />
        <Route path="/signup" element={<CustomSignupForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
