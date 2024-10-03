import React from "react";

function Project({
  index,
  totalLocations,
  cumulativePoints,
  totalPoints,
  location,
}) {
  return (
    <div key={location.id} id={`location-${location.id}`} className="card mb-3">
      <div className="card-header bg-primary text-light">
        <h3 className="">{location.location_name}</h3>
      </div>
      <div className="card-body">
        <h5>Clue</h5>
        <p>{location.clue}</p>
        {location.location_content? 
        (
          <div
          className="location-content"
          dangerouslySetInnerHTML={{ __html: location.location_content }}
        />
        ) : (<div></div>)}

        <div className="row">
          <div className="col-6">
            <h6>Location</h6>
            <p>
              {index + 1}/{totalLocations}
            </p>
          </div>
          <div className="col-6">
            <h6>Points</h6>
            <p>
              {cumulativePoints}/{totalPoints}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
