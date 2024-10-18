import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Outlet /> {/* Include Outlet for nested routing */}
      <Footer />
    </>
  );
}

export default Layout;
