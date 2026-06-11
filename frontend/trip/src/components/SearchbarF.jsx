import './css/FlightSearch.css'; 
import React, { useState, useEffect } from 'react';

function Searcharea({ onSearch, isLoading = false, initialDate, initialDestination, initialBudget })
  
  {
  const [tripType, setTripType] = useState('roundTrip');
  const [from, setFrom] = useState('New York (JFK)');
  const [to, setTo] = useState('Los Angeles (LAX)');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1 Passenger');
  const [flightClass, setFlightClass] = useState('Economy');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

 useEffect(() => {
    // Only update state if the props actually have values
    if (initialDate) {
        setDepartureDate(initialDate);
    }
    if (initialDestination) {
        setTo(initialDestination);
    }
  }, [initialDate, initialDestination, initialBudget]);
  const validateForm = () => {
    const newErrors = {};

    if (!from.trim()) {
      newErrors.from = 'Departure location is required';
    }

    if (!to.trim()) {
      newErrors.to = 'Destination is required';
    }

    if (from.trim() && to.trim() && from.toLowerCase() === to.toLowerCase()) {
      newErrors.to = 'Destination must be different from departure';
    }

    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required';
    } else {
      const depDate = new Date(departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (depDate < today) {
        newErrors.departureDate = 'Departure date cannot be in the past';
      }
    }

    if (tripType === 'roundTrip') {
      if (!returnDate) {
        newErrors.returnDate = 'Return date is required for round trip';
      } else if (departureDate && returnDate) {
        const depDate = new Date(departureDate);
        const retDate = new Date(returnDate);
        
        if (retDate <= depDate) {
          newErrors.returnDate = 'Return date must be after departure date';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      from: true,
      to: true,
      departureDate: true,
      returnDate: tripType === 'roundTrip',
    });

    if (validateForm()) {
      const passengersNum = passengers === '5+ Passengers' ? 5 : parseInt(passengers, 10);
      onSearch?.({
        tripType,
        from,
        to,
        departureDate,
        returnDate: tripType === 'roundTrip' ? returnDate : '',
        passengers: passengersNum,
        flightClass
      });
    }
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="flight-search-container">
      <form className="flight-search-form" onSubmit={handleSubmit} noValidate>
        <div className="trip-type-buttons">
          <button 
            type="button"
            className={`trip-btn ${tripType === 'roundTrip' ? 'active' : ''}`}
            onClick={() => {
              setTripType('roundTrip');
              setErrors({});
            }}
          >
            Round Trip
          </button>
          <button 
            type="button"
            className={`trip-btn ${tripType === 'oneWay' ? 'active' : ''}`}
            onClick={() => {
              setTripType('oneWay');
              setReturnDate('');
              setErrors({});
            }}
          >
            One Way
          </button>
          <button 
            type="button"
            className={`trip-btn ${tripType === 'multiCity' ? 'active' : ''}`}
            onClick={() => {
              setTripType('multiCity');
              setErrors({});
            }}
          >
            Multi-City
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">From</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                className={`form-input ${touched.from && errors.from ? 'error' : ''}`}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onBlur={() => handleBlur('from')}
              />
            </div>
            {touched.from && errors.from && (
              <span className="error-message">{errors.from}</span>
            )}
          </div>

          <button type="button" className="swap-button" onClick={handleSwap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
            </svg>
          </button>

          <div className="form-group">
            <label className="form-label">To</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                className={`form-input ${touched.to && errors.to ? 'error' : ''}`}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onBlur={() => handleBlur('to')}
              />
            </div>
            {touched.to && errors.to && (
              <span className="error-message">{errors.to}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Departure</label>
            <div className="input-wrapper date-input">
              
              <input 
                type="date" 
                className={`form-input ${touched.departureDate && errors.departureDate ? 'error' : ''}`}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                onBlur={() => handleBlur('departureDate')}
              />
            </div>
            {touched.departureDate && errors.departureDate && (
              <span className="error-message">{errors.departureDate}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Return</label>
            <div className="input-wrapper date-input">
              
              <input 
                type="date" 
                className={`form-input ${touched.returnDate && errors.returnDate ? 'error' : ''}`}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                onBlur={() => handleBlur('returnDate')}
                disabled={tripType !== 'roundTrip'}
              />
            </div>
            {touched.returnDate && errors.returnDate && (
              <span className="error-message">{errors.returnDate}</span>
            )}
          </div>
        </div>

        <div className="form-row bottom-row">
          <div className="form-group">
            <label className="form-label">Passengers</label>
            <div className="input-wrapper">
              <select 
                className="form-select" 
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              >
                <option>1 Passenger</option>
                <option>2 Passengers</option>
                <option>3 Passengers</option>
                <option>4 Passengers</option>
                <option>5+ Passengers</option>
              </select>
              <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Class</label>
            <div className="input-wrapper">
              <select 
                className="form-select" 
                value={flightClass}
                onChange={(e) => setFlightClass(e.target.value)}
              >
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
              <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </div>

          <button type="submit" className="search-button" disabled={isLoading}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Searcharea;
