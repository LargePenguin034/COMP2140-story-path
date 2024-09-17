import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLocations } from "../data/projects";

const Project = ({ projects }) => {
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
        setLocations(data.sort((a, b) => a.location_order - b.location_order));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const {
    description,
    homescreen_display,
    _,
    initial_clue,
    instructions,
    is_published,
    participant_scoring,
    title,
    username,
  } = project;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-3">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{title}</h3>
            </div>
            <div className="card-body">
              <h5 className="card-title">Instructions</h5>
              <p className="card-text">
                {instructions}
              </p>
              <h6 className="card-subtitle mb-2 text-muted">Initial Clue</h6>
              <p className="card-text">
                {initial_clue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
