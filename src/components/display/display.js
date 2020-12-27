import React from 'react';
import './display.css';


// displays the info song added, song already there, or failure messages
function Display({displayData}){
 return (
    <div className='displayDiv'>
        <text className='display' >{displayData}</text>
    </div>
)
};

export default Display;