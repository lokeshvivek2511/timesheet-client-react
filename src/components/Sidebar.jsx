import React from 'react'

function Sidebar() {
  return (
    <>
        <div className="side">
            <div className="userdetail">
                <p>example@gmail.com</p>
            </div>
            <div className="timebtn">
                <button className="btn">Create timesheet+</button>
                <button className="btn">Timesheet status</button>
            </div>

        </div>
    </>
  )
}

export default Sidebar