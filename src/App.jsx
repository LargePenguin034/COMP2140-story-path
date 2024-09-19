import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import ProjectList from "./components/ProjectList";
import Project from "./components/Project";
import LocationList from "./components/LocationList";
import LocationEdit from "./components/LocationEdit";
import ProjectForm from "./components/ProjectEdit";


function App() {
  const navLinks = [{ path: "/projects", text: "PROJECTS" }];


  return (
    <Router>
      <div>
        <Header brandText="STORYPATH" navLinks={navLinks} />

        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/projects"
              element={<ProjectList/>}
            />
            <Route
              path="/projects/:id"
              element={<Project/>}
            />
            <Route
              path="/locations/:id"
              element={<LocationList />}
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
