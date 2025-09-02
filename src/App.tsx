import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CustomLoginForm from "./pages/Login";
import CustomSignupForm from "./pages/Signup";
import Income from "./pages/Income";
import { UserProvider } from "./context/UserContext";
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomLoginForm />} />
          <Route path="/signup" element={<CustomSignupForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/income" element={<Income />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
