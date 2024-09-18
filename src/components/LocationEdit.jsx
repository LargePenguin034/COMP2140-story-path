import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';



const LocationForm = () => {
  const [formData, setFormData] = useState({
    locationName: '',
    locationTrigger: '',
    locationPosition: '',
    scorePoints: '',
    clue: '',
    locationContent: '',
  });

  const handleEditorChange = (content) => {
    setFormData({ ...formData, locationContent: content });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // You can handle form submission here
  };

  return (
    <div className="container mt-5">
      <h2>Location Form</h2>
      <Form onSubmit={handleSubmit}>
        {/* Location Name (Text input) */}
        <Form.Group className="mb-3" controlId="locationName">
          <Form.Label>Location Name</Form.Label>
          <Form.Control
            type="text"
            name="locationName"
            placeholder="Enter Location Name"
            value={formData.locationName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Location Trigger (DropDown) */}
        <Form.Group className="mb-3" controlId="locationTrigger">
          <Form.Label>Location Trigger</Form.Label>
          <Form.Select
            name="locationTrigger"
            value={formData.locationTrigger}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Trigger</option>
            <option value="1">Trigger 1</option>
            <option value="2">Trigger 2</option>
            <option value="3">Trigger 3</option>
          </Form.Select>
        </Form.Group>

        {/* Location Position (Text input) */}
        <Form.Group className="mb-3" controlId="locationPosition">
          <Form.Label>Location Position</Form.Label>
          <Form.Control
            type="text"
            name="locationPosition"
            placeholder="Enter Location Position"
            value={formData.locationPosition}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Score Points (Number Input) */}
        <Form.Group className="mb-3" controlId="scorePoints">
          <Form.Label>Score Points</Form.Label>
          <Form.Control
            type="number"
            name="scorePoints"
            placeholder="Enter Score Points"
            value={formData.scorePoints}
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
