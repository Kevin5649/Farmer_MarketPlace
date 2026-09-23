const Spinner = ({ text = 'Loading...' }) => (
  <div className="loading-wrapper">
    <div className="spinner"></div>
    <p>{text}</p>
  </div>
);

export default Spinner;
