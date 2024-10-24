import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import Logo from "../assets/bükom-logo.png";


function Navbar({ isLoggedIn, onLogout, username}) {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signIn");
  };

  const handleSignUp = () => {
    navigate("/signUp");
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };


  // const navLinks = [
  //   { to: "/search", label: "Search" },
  //   { to: "/updateFiles", label: "Update Files" },
  // ];

  // Debugging log to check the isLoggedIn state
  console.log("Is Logged In:", isLoggedIn);

  return (
    <nav
      className="fixed top-0 w-full flex flex-col gap-5 items-center h-[200px]  border-b-2 bottom-[#fa4915]  
      md:px-6 text-gray-700 z-50 transition-all duration-300 ease-in-out"
    >
      <div className="flex justify-center items-center w-60 mt-2">
        {/* Logo */}
        <NavLink to="/" className=" ">
          <img src={Logo} alt="Logo" className="w-[200px] xl:w-[250px] z-50" />
        </NavLink>
      </div>
      {/* Hamburger Icon */}
      {/* Uncomment this section for a mobile menu toggle */}
      {/* <button
          onClick={handleClick}
          className="lg:hidden z-50 cursor-pointer absolute top-6 right-4 "
          aria-controls="mobile-menu"
          aria-expanded={nav ? "true" : "false"}
          aria-label="Toggle navigation menu"
        >
          {!nav ? <FaBars /> : <FaTimes />}
        </button> */}

      {/* Desktop Menu */}
      <ul className="flex lg:flex gap-2 text-lg xl:text-lg 2xl:text-xl lg:gap-3  ">
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
            {/* Show "Update Files" only for admin */}
            {isLoggedIn && username === "admin" && (
              <div>
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
                    Create new user
                  </NavLink>
                </li>
              </div>
            )}
          </>
        )}
      </ul>
      {/* Mobile Menu */}
      {/* <ul
        id="mobile-menu"
        className={`${
          nav ? "flex" : "hidden"
        } absolute top-0 left-0 w-full h-screen bg-[#fffdfd] text-gray-700 flex-col justify-center z-40`}
      > */}
      {/* Uncomment this section for mobile navigation links */}
      {/* {navLinks.map(({ to, label }) => (
          <li
            key={to}
            onClick={closeMenu}
            className="text-xl text-left py-2 hover:text-gray-700 mb-2 w-screen px-6 border-b border-gray-300"
          >
            <Link to={to}>{label}</Link>
          </li>
        ))} */}
      {/* </ul> */}

      {/* Logout or Sign In/Up Buttons */}
      <ul className=" flex ">
        {isLoggedIn ? (
          <button
            className=" border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <li className="flex gap-10">
              <button
                className="flex border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
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
  isLoggedIn: PropTypes.bool.isRequired, // PropType for isLoggedIn
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string
};

export default Navbar;
