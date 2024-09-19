import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects } from "../data/projects";

function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const handleViewLocations = (projectId) => {
    navigate(`/locations/${projectId}`);
  };

  const handleEdit = (projectId) => {
    navigate(`/projectedit/${projectId}`);
  };

  // Fetch projects from API when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects(); 
        setProjects(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <div className="container mb-3">
        <h1 className="mb-4">Projects</h1>
        <Link to="/projects" className="btn btn-primary">
          Add Project
        </Link>
      </div>
      <div className="container">
        <ul className="list-group">
          {projects?.map((project) => (
            <li
              key={project.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="col-6">
                <div className="fw-bold">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-decoration-none"
                  >
                    {project.title}{" "}
                    <span className="badge text-bg-success rounded-pill">
                      Published
                    </span>
                  </Link>
                </div>
                {project.description}
              </div>

              <div className="d-flex ms-auto align-self-start">
                <div className="input-group">
                  <button
                    className="btn btn-outline-warning"
                    type="button"
                    onClick={() => handleEdit(project.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-primary ms-2"
                    type="button"
                    onClick={() => handleViewLocations(project.id)}
                  >
                    View Locations
                  </button>
                  <button className="btn btn-outline-danger ms-2" type="button">
                    Delete
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

export default ProjectList;
