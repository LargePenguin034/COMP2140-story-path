import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getLocation } from "../data/projects";
import { updateLocation } from "../data/projects";

const LocationForm = () => {
  const [formData, setFormData] = useState({
    location_name: "",
    location_trigger: "",
    location_position: "",
    score_points: "",
    clue: "",
    location_content: "",
  });
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for invalid ID
  const { id } = useParams(); // Fetch ID from URL

  // Fetch the location data when id is present
  useEffect(() => {
    if (id) {
      // Simulate API call to get location data based on id
      getLocation(id).then((data) => {
        if (data.length > 0) {
          setFormData({
            location_name: data[0].location_name || "",
            location_trigger: data[0].location_trigger || "",
            location_position: data[0].location_position || "",
            score_points: data[0].score_points || "",
            clue: data[0].clue || "",
            location_content: data[0].location_content || "",
          });
          setLoading(false);
        } else {
            setLoading(false);
            setError("Invalid Location")
        }
      });
    } else {
      setLoading(false); // No id, create mode, stop loading
    }
  }, [id]);

  const handleEditorChange = (content) => {
    setFormData({ ...formData, location_content: content });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
        const response = await updateLocation(id, formData);
        console.log(response);
    };
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching data
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>; // Display error message if ID is invalid
  }

  return (
    <div className="container mt-5">
      <h2>Location Form</h2>
      <Form onSubmit={handleSubmit}>
        {/* Location Name (Text input) */}
        <Form.Group className="mb-3" controlId="location_name">
          <Form.Label>Location Name</Form.Label>
          <Form.Control
            type="text"
            name="location_name"
            placeholder="Enter Location Name"
            value={formData.location_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Location Trigger (DropDown) */}
        <Form.Group className="mb-3" controlId="location_trigger">
          <Form.Label>Location Trigger</Form.Label>
          <Form.Select
            name="location_trigger"
            value={formData.location_trigger}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Trigger
            </option>
            <option value="1">Trigger 1</option>
            <option value="2">Trigger 2</option>
            <option value="3">Trigger 3</option>
          </Form.Select>
        </Form.Group>

        {/* Location Position (Text input) */}
        <Form.Group className="mb-3" controlId="location_position">
          <Form.Label>Location Position</Form.Label>
          <Form.Control
            type="text"
            name="location_position"
            placeholder="Enter Location Position"
            value={formData.location_position}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Score Points (Number Input) */}
        <Form.Group className="mb-3" controlId="score_points">
          <Form.Label>Score Points</Form.Label>
          <Form.Control
            type="number"
            name="score_points"
            placeholder="Enter Score Points"
            value={formData.score_points}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Clue (Text input) */}
        <Form.Group className="mb-3" controlId="clue">
          <Form.Label>Clue</Form.Label>
          <Form.Control
            type="text"
            name="clue"
            placeholder="Enter Clue"
            value={formData.clue}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LocationForm;
