import { Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn.jsx";
import Navbar from "./components/Navbar";
import Search from "./pages/Search.jsx";
import UpdateFiles from "./pages/UpdateFiles.jsx";
import CreateUser from "./pages/CreateNewUser.jsx";
import CreateAdmin from "./pages/CreateAdmin.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [activeMenu, setActiveMenu] = useState("home");
  const location = useLocation(); 

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("username");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setUsername("");
    setRole("");
  };

  useEffect(() => {
    
    const path = location.pathname;
    if (path === "/update-files") {
      setActiveMenu("update-files");
    } else if (path === "/search") {
      setActiveMenu("search");
    } else if (path === "/manageUsers") {
      setActiveMenu("manage-users");
    } else {
      setActiveMenu("home"); 
    }
  }, [location.pathname]); 

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        role={role}
        activeMenu={activeMenu} // Pass activeMenu to Navbar
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage isLoggedIn={isLoggedIn} username={username} role={role} />
          }
        />
        <Route
          path="/signIn"
          element={
            <SignIn
              setIsLoggedIn={setIsLoggedIn}
              setUsername={setUsername}
              setUserRole={setRole}
            />
          }
        />
        <Route path="/create-admin" element={<CreateAdmin />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route
          path="/search"
          element={<Search isLoggedIn={isLoggedIn} username={username} />}
        />
        <Route
          path="/update-files"
          element={
            <UpdateFiles
              isLoggedIn={isLoggedIn}
              username={username}
              activeMenu={activeMenu} 
            />
          }
        />
        <Route
          path="/manageUsers"
          element={
            <ManageUsers
              isLoggedIn={isLoggedIn}
              username={username}
              role={role}
              setIsLoggedIn={setIsLoggedIn}
              setUsername={setUsername}
              onLogout={handleLogout}
              setUserRole={setRole}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
