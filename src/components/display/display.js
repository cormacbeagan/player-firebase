import './display.css';

function Display({ displayData }) {
  return (
    <div className="displayDiv">
      {displayData && (
        <p className="display" tabIndex="0">
          {displayData}
        </p>
      )}
    </div>
  );
}

export default Display;
