import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Outlet /> 
      <Footer />
    </>
  );
}

export default Layout;
