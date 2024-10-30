import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";



function HomePage({ isLoggedIn, role }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
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
            <h1 className="text-4xl font-bold mb-4">büKOM</h1>
            <p className="text-2xl font-bold mb-5">Help Center</p>
            {!isLoggedIn && (
              <p className="text-lg">To continue, make an account and login</p>
            )}
          </article>
        </div>

        {isLoggedIn ? (
          <h1 className="text-xl ">
            Welcome <span className="text-orange-500">{username}</span>!
          </h1>
        ) : (
          <h1>Please log in or sign up.</h1>
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
