import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getProject } from "../data/projects";
import { updateProject, createProject } from "../data/projects";

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_published: false,
    participant_scoring: "",
    instructions: "",
    initial_clue: "",
    homescreen_display: "",
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for invalid ID
  const { projectid } = useParams(); // Fetch ID from URL
  const [success, setSuccess] = useState(null); // Success state for successful update
  const [fade, setFade] = useState(false); // State to trigger the fade effect
  const navigate = useNavigate();

  // Fetch the location data when id is present
  useEffect(() => {
    if (projectid) {
      // Simulate API call to get location data based on id
      getProject(projectid).then((data) => {
        if (data.length > 0) {
          setFormData({
            title: data[0].title || "",
            description: data[0].description || "",
            is_published: data[0].is_published || false,
            participant_scoring: data[0].participant_scoring || "",
            instructions: data[0].instructions || "",
            initial_clue: data[0].initial_clue || "",
            homescreen_display: data[0].homescreen_display || "",
          });
          setLoading(false);
        } else {
          setLoading(false);
          setError("Invalid Project");
        }
      });
    } else {
      setLoading(false); // No id, create mode, stop loading
    }
  }, [projectid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (projectid) {
        await updateProject(projectid, formData);
        setSuccess("Sucessfuly Updated");
      } else {
        await createProject(formData);
        navigate(`/projects`)
        setSuccess("Sucessfuly Created");
      }
    } catch {setError('No Changes were made')}

    // Show the message and trigger fade effect after 5 seconds
    setFade(false); // Reset fade state
    setTimeout(() => {
      setFade(true);
    }, 1000); // Start fade animation after rendering success message

    setTimeout(() => {
      setSuccess(null); // Remove message after fade-out
      setError(null);
    }, 4500); // Wait 5 seconds before completely removing the success message
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
          <h1>{projectid? "Edit Project" : "Add Project"}</h1>
        </div>
        <div className="col-3 d-flex justify-content-end">
          <button
            className="btn btn-danger"
            onClick={() => navigate(`/projects`)}
          >
            Back to projects
          </button>
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        {/* Title (Text input) */}
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Description (Text input) */}
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3} // Adjust the number of rows as needed
          />
        </Form.Group>

        {/* Published (Checkbox) */}
        <Form.Group className="mb-3" controlId="is_published">
          <Form.Check
            type="checkbox"
            id="is_published"
            label="Published"
            checked={formData.is_published == true}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "is_published",
                  value: e.target.checked ? true : false,
                },
              })
            }
          />
        </Form.Group>

        {/* Participant Scoring (DropDown) */}
        <Form.Group className="mb-3" controlId="participant_scoring">
          <Form.Label>Participant Scoring</Form.Label>
          <Form.Select
            name="participant_scoring"
            value={formData.participant_scoring}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Scoring
            </option>
            <option value="Not Scored">Not Scored</option>
            <option value="Number of Scanned QR Codes">
              Number of Scanned QR Codes
            </option>
            <option value="Number of Locations Entered">
              Number of Locations Entered
            </option>
          </Form.Select>
        </Form.Group>

        {/* Instructions (Text Area) */}
        <Form.Group className="mb-3" controlId="instructions">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            name="instructions"
            placeholder="Enter Instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            rows={3} // Adjust the number of rows as needed
          />
        </Form.Group>

        {/* Clue (Text Area) */}
        <Form.Group className="mb-3" controlId="initial_clue">
          <Form.Label>Clue</Form.Label>
          <Form.Control
            as="textarea"
            name="initial_clue"
            placeholder="Enter Clue"
            value={formData.initial_clue}
            onChange={handleChange}
            required
            rows={3} // Adjust the number of rows as needed
          />
        </Form.Group>

        {/* Display (DropDown) */}
        <Form.Group className="mb-3" controlId="homescreen_display">
          <Form.Label>Homescreen Display</Form.Label>
          <Form.Select
            name="homescreen_display"
            value={formData.homescreen_display}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Display
            </option>
            <option value="Display initial clue">Display initial clue</option>
            <option value="Display all locations">Display all locations</option>
          </Form.Select>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ProjectForm;
