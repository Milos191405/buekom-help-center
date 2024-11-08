import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import Logo from "../assets/bükom-logo.png";

function Navbar({ isLoggedIn, onLogout, username, role }) {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signIn");
  };

  const handleSignUp = () => {
    navigate("/create-admin");
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav
      className="fixed top-0 w-full flex flex-col gap-5 items-center  border-b-2 bottom-[#fa4915]  
      md:px-6 text-gray-700 z-50 transition-all duration-300 ease-in-out"
    >
      <div className="flex justify-center items-center w-60 mt-2">
        {/* Logo */}
        <NavLink to="/" className="">
          <img src={Logo} alt="Logo" className="w-[200px] xl:w-[250px] z-50" />
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <ul className="grid grid-cols-2 lg:flex gap-2 text-lg xl:text-lg 2xl:text-xl lg:gap-3">
        {isLoggedIn && (
          <>
            <li className="px-4">
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#fa4915]"
                    : "text-[#005873] hover:text-[#fa4915]"
                }
              >
                Search
              </NavLink>
            </li>

            {/* Show "Update Files" and "Create new user" only for admin */}
            {role === "admin" && (
              <>
                <li className="px-4">
                  <NavLink
                    to="/update-files"
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#fa4915]"
                        : "text-[#005873] hover:text-[#fa4915]"
                    }
                  >
                    Update Files
                  </NavLink>
                </li>
                <li className="px-4">
                  <NavLink
                    to="/create-user"
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#fa4915]"
                        : "text-[#005873] hover:text-[#fa4915]"
                    }
                  >
                    Create user
                  </NavLink>
                </li>
                <li className="px-4">
                  <NavLink
                    to={`/manageUsers`}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#fa4915]"
                        : "text-[#005873] hover:text-[#fa4915]"
                    }
                  >
                    Manage Users
                  </NavLink>
                </li>
              </>
            )}
          </>
        )}
      </ul>

      {/* Logout or Sign In/Up Buttons */}
      <ul className="flex">
        {isLoggedIn ? (
          <button
            className="border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <li className="flex gap-10">
              {/* <button
                className="flex border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
                onClick={handleSignUp}
              >
                Create Admin
              </button> */}
              <button
                className="flex border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string,
  role: PropTypes.string, // Ensure the role prop is passed
};

export default Navbar;
