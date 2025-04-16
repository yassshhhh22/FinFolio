import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router';

const LandingPage = () => {
    const [darkMode, setdarkMode] = useState(false)
  return (
    
    <div className={darkMode ? 'dark' : ''}>
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <section className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-black text-black dark:text-white">
        <h2 className="text-4xl font-extrabold mb-6">Track Your Investments with Confidence</h2>
        <p className="text-lg bg-white dark:bg-black text-black dark:text-white mb-8 max-w-xl">
          Manage your portfolio, analyze performance, and stay on top of market trends with our powerful and intuitive platform.
        </p>
        <img src={darkMode ? "./candle.jpg" : "./candle_white.jpg"} alt="Candlestick Chart" className="mb-8 max-w-md w-full rounded-lg shadow-md" />
        <Link to={'/signup'}>
        <button className="py-2 px-6 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:dark:bg-gray-100 hover:bg-gray-900">Get Started</button></Link>
      </section>

      {/* Features Section */}
      <section id="features" className="p-12 bg-white dark:bg-black text-black dark:text-white">
        <h3 className="text-3xl font-bold text-center mb-10">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 shadow-lg rounded-lg bg-white dark:bg-black text-black dark:text-white text-center">
            <h4 className="text-xl font-semibold mb-4">Real-Time Analytics</h4>
            <p className=" bg-white dark:bg-black text-black dark:text-white">Track your investments with live data and detailed insights.</p>
          </div>
          <div className="p-6 shadow-lg rounded-lg  bg-white dark:bg-black text-black dark:text-white text-center">
            <h4 className="text-xl font-semibold mb-4 ">Custom Portfolio Management</h4>
            <p className=" bg-white dark:bg-black text-black dark:text-white">Tailor your portfolio to suit your financial goals.</p>
          </div>
          <div className="p-6 shadow-lg rounded-lg   bg-white dark:bg-black text-black dark:text-white text-center">
            <h4 className="text-xl font-semibold mb-4">Market Trend Analysis</h4>
            <p className=" bg-white dark:bg-black text-black dark:text-white">Stay ahead of market movements with our AI-driven insights.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  </div>
  );
};

export default LandingPage;

