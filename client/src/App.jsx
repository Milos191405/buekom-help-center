import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
// import Layout from "./components/Layout";
import Windows from "./components/Windows.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Navbar from "./components/Navbar";
import Search from "./pages/Search.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");

    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out"); 
    setIsLoggedIn(false);
    localStorage.removeItem("username");
    localStorage.removeItem("isLoggedIn");
    setUsername("");
  };

  console.log("Is Logged In in App:", isLoggedIn); 

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={<HomePage isLoggedIn={isLoggedIn} username={username} />}
        />
        <Route
          path="/signIn"
          element={
            <SignIn setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
          }
        />
        <Route
          path="/signUp"
          element={
            <SignUp setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
          }
        />
        <Route
          path="/search"
          element={
            <Search setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
          }
        />
        <Route
          path="/search"
          element={<Search isLoggedIn={isLoggedIn} />} // Pass the isLoggedIn prop here
        />
        <Route path="/windows" element={<Windows />} />
      </Routes>
    </>
  );
}

export default App;
