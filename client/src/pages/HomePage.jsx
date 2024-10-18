import { useNavigate } from "react-router-dom";
import { useState } from "react";

function HomePage() {
    const navigate = useNavigate();

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
            <p className="text-lg">To continue, make an account and login</p>
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
      </div>
    </>
  );
}

export default HomePage;
