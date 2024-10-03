import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for React Quill
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getLocation } from "../data/projects";
import { updateLocation, createLocation } from "../data/projects";
import LocationPicker from "./LocationPicker";

const LocationForm = () => {
  const [formData, setFormData] = useState({
    location_name: "",
    location_trigger: "",
    longitude: "",
    latitude: "",
    clue: "",
    location_content: "",
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for invalid ID
  const { projectid, id } = useParams(); // Fetch ID from URL
  const [success, setSuccess] = useState(null); // Success state for successful update
  const [fade, setFade] = useState(false); // State to trigger the fade effect
  const navigate = useNavigate();
  // Fetch the location data when id is present

  // Quill toolbar options
  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    },
  };

  useEffect(() => {
    if (id) {
      // Simulate API call to get location data based on id
      getLocation(id).then((data) => {
        if (data.length > 0) {
          setFormData({
            location_name: data[0].location_name || "",
            location_trigger: data[0].location_trigger || "",
            location_position: data[0].location_position || "",
            longitude: data[0].location_position
              .replace(/[()]/g, "")
              .split(",")[1],
            latitude: data[0].location_position
              .replace(/[()]/g, "")
              .split(",")[0],
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

  const handleLocationSelect = (coordinates) => {
    setFormData({
      ...formData,
      longitude: coordinates["lng"],
      latitude: coordinates["lat"],
    });
  };


  const handleEditorChange = (content) => {
    setFormData({ ...formData, location_content: content });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataCreation = {
      location_name: formData.location_name,
      location_trigger: formData.location_trigger,
      location_position: `${formData.latitude},${formData.longitude}`,
      score_points: formData.score_points,
      clue: formData.clue,
      location_content: formData.location_content,
    };
    try {
      if (id) {
        await updateLocation(id, dataCreation);
        setSuccess("Sucessfuly Updated");
      } else {
        await createLocation(projectid, dataCreation);
        setSuccess("Sucessfuly Created");
      }
    } catch {
      setError("No changes were made");
    }
    // Show the message and trigger fade effect after 5 seconds
    setFade(false); // Reset fade state
    setTimeout(() => {
      setFade(true);
      setError(null);
    }, 1000); // Start fade animation after rendering success message

    setTimeout(() => {
      setSuccess(null); // Remove message after fade-out
      setError(null);
    }, 5000); // Wait 5 seconds before completely removing the success message
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching data
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
      <div className="row mb-3">
        <div className="col-9">
          <h1>{id ? "Edit Location" : "Add Location"}</h1>
        </div>
        <div className="col-3 d-flex justify-content-end">
          <button
            className="btn btn-danger"
            onClick={() => navigate(`/locations/${projectid}`)}
          >
            Back to Location
          </button>
        </div>
      </div>
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

        <label>Location Picker:</label>
        <LocationPicker
          formData={formData}
          setFormData={setFormData}
          onLocationSelect={handleLocationSelect}
        />

        {/* Longitude and Latitude Inputs Side by Side */}
        <Form.Group className="mb-3">
          <div className="row">
            <div className="col">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                name="longitude"
                placeholder="Enter Longitude"
                value={formData.longitude}
                onChange={handleChange}
                min="-180"
                max="180"
                step="any"
                required
              />
            </div>

            <div className="col">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                name="latitude"
                placeholder="Enter Latitude"
                value={formData.latitude}
                onChange={handleChange}
                min="-90"
                max="90"
                step="any"
                required
              />
            </div>
          </div>
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

        {/* Rich Text Editor for Location Content */}
        <Form.Group className="mb-3" controlId="location_content">
          <Form.Label>Location Content</Form.Label>
          <ReactQuill
            value={formData.location_content}
            onChange={handleEditorChange}
            modules={modules}
          />
        </Form.Group>

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
        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LocationForm;
