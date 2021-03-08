import './info.css';

export default function Info(props) {
  const { text, heading } = props;

  return (
    <div className="divInfoStyle">
      <h2 className="name">{heading}</h2>
      <p className="info">{text}</p>
    </div>
  );
}
