import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Signup successful! Please log in.");
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error signing up:", error.message);
                alert(error.message);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
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
    );
};

export default Signup;
