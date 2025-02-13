import React from 'react';

const Header = () => {
  return (
    <div className="fixed top-0 w-full flex items-center space-x-2 p-2 bg-white shadow-md rounded-lg z-50">
      <div className="container mx-auto flex items-center space-x-2">
        <img
          src="asserts/College.jpg"
          alt="logo"
          className="h-20 w-20 rounded-full object-cover shadow-lg border-2 border-green-700"
        />
        <h1 className="text-3xl font-bold text-green-700">
          Government Siddha Medical College - Tirunelveli
        </h1>
      </div>
    </div>
  );
};

export default Header;
