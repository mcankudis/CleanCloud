import { useState } from "react";
import './HomePage.css'

function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>All your Cloudserver</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default HomePage;
