import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getLocation } from "../data/projects";
import { updateLocation, createLocation } from "../data/projects";

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
  const { projectid, id } = useParams(); // Fetch ID from URL
  const [success, setSuccess] = useState(null); // Success state for successful update
  const [fade, setFade] = useState(false); // State to trigger the fade effect

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
          setError("Invalid Location");
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
    try {
      if (id) {
        await updateLocation(id, formData);
        setSuccess("Sucessfuly Updated");
      } else {
        await createLocation(projectid, formData);
        setSuccess("Sucessfuly Created");
      }
    } catch {
      setError("No changes were made");
    }
    // Show the message and trigger fade effect after 5 seconds
    setFade(false); // Reset fade state
    setTimeout(() => {
      setFade(true);
    }, 1000); // Start fade animation after rendering success message

    setTimeout(() => {
      setSuccess(null); // Remove message after fade-out
    }, 5000); // Wait 5 seconds before completely removing the success message
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching data
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>; // Display error message if ID is invalid
  }

  return (
    <div className="container mt-5">
      {success && (
        <div className={`alert alert-success ${fade ? "fade-out" : ""}`}>
          {success}
        </div>
      )}
      {error && (
        <div className={`alert alert-danger ${fade ? "fade-out" : ""}`}>
          {error}
        </div>
      )}
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
            <option value="Location Entry">Location Entry</option>
            <option value="QR Code Scan">QR Code Scan</option>
            <option value="Location Entry and QR Code Scan">
              Location Entry and QR Code Scan
            </option>
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
