import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { db } from "../firebase"; // Import Firebase methods
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Import missing methods
import { auth } from "../firebase"; // Import auth to get the current user ID

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from Firestore
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    // Query Firestore to fetch schedules for the current user
    const q = query(collection(db, "schedules"), where("userId", "==", userId));  // Added userId filter

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scheduleList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          start: new Date(`${data.startDate}T${data.startTime}`), // Format start datetime
          end: new Date(`${data.endDate}T${data.endTime}`), // Format end datetime
          description: data.description,
          tags: data.tags,
        };
      });
      setEvents(scheduleList);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []); // Dependency array is empty to only run this effect once after the component mounts

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <div className="bg-white shadow-md rounded p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.tags === "Work" ? "#ffad46" : "#56d798", // Style based on tags
              color: "white",
              borderRadius: "5px",
              padding: "5px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }
          })}
          popup
        />
      </div>
    </div>
  );
};

export default CalendarView;
