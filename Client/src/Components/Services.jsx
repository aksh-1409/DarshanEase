// Services.js

import React from 'react';
import './navbar.css';

const Services = () => {
  return (
    <div className='services-container' id='services'>
      <h1 className='services-heading'>Services</h1>

      <div className='service'>
        <h2>Darshan Timings</h2>
        <p>
          Explore the divine experience with our regular darshan timings. Witness the spiritual
          aura and seek blessings from the divine deities.
        </p>
      </div>

      <div className='service'>
        <h2>Special Pooja Services</h2>
        <p>
          Elevate your spiritual journey with our special pooja services. Immerse yourself in the
          sacred rituals and receive blessings from the revered priests.
        </p>
      </div>

      <div className='service'>
        <h2>Online Ticket Booking</h2>
        <p>
          Conveniently book your darshan tickets online. Save time and ensure a seamless entry to
          the temple premises.
        </p>
      </div>

      {/* Add more services as needed */}

      <div className='service'>
        <h2>Customer Service</h2>
        <p>
          Tailor your spiritual experience with our custom services. Personalize your visit to meet
          your unique spiritual needs.
        </p>
      </div>
    </div>
  );
};

export default Services;
