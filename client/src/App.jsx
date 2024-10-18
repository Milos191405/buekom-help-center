import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import Layout from "./components/layouts/Layouts.jsx";
import Windows from "./components/Windows.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

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
    setIsLoggedIn(false);
    localStorage.removeItem("username");
    localStorage.removeItem("isLoggedIn");
    setUsername("");
  };

  return (
    <>
      <Routes>
        <Route
          element={
            <Layout isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          }
        >
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
          <Route path="/windows" element={<Windows />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
