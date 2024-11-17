import React, { useState, useEffect,useContext } from 'react';
import { getAllTimesheets, updateTimesheetStatus } from '../api';
import { notify } from "./toast";
import { AdminContext } from "../App";
import {  Navigate } from "react-router-dom";



function Admin() {
  const { adminEmail,setAdminEmail } = useContext(AdminContext);
  const [timesheets, setTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    const response = await getAllTimesheets();
    if (response.status) {
      setTimesheets(response.data);
    }
    setLoading(false);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const handleStatusUpdate = async (email, date, status) => {
    const data = {
      email,
      date,
      status,
      remark: status === 'rejected' ? remark : undefined
    };

    const success = await updateTimesheetStatus(data);
    if (success) {
      notify(`Timesheet ${status} successfully`, "success");
      fetchTimesheets();
      setSelectedTimesheet(null);
      setRemark('');
    } else {
      notify("Failed to update timesheet status", "error");
    }
  };

  const calculateTotalHours = (timesheet) => {
    return timesheet.reduce((total, task) => {
      const start = new Date(`2000-01-01T${task.startTime}`);
      const end = new Date(`2000-01-01T${task.finishTime}`);
      return total + (end - start) / (1000 * 60 * 60);
    }, 0).toFixed(2);
  };

  const pendingTimesheets = timesheets.filter(ts => ts.status === 'pending');
  const processedTimesheets = timesheets.filter(ts => ts.status !== 'pending');

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  const handleLogout = () => {
    setAdminEmail('');
    notify("Logged out successfully", "success");
  };

  return (
    <div className="admin-container">
      {adminEmail.length==0 && <Navigate to="/adminlogin" replace />}
      <div className="admin-header-container">
      <h2 className="admin-header">Timesheet Management</h2>
      <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        </div>
      <div className="admin-sections">
        <div className="admin-section">
          <h3>Pending Timesheets</h3>
          <div className="timesheet-list">
            {pendingTimesheets.map((entry) => (
              <div key={`${entry.email}-${entry.date}`} className="timesheet-card">
                <div className="timesheet-info">
                  <p><strong>Email:</strong> {entry.email}</p>
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Status:</strong> <span className="status-pending">{entry.status}</span></p>
                </div>
                <button 
                  className="view-btn"
                  onClick={() => setSelectedTimesheet(entry)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-section">
          <h3>Processed Timesheets</h3>
          <div className="timesheet-list">
            {processedTimesheets.map((entry) => (
              <div key={`${entry.email}-${entry.date}`} className="timesheet-card">
                <div className="timesheet-info">
                  <p><strong>Email:</strong> {entry.email}</p>
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-${entry.status}`}>
                      {entry.status}
                    </span>
                  </p>
                  {entry.remark && <p><strong>Remark:</strong> {entry.remark}</p>}
                </div>
                <button 
                  className="view-btn"
                  onClick={() => setSelectedTimesheet(entry)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTimesheet && (
        <div className="timesheet-modal">
          <div className="modal-content">
            <h3>Timesheet Details</h3>
            <p><strong>Email:</strong> {selectedTimesheet.email}</p>
            <p><strong>Date:</strong> {selectedTimesheet.date}</p>
            
            <table className="timesheet-table">
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Task</th>
                </tr>
              </thead>
              <tbody>
                {selectedTimesheet.timesheet.map((task, index) => (
                  <tr key={index}>
                    <td>{formatTime(task.startTime)}</td>
                    <td>{formatTime(task.finishTime)}</td>
                    <td>{task.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <p><strong>Total Hours:</strong> {calculateTotalHours(selectedTimesheet.timesheet)}</p>

            {selectedTimesheet.status === 'pending' && (
              <div className="action-buttons">
                {remark && (
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="remark-input"
                  />
                )}
                <button 
                  className="approve-btn"
                  onClick={() => handleStatusUpdate(selectedTimesheet.email, selectedTimesheet.date, 'approved')}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => setRemark(remark ? '' : ' ')}
                >
                  Reject
                </button>
                {remark && (
                  <button 
                    className="confirm-reject-btn"
                    onClick={() => handleStatusUpdate(selectedTimesheet.email, selectedTimesheet.date, 'rejected')}
                  >
                    Confirm Rejection
                  </button>
                )}
              </div>
            )}
            
            <button 
              className="close-btn"
              onClick={() => {
                setSelectedTimesheet(null);
                setRemark('');
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
