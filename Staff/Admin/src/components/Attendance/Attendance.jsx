import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/Attendance/MapView"; // Import the MapView component
import "./Attendance.css";

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null); // State to store selected location for map
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get("adm-attendance/");
        const dataWithSession = response.data.map((item) => {
          const session = getSessionFromTime(item.time);
          return { ...item, session };
        });
        setAttendanceData(dataWithSession);
        setFilteredData(dataWithSession);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch attendance data");
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const getSessionFromTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    if (hours >= 6 && hours < 12) return "Morning";
    if (hours >= 12 && hours < 18) return "Afternoon";
    return "Evening";
  };

  const handleMapClick = (latitude, longitude) => {
    setSelectedLocation({ latitude, longitude });
  };

  const getRowColor = (session) => {
    if (!session) return "#ffffff";
    if (session === "Morning") return "#00c3ff";
    if (session === "Afternoon") return "#e41414";
    return "#ffffff";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const uniqueNames = [...new Set(attendanceData.map((item) => item.name))];
  const uniqueSessions = [...new Set(attendanceData.map((item) => item.session))];

  return (
    <div className="attendance-container">
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
      <h1>Attendance Details</h1>

      {/* Filters and table go here */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Time</th>
              <th>Map view</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((attendance, index) => (
                <tr key={index} style={{ backgroundColor: getRowColor(attendance.session) }}>
                  <td>{attendance.name}</td>
                  <td>{attendance.latitude}</td>
                  <td>{attendance.longitude}</td>
                  <td>{new Date(attendance.time).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleMapClick(attendance.latitude, attendance.longitude)}>
                      View on Map
                    </button>
                  </td>
                  <td>{attendance.session}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Conditionally render map when location is selected */}
      {selectedLocation && (
        <div className="map-modal">
          <MapView latitude={selectedLocation.latitude} longitude={selectedLocation.longitude} />
          <button onClick={() => setSelectedLocation(null)}>Close Map</button>
        </div>
      )}
    </div>
  );
}

export default Attendance;
