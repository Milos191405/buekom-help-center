import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../config.js";

function CreateUser() {
  const [username, setUsernameLocal] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
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
        `${API_BASE_URL}/api/auth/admin/create-user`,
        { username, password, role },
        { withCredentials: true } 
      );

      if (response.data.success) {
        setMessage("User created successfully");

        // Reset fields after successful creation
        setUsernameLocal("");
        setPassword("");
        setRole("user"); // Reset to default role
      } else {
        setMessage(response.data.message || "User creation failed");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage(error.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="text-center mt-[260px] min-h-[calc(100vh-260px)] bg-gray-200 flex items-center justify-center">
      <div className=" ">
        <div className="flex  justify-center">
          <div className="border p-4 rounded shadow-xl bg-gray-100">
            <h2 className="text-center mb-4 font-bold text-xl ">Create User</h2>
            <form onSubmit={handleSubmit} className="flex flex-col w-60">
              <label htmlFor="username" className="mb-1">
              
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
       
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-4 rounded"
              />
              <label htmlFor="role" className="mb-1">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border p-2 mb-4 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="border p-2 rounded text-white bg-[#005873] hover:bg-[#fa4915]"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </form>
            {message && (
              <div className="mt-4 text-center text-red-500">{message}</div>
            )}
          </div>
        </div>
        {/* <div className="">
        <button className="border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]">
          See all users
        </button>
      </div> */}
      </div>
    </article>
  );


}

export default CreateUser;
