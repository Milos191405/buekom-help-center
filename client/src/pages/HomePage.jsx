import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { API_BASE_URL } from "../config.js";



function HomePage({ isLoggedIn, role}) {
  const [username, setUsername] = useState("");
  const [isAdminExist, setIsAdminExist] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const fetchAdminStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/existence`);

      if (!response.ok) {
        throw new Error(`Failed to fetch admin status: ${response.statusText}`);
      }

      const data = await response.json();
      setIsAdminExist(data.exists);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  fetchAdminStatus();

  const storedUsername = localStorage.getItem("username");
  if (storedUsername) {
    setUsername(storedUsername);
  }
}, []);

   const handleSignUp = () => {
     navigate("/create-admin");
   };

  const handleSignIn = () => {
    navigate("/signIn");
  };

  // const handleSignUp = () => {
  //   navigate("/signUp");
  // };

  return (
    <article className="bg-gray-200">
      <div
        className={`flex flex-col items-center justify-center  
    ${
      isLoggedIn
        ? "mt-[260px] h-[calc(100vh-260px)]"
        : "mt-[100px] h-[calc(100vh-100px)]"
    }`}
      >
        <div className=" ">
          <article className="text-center ">
            <h1 className="text-4xl font-bold mb-4">büKOM</h1>
            <p className="text-2xl font-bold mb-5">
              Marc and Sven knowledge base
            </p>
            {!isLoggedIn && isAdminExist && (
              <div className="">
                <p className="text-lg">Login to your account</p>
                <button
                  className="mt-4 border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
              </div>
            )}
          </article>
        </div>

        {!isLoggedIn && !isAdminExist && (
          <div className="">
            <h1>Make admin account to start</h1>
            <button
              className="flex border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915] mx-auto mt-4"
              onClick={handleSignUp}
            >
              Create Admin
            </button>
          </div>
        )}

        {isLoggedIn && (
          <h1 className="text-xl ">
            Welcome <span className="text-orange-500">{username}</span>!
          </h1>
        )}
      </div>
    </article>
  );
}

HomePage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  role: PropTypes.string,
 
};
export default HomePage;
