const DefaultErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <p>Here is what we know…</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

export default DefaultErrorFallback;
