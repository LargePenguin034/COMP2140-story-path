import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import RecipeList from './components/RecipeList';
import Recipe from './components/Recipe';
import { recipes } from './data/recipes';

function App() {
  const navLinks = [
    { path: '/projects', text: 'PROJECTS' }
  ];

  return (
    <Router>
      <div>
        <Header brandText="STORYPATH" navLinks={navLinks} />

        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<RecipeList recipes={recipes} />} />
            <Route path="/projects/:id" element={<Recipe recipes={recipes} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
