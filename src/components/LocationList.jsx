import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getLocations, updateLocationOrder } from "../data/projects";

function LocationList({ projects }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();


  const project = projects.find((r) => r.id == id);

  if (!project) {
    return <div>Project not found</div>;
  }

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations(id);
        setLocations(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);


  const handleMoveUp = async (index) => {
    if (index === 0) return; // Cannot move up the first item

    const newLocations = [...locations];

    // Swap location_order values
    const temp1 = JSON.parse(JSON.stringify(newLocations[index]));
    const temp2 = JSON.parse(JSON.stringify(newLocations[index-1]));
    newLocations[index].location_order = temp2.location_order;
    newLocations[index - 1].location_order = temp1.location_order;

    setLocations(newLocations);


    await updateLocationOrder(temp1.id, temp2.location_order);
    await updateLocationOrder(temp2.id,  temp1.location_order)
};


const handleMoveDown = async (index) => {
    if (index === locations.length - 1) return; // Cannot move down the last item

    const newLocations = [...locations];

    // Swap location_order values
    const temp1 = JSON.parse(JSON.stringify(newLocations[index]));
    const temp2 = JSON.parse(JSON.stringify(newLocations[index+1]));
    newLocations[index].location_order = temp2.location_order;
    newLocations[index + 1].location_order = temp1.location_order;

    setLocations(newLocations);


    await updateLocationOrder(temp1.id, temp2.location_order);
    await updateLocationOrder(temp2.id,  temp1.location_order)

};



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="container mb-3">
        <h1 className="mb-4">{project.title}</h1>
        <Link to="/projects" className="btn btn-primary">
          Add Location
        </Link>
      </div>
      <div className="container">
        <ul className="list-group">
          {locations
            ?.sort((a, b) => a.location_order - b.location_order)
            .map((location, index) => (
              <li
                key={location.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="col-6">
                  {location.location_name}
                  <div className="fw-bold">
                    <Link
                      to={`/projects/${location.id}`}
                      className="text-decoration-none"
                    >
                      {location.title}{" "}
                    </Link>
                  </div>
                  location order: {location.location_order}
                </div>
                <div className="d-flex ms-auto align-self-start">
                  <div className="input-group">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <i className="bi bi-arrow-up"></i>
                    </button>

                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === locations.length - 1}
                    >
                      <i className="bi bi-arrow-down"></i>
                    </button>

                    <button className="btn btn-outline-warning" type="button">
                      Edit
                    </button>
                    <button className="btn btn-outline-danger" type="button">
                      Delete
                    </button>
                    <button className="btn btn-outline-success" type="button">
                      Print QR Code
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default LocationList;
