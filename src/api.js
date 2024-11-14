export const handleSignup = async (data) => {
    const res = await fetch('http://localhost:5000/api/signup', {
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
    const res = await fetch('http://localhost:5000/api/signin', {
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
    const res = await fetch('http://localhost:5000/api/addtimesheet', {
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
    const res = await fetch('http://localhost:5000/api/getmytimesheet', {
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
    const res = await fetch('http://localhost:5000/api/adminlogin', {
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

 export const getAllTimesheets = async () => {
    const res = await fetch('http://localhost:5000/api/getAllTimesheets');
    const result = await res.json();
    return result;
};

export const updateTimesheetStatus = async (data) => {
    const res = await fetch('http://localhost:5000/api/updateTimesheetStatus', {
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