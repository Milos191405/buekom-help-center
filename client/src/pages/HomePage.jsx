import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function HomePage({ isLoggedIn }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if(storedUsername) {
      setUsername(storedUsername);
    }
   }, []);

  const handleSignIn = () => {
    navigate("/signIn");
  };

  const handleSignUp = () => {
    navigate("/signUp");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="flex items-center justify-center  ">
          <article className="text-center">
            <h1 className="text-4xl font-bold mb-4">büKOM Help Center</h1>
            {!isLoggedIn && (
              <p className="text-lg">To continue, make an account and login</p>
            )}
          </article>
        </div>

        <ul className="lg:hidden flex w-60 justify-around mt-20">
          <button
            className=" border p-1 rounded-lg bg-[#005873]  text-white hover:bg-[#fa4915] "
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          <button 
            className=" border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915] "
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </ul>
        {isLoggedIn ? (
          <h1>Welcome {username}!</h1> // Correct placement of the greeting message
        ) : (
          <h1>Please log in or sign up.</h1>
        )}
      </div>
    </>
  );
}

HomePage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};
export default HomePage;
