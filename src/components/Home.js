import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const containerStyle = {
        textAlign: "center",
        padding: "50px",
        fontFamily: "Arial, sans-serif",
    };

    const buttonStyle = {
        margin: "10px",
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    };

    const loginButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#007BFF",
        color: "#fff",
    };

    const signupButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#28A745",
        color: "#fff",
    };

    return (
        <div style={containerStyle}>
            <h1>Welcome to the Schedule App</h1>
            <p>Manage your daily tasks efficiently!</p>
            <div style={{ marginTop: "20px" }}>
                <Link to="/login">
                    <button style={loginButtonStyle}>Login</button>
                </Link>
                <Link to="/signup">
                    <button style={signupButtonStyle}>Sign Up</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
