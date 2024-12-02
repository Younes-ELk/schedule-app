import React, { useEffect, useState } from "react"; 
import { db } from "../firebase"; 
import { collection, query, where, onSnapshot, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore"; 
import { auth } from "../firebase"; 
import { toast } from "react-toastify";

const AddSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    tags: "",
    description: "",
  });
  const [customTags, setCustomTags] = useState(["Personal", "Work"]);
  const [newTag, setNewTag] = useState(""); // For adding a new tag
  const [editing, setEditing] = useState(null);
  const [duration, setDuration] = useState("N/A");

  // Fetch schedules from Firestore
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
    });

    return () => unsubscribe();
  }, []);

  // Calculate Duration
  const calculateDuration = (startDate, startTime, endDate, endTime) => {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    const durationMillis = endDateTime - startDateTime;
    if (durationMillis > 0) {
      const hours = Math.floor(durationMillis / (1000 * 60 * 60));
      const minutes = Math.floor((durationMillis % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return "N/A";
  };

  // Handle the add tag functionality
  const handleAddTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      toast.success("Tag added successfully!");
      setNewTag(""); // Clear the input field
    } else {
      toast.error("Tag is either empty or already exists!");
    }
  };

  // Handle adding a new schedule
  const handleAdd = async () => {
    if (
      !newSchedule.title ||
      !newSchedule.startDate ||
      !newSchedule.startTime ||
      !newSchedule.endDate ||
      !newSchedule.endTime
    ) {
      toast.error("All fields are required!");
      return;
    }

    // Calculate Duration
    const calculatedDuration = calculateDuration(newSchedule.startDate, newSchedule.startTime, newSchedule.endDate, newSchedule.endTime);
    setDuration(calculatedDuration);

    const userId = auth.currentUser?.uid;
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }

    try {
      await addDoc(collection(db, "schedules"), {
        ...newSchedule,
        userId,
        duration: calculatedDuration, // Save duration
      });
      toast.success("Schedule added successfully!");
      setNewSchedule({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        tags: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding schedule:", error.message);
      toast.error("Error adding schedule: " + error.message);
    }
  };

  // Handle deleting a schedule
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this schedule?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "schedules", id));
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      console.error("Error deleting schedule:", error.message);
      toast.error("Error deleting schedule: " + error.message);
    }
  };

  const startEditing = (schedule) => {
    setEditing(schedule.id);
    setNewSchedule({
      title: schedule.title,
      startDate: schedule.startDate,
      startTime: schedule.startTime,
      endDate: schedule.endDate,
      endTime: schedule.endTime,
      tags: schedule.tags,
      description: schedule.description,
    });
  };

  const handleEdit = async (id) => {
    try {
      await updateDoc(doc(db, "schedules", id), newSchedule);
      toast.success("Schedule updated successfully!");
      setEditing(null);
    } catch (error) {
      console.error("Error updating schedule:", error.message);
      toast.error("Error updating schedule: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Add New Schedule</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
            <input
              type="text"
              placeholder="Enter event title"
              value={newSchedule.title}
              onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
            <input
              type="date"
              value={newSchedule.startDate}
              onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Start Time</label>
            <input
              type="time"
              value={newSchedule.startTime}
              onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">End Date</label>
            <input
              type="date"
              value={newSchedule.endDate}
              onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">End Time</label>
            <input
              type="time"
              value={newSchedule.endTime}
              onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-gray-700 font-semibold mb-2">Tags</label>
            <div className="grid grid-cols-3 gap-4 items-center">
              <select
                value={newSchedule.tags}
                onChange={(e) => setNewSchedule({ ...newSchedule, tags: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="">Select Tag</option>
                {customTags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Add new tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <button
                onClick={handleAddTag}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Tag
              </button>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              placeholder="Add a description (optional)"
              value={newSchedule.description}
              onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
        >
          Save
        </button>
      </div>
      {/* All Schedules Table */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-lg font-bold mb-4">All Schedules</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Start Date & Time</th>
              <th className="border px-4 py-2">End Date & Time</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="border px-4 py-2">{schedule.title}</td>
                <td className="border px-4 py-2">
                  {schedule.startDate} {schedule.startTime}
                </td>
                <td className="border px-4 py-2">
                  {schedule.endDate} {schedule.endTime}
                </td>
                <td className="border px-4 py-2">{schedule.duration}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => startEditing(schedule)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddSchedule;
