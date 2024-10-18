import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar({ isLoggedIn, onLogout }) {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => setNav(!nav);
  const closeMenu = () => setNav(false);

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

  // Debugging log to check the isLoggedIn state
  console.log("Is Logged In:", isLoggedIn);

  const navLinks = [];

  const NavLinksLogin = [
    { to: "/", label: "HomePage" },
    { to: "/windows", label: "Windows" },
    { to: "/linux", label: "Linux" },
    { to: "/docker", label: "Docker" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full border bottom-2 ${
        nav ? "h-screen" : "h-[80px] lg:h-[100px]"
      } flex justify-evenly items-center px-4 md:px-6 text-gray-700 z-50 transition-all duration-300 ease-in-out`}
    >
      <div className="flex justify-center items-center w-60">
        {/* Logo */}
        <Link to="/" className="flex ">
          büKOM
          {/* Uncomment this section to add a logo */}
          {/* <img
            src={Logo}
            alt="Logo"
            className="w-[200px] xl:w-[250px] z-50 absolute top-0 left-4"
          /> */}
        </Link>

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
      </div>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex gap-2 text-sm lg:text-lg xl:text-lg 2xl:text-xl lg:gap-3 border ">
        {navLinks.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive ? "text-red-500" : "hover:text-red-500"
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      <ul
        id="mobile-menu"
        className={`${
          nav ? "flex" : "hidden"
        } absolute top-0 left-0 w-full h-screen bg-[#fffdfd] text-gray-700 flex-col justify-center z-40`}
      >
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
      </ul>

      {/* Logout or Sign In/Up Buttons */}
      <ul className="hidden lg:flex w-60 justify-around">
        {isLoggedIn ? (
          <button
            className="border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              className="border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
            <button
              className="border p-1 rounded-lg text-white bg-[#005873] hover:bg-[#fa4915]"
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
