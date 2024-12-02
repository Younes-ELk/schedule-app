import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaCalendarAlt, FaListUl, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                toast.success("Logged out successfully!");
                navigate("/login");
            })
            .catch((error) => {
                toast.error("Error logging out: " + error.message);
            });
    };

    return (
        <aside
            className={`h-screen ${
                isCollapsed ? "w-20" : "w-64"
            } bg-white shadow-md flex flex-col justify-between transition-all duration-300`}
        >
            {/* Top Section */}
            <div>
                <div
                    className={`p-4 flex items-center ${
                        isCollapsed ? "justify-center" : "justify-between"
                    } border-b`}
                >
                    {!isCollapsed && (
                        <h1 className="text-2xl font-bold text-blue-600">My App</h1>
                    )}
                    <button
                        className="text-gray-600 focus:outline-none px-2 py-2 flex items-center justify-center"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <FaBars size={20} />
                    </button>
                </div>
                <nav className="mt-6 space-y-2">
                    <Link
                        to="/schedules"
                        className={`flex items-center gap-4 px-6 py-3 text-gray-600 ${
                            location.pathname === "/schedules"
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "hover:bg-gray-200"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    >
                        <FaListUl size={20} />
                        {!isCollapsed && <span>Schedules</span>}
                    </Link>
                    <Link
                        to="/add-schedule"
                        className={`flex items-center gap-4 px-6 py-3 text-gray-600 ${
                            location.pathname === "/add-schedule"
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "hover:bg-gray-200"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    >
                        <FaPlus size={20} />
                        {!isCollapsed && <span>Add Schedule</span>}
                    </Link>
                    <Link
                        to="/calendar"
                        className={`flex items-center gap-4 px-6 py-3 text-gray-600 ${
                            location.pathname === "/calendar"
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "hover:bg-gray-200"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    >
                        <FaCalendarAlt size={20} />
                        {!isCollapsed && <span>Calendar</span>}
                    </Link>
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="mb-6">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-4 px-6 py-3 text-red-500 hover:bg-red-100 w-full ${
                        isCollapsed ? "justify-center" : ""
                    }`}
                >
                    <FaSignOutAlt size={20} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
