// ManageUsers.js
import  { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/users",
          { withCredentials: true }
        );
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
     await axios.delete(
       `http://localhost:5000/api/auth/delete-user/${userId}`,
       {
         withCredentials: true,
       }
     );

     alert("User deleted successfully");
     setUsers(users.filter((user) => user._id !== userId));
   } catch (error) {
     setError(error.response?.data?.message || "Error deleting user");
   }
 };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-[250px] text-center">
      <h1 className="font-bold">Manage Users</h1>
      <table className="w-[90%]  mt-20 mx-auto ">
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
                  className="border bg-red-500 text-white  ">
                  Delete user
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
