import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Toast from "./Toast.jsx";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="mx-auto">
        <Toast />
      </div>
      <main className="">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
