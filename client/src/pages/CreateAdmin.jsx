import axios from "axios";
import { useState } from "react";

function CreateAdmin( {onLogin}) {
  const [username, setUsernameLocal] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (!username || !password) {
      return setMessage("Please fill out all fields");
    }
    if (username.length < 3) {
      return setMessage("Username must be at least 3 characters long");
    }
    if (password.length < 6) {
      return setMessage("Password must be at least 6 characters long");
    }

    setLoading(true);
    setMessage(null); // Reset the message

    try {
      const response = await axios.post(
        "https://buekom-help-center-server.onrender.com/api/admin/create-admin",
        { username, password }, // Only username and password for admin creation
        { withCredentials: true } // Include cookies (JWT)
      );

      if (response.data.success) {
        setMessage("Admin created successfully");

        // Reset fields after successful creation
        setUsernameLocal("");
        setPassword("");
      } else {
        setMessage(response.data.message || "Admin creation failed");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setMessage(error.response?.data?.message || "Error creating admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border p-4 rounded shadow-lg">
        <h2 className="text-center mb-4">Create Admin</h2>
        <form onSubmit={handleSubmit} className="flex flex-col w-60">
          <label htmlFor="username" className="mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsernameLocal(e.target.value)}
            className="border p-2 mb-2 rounded"
          />
          <label htmlFor="password" className="mb-1">
            Password
          </label>
          <input
            id="password"
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
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-red-500">{message}</div>
        )}
      </div>
    </div>
  );
}

export default CreateAdmin;
