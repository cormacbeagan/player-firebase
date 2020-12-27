import React from 'react';
import './check.css';

function Check({onClick, check}){
  
  const handleClick = (e) => {
    e.preventDefault()
    onClick()
  }
  return (
    <div className='divCheckStyle'>
        <a href='' 
        className='check-btn check-btn-white check-btn-animated'
        onClick={handleClick} 
        className={check === 'CHECK' ? 'check-btn check-btn-white ' : 'check-btn check-btn-white-checking ' }
        >
        {check}
        </a>
    </div>
    )
}


  export default Check
  