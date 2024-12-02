import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            toast.success("Login successful!");
            navigate("/schedules");
        })
        .catch((error) => {
            // Custom error handling
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
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                    Log In
                </button>
                <p className="text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
