import React from "react";
import { Link } from "react-router-dom";
import Images from "./Image";

function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h1 className="mb-4">Welcome to StoryPath!</h1>
          <p>Create engaging tours, hunts, and adventures!</p>
          <hr></hr>
          <ul>
            <li>create cool adventures</li>
            <li>create tours for all ages</li>
            <li>engaging experiences</li>
          </ul>
          <Link to="/projects" className="btn btn-primary">
            Create a Tour
          </Link>
        </div>
        <div className="col-6">
          <Images></Images>
        </div>
      </div>
    </div>
  );
}

export default Home;
