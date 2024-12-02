import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";  // Import Firestore methods

const Signup = () => {
  const [name, setName] = useState("");  // Added name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    console.log("Signup Button Clicked");
    
    if (!name || !email || !password) {
      toast.error("Please fill all the fields.");
      return;
    }
  
    try {
      // Log the inputs to check if they're being captured
      console.log({ name, email, password });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        uid: user.uid,
      });
  
      toast.success("Signup successful! Please log in.");
      navigate("/login");  // Redirect to login after successful signup
    } catch (error) {
      console.error("Error signing up:", error.message);
      toast.error("Error: " + error.message);
    }
  };
  

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-0 md:w-1/2 bg-gradient-to-b from-blue-500 to-blue-800 p-10 flex items-center justify-center">
        <div className="text-white w-4/5 max-w-md">
          <h1 className="text-3xl font-bold mb-6">Create Your Account</h1>
          <p className="mb-4 text-lg">Join us to manage your tasks and schedules in an organized way.</p>
          <div className="text-white text-sm">
            <p>Already have an account? <Link to="/login" className="text-blue-200 hover:underline">Log in here</Link></p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-4/5 max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign up to your account</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <button
              onClick={handleSignup}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
