import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/layouts/Layouts.jsx";
import Windows from "./components/Windows.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";


function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/windows" element={<Windows />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
