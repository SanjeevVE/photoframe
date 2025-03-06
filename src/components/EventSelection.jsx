import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventSelection = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const navigate = useNavigate();

  const baseUrl = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}/events/get-all-events`);
        console.log(response.data);
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error in fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleEventChange = (slug) => {
    setSelectedEvent(slug);
    navigate(`/photo-frame?slug=${slug}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Select an Event</h2>
        <select
          onChange={(e) => handleEventChange(e.target.value)}
          value={selectedEvent}
          className="w-full p-4 border border-gray-300 rounded-md text-gray-700"
        >
          <option value="">Select an Event</option>
          {events.map((event) => (
            <option key={event.slug} value={event.slug}>
              {event.eventName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventSelection;
