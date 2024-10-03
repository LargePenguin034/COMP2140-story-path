import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getLocations,
  updateLocationOrder,
  deleteLocation,
  getProject,
} from "../data/projects";
import jsPDF from "jspdf";
import QRCode from "qrcode";

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

  const handleDownloadQRCodes = async (location) => {
    const doc = new jsPDF();
    try {
      // Generate QR code image as data URLS
      const qrCodeImageUrl = await QRCode.toDataURL(
        `http://localhost:5173/projects/${project.id}/${location.id}`,
        {
          width: 150, // Width of the QR code
          margin: 1, // Margin around the QR code
        }
      );

      // Get the dimensions of the PDF
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      // Calculate position to center the QR code
      const x = (pdfWidth - 150) / 2; // Centering horizontally
      const y = (pdfHeight - 150) / 2; // Centering vertically

      // Add QR code image to the PDF
      doc.addImage(qrCodeImageUrl, "PNG", x, y, 150, 150);

      // Add additional text below the QR code
      doc.text(`${location.location_name}`, pdfWidth / 2, y + 160, {
        align: "center",
      });

      // Save the PDF
      doc.save(`${project.title}-${location.location_name}.pdf`);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleDownloadAllQRCodes = async () => {
    const doc = new jsPDF();
    try {
      // Get the dimensions of the PDF
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      // Calculate position to center the QR code
      const x = (pdfWidth - 150) / 2; // Centering horizontally
      const y = (pdfHeight - 150) / 2; // Centering vertically

      for (const location in locations) {
        console.log(locations[location]);

        const qrCodeImageUrl = await QRCode.toDataURL(
          `http://localhost:5173/projects/${project.id}/${location.id}`,
          {
            width: 150, // Width of the QR code
            margin: 1, // Margin around the QR code
          }
        );
        // Add QR code image to the PDF
        doc.addImage(qrCodeImageUrl, "PNG", x, y, 150, 150);

        // Add additional text below the QR code
        doc.text(`${locations[location].location_name}`, pdfWidth / 2, y + 160, {
          align: "center",
        });

        // Add a new page if not the last location
        if (location < locations.length - 1) {
          doc.addPage();
        }
      }

      // Save the PDF
      doc.save(`${project.title}-All.pdf`);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
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
              onClick={() => handleDownloadAllQRCodes()}
            >
              Download All QR Codes
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
                      onClick={() => handleDownloadQRCodes(location)}
                    >
                      Download QR Code
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
