import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function SignIn({ setIsLoggedIn, setUsername, setUserRole }) {
  const [username, setUsernameLocal] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) return setMessage("Please fill out all fields");

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsLoggedIn(true);
        setUsername(username); // Set the username in the parent component
        localStorage.setItem("username", username);
        localStorage.setItem("isLoggedIn", "true");
        setMessage("Login successful");
        navigate("/");
      } else {
        setMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error during login process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border p-4 rounded shadow-lg">
        <h2 className="text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col w-60">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsernameLocal(e.target.value)}
            className="border p-2 mb-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 rounded"
          />
          <button
            type="submit"
            className="border p-2 rounded text-white bg-[#005873] hover:bg-[#fa4915]"
            disabled={loading}
          >
            {loading ? "Logging In ..." : "Log In"}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-red-500">{message}</div>
        )}
      </div>
    </div>
  );
}

SignIn.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
};

export default SignIn;
