import React from 'react';
import { Link } from 'react-router-dom';

function RecipeList({ recipes }) {
  return (
    <div>
      <h1 className="mb-4">Recipes</h1>
      <ul className="list-group">
        {recipes.map(recipe => (
          <li key={recipe.id} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/recipe/${recipe.id}`} className="text-decoration-none">
              {recipe.title}
            </Link>
            <span className="badge bg-primary rounded-pill">Rating: {recipe.rating}/5</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;