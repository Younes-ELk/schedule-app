import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";  // Import Google icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Google Login
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        toast.success("Google Login successful!");
        navigate("/schedules");
      })
      .catch((error) => {
        toast.error("Google Login failed: " + error.message);
      });
  };

  // Email & Password Login
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Login successful!");
        navigate("/schedules");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            toast.error("User does not exist. Please check your login details or sign up.");
            break;
          case "auth/wrong-password":
            toast.error("Incorrect password. Please try again.");
            break;
          case "auth/invalid-email":
            toast.error("Invalid email format. Please enter a valid email.");
            break;
          default:
            toast.error("Login failed: " + error.message);
        }
      });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-0 md:w-1/2 bg-gradient-to-b from-blue-500 to-blue-800 p-10 flex items-center justify-center">
        <div className="text-white w-4/5 max-w-md">
          <h1 className="text-3xl font-bold mb-6">Welcome Back to Our Schedule App!</h1>
          <p className="mb-4 text-lg">Manage your tasks and schedules in an organized way.</p>
          <div className="text-white text-sm">
            <p>Don’t have an account? <Link to="/signup" className="text-blue-200 hover:underline">Sign up here</Link></p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-4/5 max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Log in to your account</h2>
          <div className="flex flex-col space-y-4">
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center bg-red-500 text-white rounded py-2"
            >
              <FaGoogle className="mr-3" /> Log in with Google
            </button>

            <div className="text-center my-4">or continue with email</div>
            
            {/* Email & Password */}
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between items-center mb-6">
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-500">Forgot Password?</Link>
            </div>

            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
