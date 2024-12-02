import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firebase methods
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterTags, setFilterTags] = useState("");

  // Fetch schedules from Firebase
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const q = query(collection(db, "schedules"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scheduleList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSchedules(scheduleList);
      setFilteredSchedules(scheduleList);
    });

    return () => unsubscribe();
  }, []);

  // Handle search logic
  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = schedules.filter((schedule) =>
      schedule.title.toLowerCase().includes(lowercasedQuery) ||
      (schedule.tags && schedule.tags.toLowerCase().includes(lowercasedQuery)) ||
      schedule.description.toLowerCase().includes(lowercasedQuery) ||
      schedule.startDate.includes(lowercasedQuery) ||
      schedule.endDate.includes(lowercasedQuery)
    );
    setFilteredSchedules(filtered);
  };

  // Handle sorting logic
  const handleSort = (field) => {
    const sortedSchedules = [...filteredSchedules].sort((a, b) => {
      if (field === "startDate" || field === "endDate") {
        return sortOrder === "asc"
          ? new Date(a[field]) - new Date(b[field])
          : new Date(b[field]) - new Date(a[field]);
      }
      if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredSchedules(sortedSchedules);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  // Filter schedules based on the filter criteria
  const applyFilters = () => {
    let filtered = schedules;

    if (filterTitle) {
      filtered = filtered.filter((schedule) =>
        schedule.title.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }

    if (filterStartDate && filterEndDate) {
      filtered = filtered.filter(
        (schedule) =>
          new Date(schedule.startDate) >= new Date(filterStartDate) &&
          new Date(schedule.endDate) <= new Date(filterEndDate)
      );
    }

    if (filterTags) {
      filtered = filtered.filter((schedule) =>
        schedule.tags.toLowerCase().includes(filterTags.toLowerCase())
      );
    }

    setFilteredSchedules(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterTitle("");
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterTags("");
    setFilteredSchedules(schedules); // Reset to original schedules
  };

  // Export filtered schedules as Excel
  const handleExportExcel = () => {
    const filteredData = filteredSchedules.map((schedule) => ({
      title: schedule.title,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      description: schedule.description,
      tags: schedule.tags,
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFFF00" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = { r: 0, c: col };
      const cell = worksheet[XLSX.utils.encode_cell(cellAddress)];
      if (cell) {
        cell.s = headerStyle;
      }
    }

    worksheet["A1"].v = "Title";
    worksheet["B1"].v = "Start Date";
    worksheet["C1"].v = "End Date";
    worksheet["D1"].v = "Start Time";
    worksheet["E1"].v = "End Time";
    worksheet["F1"].v = "Description";
    worksheet["G1"].v = "Tags";

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedules");
    XLSX.writeFile(workbook, "Schedules.xlsx");
    toast.success("Schedules exported successfully!");
  };

  // Export filtered schedules as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Schedules Report", 14, 20);

    const tableData = filteredSchedules.map((schedule) => [
      schedule.title,
      schedule.startDate,
      schedule.endDate,
      schedule.startTime,
      schedule.endTime,
      schedule.description,
      schedule.tags,
    ]);

    doc.autoTable({
      head: [
        ["Title", "Start Date", "End Date", "Start Time", "End Time", "Description", "Tags"],
      ],
      body: tableData,
    });

    doc.save("Schedules.pdf");
    toast.success("Schedules exported successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Schedules</h1>
        <div className="flex gap-4"> {/* Wrap buttons in a div with gap */}
          <button
            onClick={handleExportExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Export as Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Export as PDF
          </button>
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search schedules"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          onClick={() => setFilterVisible(!filterVisible)}
          className="bg-yellow-500 text-white font-bold py-2 px-4 rounded"
        >
          Filter
        </button>
      </div>

      {filterVisible && (
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm">Title</label>
              <input
                type="text"
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm">Start Date</label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm">End Date</label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm">Tags</label>
              <input
                type="text"
                value={filterTags}
                onChange={(e) => setFilterTags(e.target.value)}
                className="border px-3 py-2 rounded w-full"
                placeholder="Enter tag"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
  
        {filteredSchedules.length === 0 ? (
          <p>No schedules found</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Start Date & Time</th>
                <th className="border px-4 py-2">End Date & Time</th>
                <th className="border px-4 py-2">Tags</th>
                <th className="border px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="border px-4 py-2">{schedule.title}</td>
                  <td className="border px-4 py-2">
                    {schedule.startDate} {schedule.startTime}
                  </td>
                  <td className="border px-4 py-2">
                    {schedule.endDate} {schedule.endTime}
                  </td>
                  <td className="border px-4 py-2">{schedule.tags}</td>
                  <td className="border px-4 py-2">{schedule.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };
  
  export default ScheduleList;
  
