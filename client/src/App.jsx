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
import NotFound from "./pages/NotFound.jsx"; // Create this for fallback routes

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [activeMenu, setActiveMenu] = useState("home");
  const location = useLocation();

  // Fetch stored user information on component mount
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username") || "";
    const storedRole = localStorage.getItem("role") || "";

    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  // Handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("username");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setUsername("");
    setRole("");
  };

  // Update active menu based on the current route
  useEffect(() => {
    const pathToMenu = {
      "/update-files": "update-files",
      "/search": "search",
      "/manageUsers": "manage-users",
    };

    setActiveMenu(pathToMenu[location.pathname] || "home");
  }, [location.pathname]);

  // Define all routes dynamically
  const routes = [
    {
      path: "/",
      element: (
        <HomePage isLoggedIn={isLoggedIn} username={username} role={role} />
      ),
    },
    {
      path: "/signIn",
      element: (
        <SignIn
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername}
          setUserRole={setRole}
        />
      ),
    },
    { path: "/create-admin", element: <CreateAdmin role={role} /> },
    { path: "/create-user", element: <CreateUser role={role} /> },
    {
      path: "/search",
      element: (
        <Search isLoggedIn={isLoggedIn} username={username} role={role} />
      ),
    },
    {
      path: "/update-files",
      element: (
        <UpdateFiles
          isLoggedIn={isLoggedIn}
          username={username}
          activeMenu={activeMenu}
        />
      ),
    },
    {
      path: "/manageUsers",
      element: (
        <ManageUsers
          isLoggedIn={isLoggedIn}
          username={username}
          role={role}
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername}
          onLogout={handleLogout}
          setUserRole={setRole}
        />
      ),
    },
    { path: "*", element: <NotFound /> }, // Fallback route
  ];

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        role={role}
        activeMenu={activeMenu}
      />
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
