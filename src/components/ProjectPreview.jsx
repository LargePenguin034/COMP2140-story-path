import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLocations, getProject } from "../data/projects";
import Project from "./project";

const ProjectPreview = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState();
  const navigate = useNavigate();
  const { id, location_order } = useParams();

  const handleLocation = (location_order) => {
    navigate(`/projects/${project.id}/${location_order}`);
  };

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
  }, [id]);

  // Calculate total points and number of locations
  const totalPoints = locations.reduce(
    (sum, location) => sum + location.score_points,
    0
  );
  const totalLocations = locations.length;

  const selectedLocation = locations.find(
    (location) => location.location_order === parseInt(location_order)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col-9">
          <h1>{project.title} - Preview </h1>
        </div>
        <div className="col-3 d-flex justify-content-end">
          <button
            className="btn btn-danger"
            onClick={() => navigate("/projects")}
          >
            Back to Projects
          </button>
        </div>
      </div>
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="list-group">
            <a className="list-group-item list-group-item-action bg-dark text-light">
              Locations
            </a>
            <a
              className={`list-group-item list-group-item-action ${
                selectedLocation ? "" : "active"
              } cursor-pointer`}
              onClick={() => handleLocation("")}
            >
              Initial screen
            </a>
            {locations.map((location) => (
              <a
                key={location.id}
                className={`cursor-pointer list-group-item list-group-item-action ${(location.location_order == location_order) ? "active" : ""}`}
                onClick={() => handleLocation(location.location_order)}
              >
                {location.location_name}
              </a>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          {selectedLocation ? (
            <Project
              index={0}
              totalLocations={totalLocations}
              cumulativePoints={selectedLocation.score_points}
              totalPoints={totalPoints}
              location={selectedLocation}
            />
          ) : (
            <div className="card">
              <div className="card-header bg-primary text-light">
                <h3 className="card-title">{project.title}</h3>
              </div>
              <div className="card-body">
                <h5 className="card-title">Instructions</h5>
                <p className="card-text">{project.instructions}</p>
                <h6 className="card-title">Initial Clue</h6>
                <p className="card-text">{project.initial_clue}</p>
                <div className="row">
                  <div className="col-6">
                    <h6>Location</h6>
                    <p>0/{totalLocations}</p>
                  </div>
                  <div className="col-6">
                    <h6>Points</h6>
                    <p>0/{totalPoints}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;
