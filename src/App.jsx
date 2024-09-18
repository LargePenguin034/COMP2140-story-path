import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import ProjectList from "./components/ProjectList";
import Project from "./components/Project";
import LocationList from "./components/LocationList";
import LocationEdit from "./components/LocationEdit";
import ProjectForm from "./components/ProjectEdit";
import { getProjects } from "./data/projects";

function App() {
  const navLinks = [{ path: "/projects", text: "PROJECTS" }];
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router>
      <div>
        <Header brandText="STORYPATH" navLinks={navLinks} />

        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/projects"
              element={<ProjectList projects={projects} />}
            />
            <Route
              path="/projects/:id"
              element={<Project projects={projects} />}
            />
            <Route
              path="/locations/:id"
              element={<LocationList projects={projects} />}
            />
            <Route
              path="/locationedit/:projectid/:id?"
              element={<LocationEdit />}
            />
            <Route
              path="/projectedit/:projectid?"
              element={<ProjectForm />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
