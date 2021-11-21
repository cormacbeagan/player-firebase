import { useEffect, useState } from 'react';
import './image.css';

function Image({ data, station }) {
  const [is2Day, setIs2Day] = useState(station?.name === '2Day');
  const [imgStyle, setImgStyle] = useState({ display: 'none' });

  useEffect(() => {
    if (data.show) {
      setImgStyle({ display: 'block' });
    } else {
      setImgStyle({ display: 'none' });
    }
  }, [data.show]);

  useEffect(() => {
    setIs2Day(station?.name === '2Day');
  }, [station]);

  return (
    <div className={is2Day ? 'image-container' : 'image-container schwarz'}>
      <img
        id="load"
        src={data.image}
        className="image"
        style={imgStyle}
        alt="Album Cover"
      />
    </div>
  );
}

export default Image;
