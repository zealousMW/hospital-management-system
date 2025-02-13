import React from 'react';
import Header from '../components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-grow mt-24">
        <div className="container mx-auto px-4">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
}

export default MyApp;