import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLocations, getProject } from "../data/projects";

const Project = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations(id);
        setLocations(data.sort((a, b) => a.location_order - b.location_order));
      } catch (error) {
        setError(error);
      }
    };

    const fetchProject = async () => {
      try {
        const data = await getProject(id);
        setProject(data[0]);
      } catch (error) {
        setError(error);
        setProject(null);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProject(), fetchLocations()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-3">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{project.title}</h3>
            </div>
            <div className="card-body">
              <h5 className="card-title">Instructions</h5>
              <p className="card-text">{project.instructions}</p>
              <h6 className="card-subtitle mb-2 text-muted">Initial Clue</h6>
              <p className="card-text">{project.initial_clue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
