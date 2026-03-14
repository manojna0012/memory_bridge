import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("memorybridge_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (email, password) => {

    const users =
      JSON.parse(localStorage.getItem("memorybridge_users")) || [];

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      alert("Invalid credentials");
      return false;
    }

    const userData = {
      id: found.id,
      name: found.name,
      role: found.role,
      email: found.email
    };

    setUser(userData);

    localStorage.setItem(
      "memorybridge_user",
      JSON.stringify(userData)
    );

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("memorybridge_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);