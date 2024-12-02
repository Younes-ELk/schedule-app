import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa"; // Import Google icon
import '../styles.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flip, setFlip] = useState(false); // state to manage flip
  const navigate = useNavigate();

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

  const handleSignUpRedirect = () => {
    setFlip(true); // Flip to sign-up form
  };

  const handleSignup = () => {
    // You need to implement signup logic here (same as in the Signup.js component)
    // Typically it would be something like:
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then(() => {
    //     toast.success("Signup successful! Please log in.");
    //     navigate("/login");
    //   })
    //   .catch((error) => {
    //     toast.error("Error: " + error.message);
    //   });
  };

  return (
    <div className="flip-container">
      <div className={`flip-card ${flip ? "flipped" : ""}`}>
        {/* Login Page */}
        <div className="card card-front">
          <div className="flex min-h-screen">
            <div className="w-0 md:w-1/2 bg-gradient-to-b from-blue-500 to-blue-800 p-10 flex items-center justify-center">
              <div className="text-white w-4/5 max-w-md">
                <h1 className="text-3xl font-bold mb-6">Welcome Back to Our Schedule App!</h1>
                <p className="mb-4 text-lg">Manage your tasks and schedules in an organized way.</p>
                <div className="text-white text-sm">
                  <p>Don’t have an account? <button onClick={handleSignUpRedirect} className="text-blue-200 hover:underline">Sign up here</button></p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
              <div className="w-4/5 max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Log in to your account</h2>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center bg-red-500 text-white rounded py-2"
                  >
                    <FaGoogle className="mr-3" /> Log in with Google
                  </button>

                  <div className="text-center my-4">or continue with email</div>
                  
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
        </div>

        {/* Sign Up Page */}
        <div className="card card-back">
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
              <input
                type="text"
                placeholder="Your Name"
                className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
              />
              <input
                type="email"
                placeholder="Email"
                className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
              />
              <input
                type="password"
                placeholder="Password"
                className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
              />
              <button
                onClick={handleSignup}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Sign Up
              </button>
              <p className="text-sm text-center mt-4">
                Already have an account?{" "}
                <button onClick={() => setFlip(false)} className="text-blue-500 hover:underline">
                  Log in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
