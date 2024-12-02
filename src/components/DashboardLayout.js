import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-4 text-center border-b">
                    <h1 className="text-2xl font-bold text-blue-600">My App</h1>
                </div>
                <nav className="mt-4 space-y-2">
                    <Link
                        to="/schedules"
                        className={`block px-6 py-3 rounded-l-full ${
                            location.pathname === "/schedules"
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Schedules
                    </Link>
                    <Link
                        to="/add-schedule"
                        className={`block px-6 py-3 rounded-l-full ${
                            location.pathname === "/add-schedule"
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Add Schedule
                    </Link>
                    <Link
                        to="/calendar"
                        className={`block px-6 py-3 rounded-l-full ${
                            location.pathname === "/calendar"
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Calendar
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
