import React from 'react';
import { useParams } from 'react-router-dom';

const Recipe = ({ recipes }) => {
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const { title, author, rating, description, ingredients, steps } = recipe;

  return (
    <div>
      <h1 className="mb-4">{title}</h1>
      <p>By {author} with Rating: {rating} / 5</p>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Description</h5>
          <p>{description}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map(({ item, amount }, index) => (
              <li key={index}>{item} - {amount}</li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h2>Steps</h2>
          <ol>
            {steps.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Recipe;