import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../services/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await apiClient.get("/user/profile", {
          withCredentials: true,
        });
        setUser(res.data);   
      } catch (err) {
        setUser(null);       
      } finally {
        setLoading(false);   
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// easy hook for components
export const useAuth = () => useContext(AuthContext);
