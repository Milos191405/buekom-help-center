import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";



function HomePage({ isLoggedIn, role}) {
  const [username, setUsername] = useState("");
  const [isAdminExist, setIsAdminExist] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const fetchAdminStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/existence");

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
    <>
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="flex items-center justify-center  ">
          <article className="text-center">
            <h1 className="text-4xl font-bold mb-4">büKOM</h1>
            <p className="text-2xl font-bold mb-5">
              Marc and Sven knowledge base
            </p>
            {!isLoggedIn && isAdminExist && (
              <p className="text-lg">Login to your account</p>
            )}
          </article>
        </div>

       {!isLoggedIn  && !isAdminExist &&(
          <div>
            <h1>Make admin account to start</h1>
 <button
                className="flex border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915] mx-auto"
                onClick={handleSignUp}
              >
                Create Admin
              </button>
</div>        
        )}   

        {isLoggedIn  && (
          <h1 className="text-xl ">
            Welcome <span className="text-orange-500">{username}</span>!
          </h1>
        )}
      </div>
    </>
  );
}

HomePage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  role: PropTypes.string,
 
};
export default HomePage;
