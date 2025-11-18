import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import Homepage from "./components/Homepage";
import MyDrive from "./pages/MyDrive";
import Starred from "./pages/Starred";
import Shared from "./pages/Shared";
import Bin from "./pages/Bin";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/mydrive" element={<MyDrive />} />
            <Route path="/starred" element={<Starred />} />
            <Route path="/shared" element={<Shared />} />
            <Route path="/bin" element={<Bin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
