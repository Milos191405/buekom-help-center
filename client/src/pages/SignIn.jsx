import axios from "axios";
import { API_BASE_URL } from "../config.js";
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

    // Clear any previous message
    setMessage(null);

    // Check for empty fields
    if (!username || !password) {
      return setMessage("Please fill out all fields");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { user } = response.data;

        console.log("User role from response", user.role); // Debug log

        // Set user state and localStorage values upon successful login
        setIsLoggedIn(true);
        setUsername(username);
        setUserRole(user.role); // Ensure the role is received from the server response

        // Store role in localStorage correctly
        localStorage.setItem("username", username);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user.role); // Store role from user object

        setMessage("Login successful");
        navigate("/"); // Redirect to homepage
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
    <article className="text-center mt-[100px] min-h-[calc(100vh-100px)] bg-gray-200 flex items-center justify-center">
      <div className="flex items-center justify-center  bg-gray-200">
        <div className="border p-4 rounded shadow-xl bg-gray-100">
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
              disabled={loading || !username || !password} // Disable button if loading or fields are empty
            >
              {loading ? "Logging In ..." : "Log In"}
            </button>
          </form>
          {message && (
            <div className="mt-4 text-center text-red-500">{message}</div>
          )}
        </div>
      </div>
    </article>
  );
}

SignIn.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
};

export default SignIn;
