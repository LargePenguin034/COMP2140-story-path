import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../data/projects";

function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const handleViewLocations = (projectId) => {
    navigate(`/locations/${projectId}`);
  };

  const handleEdit = (projectId) => {
    navigate(`/projectedit/${projectId}`);
  };

  const handleDelete = (projectId) => {
    deleteProject(projectId);

    const newProject = projects.filter((project) => project.id !== projectId);

    setProjects(newProject);
  };

  const handlePreview = (projectId) => {
    navigate(`/projects/${projectId}`)
  }

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
        <Link to="/projectedit" className="btn btn-primary">
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
                    {project.title}
                    <span
                      className={`badge rounded-pill ms-3 ${
                        project.is_published
                          ? "text-bg-success"
                          : "text-bg-secondary"
                      }`}
                    >
                      {project.is_published ? "Published" : "Not Published"}
                    </span>
                </div>
                {project.description}
              </div>

              <div className="d-flex ms-auto align-self-start">
                <div className="input-group">
                <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={() => handlePreview(project.id)}
                  >
                    Preview
                  </button>
                  <button
                    className="btn btn-outline-warning"
                    type="button"
                    onClick={() => handleEdit(project.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => handleViewLocations(project.id)}
                  >
                    View Locations
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={() => handleDelete(project.id)}
                  >
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
