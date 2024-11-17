// const baseuri=`https://timesheet-node-loki.netlify.app/.netlify/functions/api`;
const baseuri=`http://localhost:5000/api/`


export const handleSignup = async (data) => {
    const res = await fetch(`${baseuri}signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    return result.status;
 };

export const handleSignin = async (data) => {
    const res = await fetch(`${baseuri}signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result.status);
    return result.status;
 };

export const addtimesheet = async (data) => {
    const res = await fetch(`${baseuri}addtimesheet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result.status);
    return result.status;
 };
export const getmytimesheet = async (data) => {
    const res = await fetch(`${baseuri}getmytimesheet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result.status);
    console.log(result);
    return result;
 };

 export const handleadminlogin = async (data) => {
    const res = await fetch(`${baseuri}adminlogin`, {
        method: 'POST',
        // credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result.status);
    return result.status;
 };

 export const getAllTimesheets = async () => {
    const res = await fetch(`${baseuri}getAllTimesheets`);
    const result = await res.json();
    return result;
};

export const updateTimesheetStatus = async (data) => {
    const res = await fetch(`${baseuri}updateTimesheetStatus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    return result.status;
};

//  getmytimesheet({email:"123@gmail.com"})