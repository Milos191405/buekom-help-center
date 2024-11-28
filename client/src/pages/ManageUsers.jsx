
import  { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js"; 

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/users`, {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

 const handleDeleteUser = async (userId) => {
   const confirmDelete = window.confirm(
     "Are you sure you want to delete this user?"
   );
  
   if (!confirmDelete) return; 

   try {
     await axios.delete(`${API_BASE_URL}/api/auth/delete-user/${userId}`, {
       withCredentials: true,
     });

     alert("User deleted successfully");
     setUsers(users.filter((user) => user._id !== userId));
   } catch (error) {
     setError(error.response?.data?.message || "Error deleting user");
   }
 };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <article className="text-center mt-[260px] min-h-[calc(100vh-260px)] bg-gray-200 ">
      <div className="lg:max-w-[1000px] xl:max-w-[1400px] lg:mx-auto lg:pt-4">
        <h1 className="font-bold text-xl">Manage Users</h1>
        <table className="w-[90%]  mt-10 mx-auto ">
          <thead className="">
            <tr>
              <th className="w-30 text-left">Username</th>
              <th className="w-30 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="w-30 text-left">{user.username}</td>
                <td className="w-30 text-left">{user.role || "User"}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="border p-1 bg-red-500 text-white rounded-xl"
                  >
                    Delete user
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default ManageUsers;
