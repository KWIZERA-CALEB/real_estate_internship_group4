import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Notfound from "./pages/Notfound";
import Login from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import PropertiesPage from "./pages/PropertyPage";
import SinglePropertyPage from "./pages/SinglePropertyPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Navigate to="/properties" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <PropertiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <ProtectedRoute>
              <SinglePropertyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
