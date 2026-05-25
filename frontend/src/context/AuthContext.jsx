import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  // Persist user + token whenever they change.
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.token) localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginRequest(email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await registerRequest(name, email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
