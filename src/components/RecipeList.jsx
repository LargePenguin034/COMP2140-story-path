import React from "react";
import { Link } from "react-router-dom";

function RecipeList({ recipes }) {
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
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="col-6">
                <div className="fw-bold">
                  <Link
                    to={`/projects/${recipe.id}`}
                    className="text-decoration-none"
                  >
                    {recipe.title}{" "}
                    <span className="badge text-bg-success rounded-pill">
                      Published
                    </span>
                  </Link>
                </div>
                {recipe.description}
              </div>

              {/* Buttons aligned to the right */}
              <div className="d-flex ms-auto align-self-start">
                <div className="input-group">
                  <button className="btn btn-outline-warning" type="button">
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-primary ms-2"
                    type="button"
                  >
                    View Locations
                  </button>
                  <button
                    className="btn btn-outline-danger ms-2"
                    type="button"
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

export default RecipeList;
