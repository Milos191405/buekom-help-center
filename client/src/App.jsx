import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn.jsx";
import Navbar from "./components/Navbar";
import Search from "./pages/Search.jsx";
import UpdateFiles from "./pages/UpdateFiles.jsx";
import CreateUser from "./pages/CreateNewUser.jsx";
import CreateAdmin from "./pages/CreateAdmin.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    console.log("Stored role in localStorage", storedRole);

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

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        role={role} // Pass the role to Navbar
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
              setUserRole={setRole} // Pass the function to set the role
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
          element={<UpdateFiles isLoggedIn={isLoggedIn} username={username} />}
        />
      </Routes>
    </>
  );
}

export default App;
