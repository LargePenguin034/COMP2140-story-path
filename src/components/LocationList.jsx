import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getLocations,
  updateLocationOrder,
  deleteLocation,
  getProject,
} from "../data/projects";
import { QRCodeSVG } from "qrcode.react";

function LocationList() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleViewLocations = (projectId, locationId) => {
    navigate(`/locationedit/${projectId}/${locationId}`);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations(id);
        setLocations(data.sort((a, b) => a.location_order - b.location_order));
      } catch (error) {
        setError(error);
      }
    };

    const fetchProject = async () => {
      try {
        const data = await getProject(id);
        setProject(data[0]);
      } catch (error) {
        setError(error);
        setProject(null);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProject(), fetchLocations()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleMoveUp = async (index) => {
    if (index === 0) return;

    const newLocations = [...locations];
    const temp1 = { ...newLocations[index] };
    const temp2 = { ...newLocations[index - 1] };

    newLocations[index].location_order = temp2.location_order;
    newLocations[index - 1].location_order = temp1.location_order;

    setLocations(newLocations);

    await updateLocationOrder(temp1.id, temp2.location_order);
    await updateLocationOrder(temp2.id, temp1.location_order);
  };

  const handleMoveDown = async (index) => {
    if (index === locations.length - 1) return;

    const newLocations = [...locations];
    const temp1 = { ...newLocations[index] };
    const temp2 = { ...newLocations[index + 1] };

    newLocations[index].location_order = temp2.location_order;
    newLocations[index + 1].location_order = temp1.location_order;

    setLocations(newLocations);

    await updateLocationOrder(temp1.id, temp2.location_order);
    await updateLocationOrder(temp2.id, temp1.location_order);
  };

  const handleDelete = async (index) => {
    const locationId = locations[index].id;
    try {
      deleteLocation(locationId);

      // Filter out the deleted location
      const newLocations = locations.filter((_, i) => i !== index);

      // Update location_order to match new index positions
      const updatedLocations = newLocations.map((location, idx) => ({
        ...location,
        location_order: idx,
      }));

      setLocations(updatedLocations);

      // Optionally, update the location orders on the server
      await Promise.all(
        updatedLocations.map((location) =>
          updateLocationOrder(location.id, location.location_order)
        )
      );
    } catch (error) {
      setError(error);
    }
  };

  const handlePrintQRCode = (location) => {
    const printContent = document.getElementById(`qrcode-${location.id}`);
    const WindowPrt = window.open("", "", "width=600,height=600");
    WindowPrt.document.write(printContent.outerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  };

  const handlePrintAllQRCodes = () => {
    const printContent = document.getElementById("all-qrcodes");
    const WindowPrt = window.open("", "", "width=800,height=600");
    WindowPrt.document.write(printContent.outerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="container mb-3">
        <div className="row mb-3">
          <div className="col-9">
            <h1>{project.title}</h1>
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
        <div className="row">
          <div className="col-6 d-flex">
            <Link
              to={`/locationedit/${project.id}`}
              className="btn btn-primary"
            >
              Add Location
            </Link>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <button
              className="btn btn-success"
              onClick={() => handlePrintAllQRCodes()}
            >
              Print All QR Codes
            </button>
          </div>
        </div>
      </div>
      <div className="container">
        <ul className="list-group">
          {locations
            ?.sort((a, b) => a.location_order - b.location_order)
            .map((location, index) => (
              <li
                key={location.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="col-6">
                  <div className="fw-bold">{location.location_name}</div>
                </div>
                <div className="d-flex ms-auto align-self-start">
                  <div className="input-group">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <i className="bi bi-arrow-up"></i>
                    </button>

                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === locations.length - 1}
                    >
                      <i className="bi bi-arrow-down"></i>
                    </button>

                    <button
                      className="btn btn-outline-warning"
                      type="button"
                      onClick={() =>
                        handleViewLocations(project.id, location.id)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-outline-success"
                      type="button"
                      onClick={() => handlePrintQRCode(location)}
                    >
                      Print QR Code
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

export default LocationList;
