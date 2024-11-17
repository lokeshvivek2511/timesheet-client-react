import React, { useEffect } from 'react'
import { useState,useMemo,useContext } from "react";
import { UserContext } from "../App";
import { addtimesheet } from '../api';
import { notify } from "./toast";
import { getmytimesheet } from '../api';
import { Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti'
import Login from './Login';


function Home() {
  

  const [createtimesheet, setCreatetimeshee] = useState(true)
  const { userEmail,setUserEmail } = useContext(UserContext);


  const [tasks, setTasks] = useState([
    { startTime: '09:00', finishTime: '', task: '', id: 1 },
    { startTime: '', finishTime: '', task: '', id:'' }
  ]);

  // const[finaldatatosend,setFinaldatatosend]=useState({})

  const [errors, setErrors] = useState({});

  const [viewtimesheet,setViewtimesheet] = useState(false)

  const validateTimes = (taskList) => {
    const newErrors = {};
    
    taskList.forEach((task, index) => {
      // Convert times to minutes for comparison
      const currentStart = timeToMinutes(task.startTime);
      const currentEnd = timeToMinutes(task.finishTime);
      const previousEnd = index > 0 ? timeToMinutes(taskList[index - 1].finishTime) : null;

      // Validate first task starts at 9 AM
      if (index === 0 && task.startTime !== '09:00') {
        newErrors[`start-${task.id}`] = 'First task must start at 09:00';
      }

      // Validate finish time is after start time
      if (currentEnd <= currentStart) {
        newErrors[`finish-${task.id}`] = 'Finish time must be after start time';
      }

      // Validate current start time is after previous finish time
      if (index > 0 && previousEnd && currentStart < previousEnd) {
        newErrors[`start-${task.id}`] = 'Start time must be after previous finish time';
      }

      // Validate task description
      if (!task.task.trim()) {
        newErrors[`task-${task.id}`] = 'Task description is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleInputChange = (id, field, value) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
    validateTimes(updatedTasks);
  };

  const addTask = () => {
    const lastTask = tasks[tasks.length - 1];
    if (!lastTask.finishTime) {
      setErrors(prev => ({
        ...prev,
        [`finish-${lastTask.id}`]: 'Please complete the previous task first'
      }));
      return;
    }

    setTasks([
      ...tasks,
      {
        startTime: lastTask.finishTime,
        finishTime: '',
        task: '',
        id: tasks.length + 1
      }
    ]);
  };

  const removeTask = (id) => {
    if (tasks.length <= 2) return; // Maintain minimum 2 tasks
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateTimes(tasks)) {
      console.log('Timesheet submitted:', tasks);
      // Add your submission logic here
      const finaldatatosend={
        email:userEmail,
        date:new Date().toLocaleDateString('en-GB'),
        timesheet:tasks,
        status:'pending'

      }
      
         //data sending to server through api
         const responseStatus = await addtimesheet(finaldatatosend) ;
          // setStatus(responseStatus);
          if (responseStatus) {
            notify("Timesheet submitted succesfully", "success");
            }
            else{
            notify("Something went wrong", "error");

          }

    }
  };

 
  // Calculate total hours
  const calculateTotalHours = useMemo(() => {
    return tasks.reduce((total, task) => {
      const start = new Date(`2000-01-01T${task.startTime}`);
      const end = new Date(`2000-01-01T${task.finishTime}`);
      const diff = (end - start) / (1000 * 60 * 60); // Convert to hours
      return total + diff;
    }, 0);
  }, [tasks]);

  // Format time to display in 12-hour format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const [pretimesheet,setPretimesheet] = useState([
    {
        status:false,
        remark: ''
        }
  ])

 
useEffect(() => {
  const fetchTimesheet = async () => {
    const response = await getmytimesheet({email: userEmail});
    var poda=poda || false;
    if (response.status) {
      setPretimesheet(()=>[{
        date: response.data[0].date,
        status: response.data[0].status,
        remark: response.data[0].remark || '', // Add this line
        id: 1
      }]);
      setTasks(response.data[0].timesheet);
      if(!createtimesheet && response.data[0].status=='approved'){
        confetti({
          particleCount:150,
          spread:360
        })
      }
    }
  };

  fetchTimesheet();
}, [createtimesheet]);



  const handleViewTimesheet = (id) => {               //yet to code
    setViewtimesheet(!viewtimesheet)
  };




  //components

    const Sidebar = (<>
    <div className="side">
        <div className="userdetail">
            <p>{userEmail}</p>
        </div>
        <div className="timebtn">
            <button className="btn" onClick={()=>setCreatetimeshee(true)}>Create timesheet <h1>+</h1></button>
            <button className="btn" onClick={()=>setCreatetimeshee(false)}>Timesheet status</button>
            <button className="btn" onClick={()=>setUserEmail("")}>Log out</button>
        </div>

    </div>
     </>)

    const Timesheet=(<>
      <div className="createtimesheet-container">
      <h2 className="createtimesheet-header">Create Timesheet</h2>
      <form className="createtimesheet-form" onSubmit={handleSubmit}>
        {tasks.map((task, index) => (
          <div key={task.id} className="createtimesheet-task-container">
            <div className="createtimesheet-task-header">
              <span className="createtimesheet-task-number">Task {index + 1}</span>
              {tasks.length > 2 && (
                <button
                  type="button"
                  className="createtimesheet-remove-btn"
                  onClick={() => removeTask(task.id)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="createtimesheet-row">
              <div className="createtimesheet-field">
                <label className="createtimesheet-label">Start Time</label>
                <input
                  type="time"
                  className="createtimesheet-input"
                  value={task.startTime}
                  onChange={(e) => handleInputChange(task.id, 'startTime', e.target.value)}
                  readOnly={index === 0} // First task start time is fixed
                />
                {errors[`start-${task.id}`] && (
                  <span className="createtimesheet-error">{errors[`start-${task.id}`]}</span>
                )}
              </div>
              <div className="createtimesheet-field">
                <label className="createtimesheet-label">Finish Time</label>
                <input
                  type="time"
                  className="createtimesheet-input"
                  value={task.finishTime}
                  onChange={(e) => handleInputChange(task.id, 'finishTime', e.target.value)}
                />
                {errors[`finish-${task.id}`] && (
                  <span className="createtimesheet-error">{errors[`finish-${task.id}`]}</span>
                )}
              </div>
              <div className="createtimesheet-field">
                <label className="createtimesheet-label">Task Description</label>
                <input
                  type="text"
                  className="createtimesheet-input"
                  value={task.task}
                  onChange={(e) => handleInputChange(task.id, 'task', e.target.value)}
                  placeholder="Enter task description"
                />
                {errors[`task-${task.id}`] && (
                  <span className="createtimesheet-error">{errors[`task-${task.id}`]}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="timesheettable-total">
          <span className="timesheettable-total-label">Total Hours:</span>
          <span className="timesheettable-total-hours">
            {calculateTotalHours.toFixed(2)} hours <br />{calculateTotalHours<8 && <p >*atleast 8 hrs</p>}
          </span>
    </div>
        
        <button
          type="button"
          className="createtimesheet-add-btn"
          onClick={addTask}
        >
          Add Task
        </button>

        <button type="submit" className="createtimesheet-submit-btn" disabled={calculateTotalHours< 8}>
          Submit Timesheet
        </button>
      </form>
    </div>
    </>)

    const Timesheetable=(<>
      <div className="timesheettable-container">
    <h2 className="timesheettable-header">Timesheet Details</h2>
    {pretimesheet[0].date && (
      <div className="timesheettable-date">
        Date: {pretimesheet[0].date}
      </div>
    )}

    <table className="timesheettable-table">
      <thead>
        <tr>
          <th>Start Time</th>
          <th>Finish Time</th>
          <th>Task Description</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={index}>
            <td className="timesheettable-time">
              {formatTime(task.startTime)}
            </td>
            <td className="timesheettable-time">
              {formatTime(task.finishTime)}
            </td>
            <td className="timesheettable-task">{task.task}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="timesheettable-total">
      <span className="timesheettable-total-label">Total Hours:</span>
      <span className="timesheettable-total-hours">
        {calculateTotalHours.toFixed(2)} hours
      </span>
    </div>
    </div>
    </>)

    const Timesheetstatus=(<>
    
      {pretimesheet[0].status ? <div className="timesheet-container">
        <table className="timesheet-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Request Status</th>
              {pretimesheet.some(entry => entry.status === "rejected") && <th>Remark</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pretimesheet.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td>
                  <span className={entry.status === "approved" ? 'timesheet-status timesheet-status-approved' : 
                                 entry.status === "rejected" ? 'timesheet-status timesheet-status-rejected' : 
                                 'timesheet-status timesheet-status-pending'}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </td>
                {pretimesheet.some(entry => entry.status === "rejected") && 
                  <td>{entry.status === "rejected" ? entry.remark : "-"}</td>
                }
                <td>
                  <button
                    className="timesheet-view-btn"
                    onClick={() => handleViewTimesheet(entry.id)}
                  >
                    View Timesheet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {viewtimesheet && Timesheetable}
      </div>
      :
      <p>No timesheet submitted yet!</p>
    }
    </>)

   
    


  return (
    <>
      {userEmail.length==0 && <Navigate to="/login" replace />}

      <div className="home">
        {Sidebar}
        {createtimesheet? Timesheet : Timesheetstatus}
      </div>
    </>
  )
}

export default Home