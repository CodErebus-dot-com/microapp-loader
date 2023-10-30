import './skeleton.css';

const DefaultSuspenseFallback = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton"></div>
    </div>
  );
};

export default DefaultSuspenseFallback;
