import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './main.css';

const CardPage = () => {
  return (
    <div className="card-container">
      <Link to="/card/1" className="card">
        <h2>Card 1</h2>
        <p>This is the first card.</p>
      </Link>
      <Link to="/map" className="card">
        <h2>Card 2</h2>
        <p>This is the second card.</p>
      </Link>
      <Link to="/home" className="card">
        <h2>image uploader</h2>
        <p>upload your images.</p>
      </Link>
    </div>
  );
}

export default CardPage;
