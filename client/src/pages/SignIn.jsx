

function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="border p-4 rounded shadow-lg">
        <h2 className="text-center mb-4">Sign In</h2>
        <form action="signIn" className="flex flex-col w-60">
          <input
            type="text"
            placeholder="Username"
            className="border p-2 mb-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 mb-4 rounded"
          />
          <button
            type="submit"
            className="border p-2 rounded  text-white bg-[#005873] hover:bg-[#fa4915]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
