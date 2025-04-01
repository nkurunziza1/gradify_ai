// import Navbar from '../appUi/components/Navbar'
// import Footer from '../appUi/components/Footer'
import { Outlet } from "react-router-dom";
import React from "react";

const Layout = () => {
  return (
    <main className="w-full h-full">
      <Outlet />
      <div className="mt-32"></div>
    </main>
  );
};

export default Layout;
