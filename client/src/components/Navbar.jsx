import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import Logo from "../assets/bükom-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUsers,
  faMagnifyingGlass,
  faFilePen,
} from "@fortawesome/free-solid-svg-icons";


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
      className="fixed left-0 top-0 w-full items-center min-h-60 
      md:px-6 text-gray-700 z-50 transition-all duration-300 ease-in-out mx-auto  "
    >
      <div className=" flex flex-col items-center justify-center ">
        {/* Logo */}
        <NavLink to="/" className="">
          <img src={Logo} alt="Logo" className="w-[250px] xl:w-[300px] z-50 p-2 " />
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <ul className="flex  lg:flex gap-5 mb-5 text-lg xl:text-lg 2xl:text-xl lg:gap-3">



        {isLoggedIn && (
          <div className="flex mx-auto gap-5 mt-5 ">
            <li className="px-4">
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#fa4915]"
                    : "text-[#005873] hover:text-[#fa4915]"
                }
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="sm:hidden mr-2" />

                <span className="hidden sm:inline">Search</span>
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
                    <FontAwesomeIcon
                      icon={faFilePen}
                      className="sm:hidden mr-2"
                    />

                    <span className="hidden sm:inline">Update Files</span>
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
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      className="sm:hidden mr-2"
                    />

                    <span className="hidden sm:inline">Create user</span>
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
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="sm:hidden mr-2"
                    />

                    <span className="hidden sm:inline">Manage Users</span>
                  </NavLink>
                </li>
              </>
            )}
          </div>
        )}
      </ul>

      {/* Logout or Sign In/Up Buttons */}
      <ul className="flex mb-2 ">
        {isLoggedIn ? (
          <button
            className="border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915] mx-auto mt-2"
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
              {/* <button
                className="flex border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
                onClick={handleSignIn}
              >
                Sign In
              </button> */}
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
