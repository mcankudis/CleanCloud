import { useState } from "react";

function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Your Cloudserver List</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Standort</th>
            <th scope="col">Name</th>
            <th scope="col">CO2-Intenzität</th>
            <th scope="col">Provider</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td >Larry the Bird</td>
            <td >wat</td>
            <td >@twitter</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default HomePage;
