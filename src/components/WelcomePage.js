import React from "react";
import { motion } from "framer-motion";
import Lottie from 'react-lottie';
import animationData from '../animations/animation.json'; // Adjust path based on where you saved the file

const WelcomePage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData, 
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-blue-600 to-purple-800 text-white">
      <div className="text-center">
        <motion.h1
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          Welcome to Your Schedule Assistant
        </motion.h1>
        
        {/* Lottie Animation */}
        <div className="mb-6">
          <Lottie options={defaultOptions} height={300} width={300} />
        </div>
        
        <motion.div
          className="space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <button className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full">
            <a href="/login">Login</a>
          </button>
          <button className="bg-green-500 hover:bg-green-700 py-2 px-4 rounded-full">
            <a href="/signup">Sign Up</a>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
