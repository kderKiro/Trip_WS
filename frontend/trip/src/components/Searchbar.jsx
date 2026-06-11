import './css/Searcharea.css';
import React, { useState } from 'react';

function Searcharea({ onSearch }) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    place: "",
    checkin: today,
    checkout: today,
    adults: "",
    children: "",
    pets: "",
    budget: ""
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function validate() {
    let newErrors = {};

    if (!form.place.trim() && !form.budget) {
      newErrors.place = "Please enter a destination or a budget.";
    }

    if (form.checkout < form.checkin) {
      newErrors.checkout = "Check-out must be after check-in.";
    }

    if (form.budget && Number(form.budget) < 0) {
        newErrors.budget = "Budget cannot be negative";
    }

    return newErrors;
  }

  function handleSubmit() {
    const v = validate();
    setErrors(v);

    if (Object.keys(v).length === 0) {
      if (onSearch) {
        onSearch(form);
      }
    }
  }

  return (
    <div className='inforamtions'>
      <div className="input-group">
        <input 
          type="text" 
          id="place" 
          placeholder="City Or Hotel name"
          value={form.place}
          onChange={handleChange}
        />
        {errors.place && <p className="error-text" style={{color:'red', fontSize:'0.8rem'}}>{errors.place}</p>}
      </div>

      <div className="date-group">
        <input type="date" id="checkin" value={form.checkin} onChange={handleChange} />
        <input type="date" id="checkout" value={form.checkout} onChange={handleChange} />
      </div>
      {errors.checkout && <p className="error-text" style={{color:'red', fontSize:'0.8rem'}}>{errors.checkout}</p>}

      <div className="persons">
        <input type="number" id="adults" placeholder="Adults" value={form.adults} onChange={handleChange} min="1" />
        <input type="number" id="children" placeholder="Children" value={form.children} onChange={handleChange} min="0" />
        <input type="number" id="pets" placeholder="Pets" value={form.pets} onChange={handleChange} min="0" />
      </div>

      <div className="input-group">
        <input 
          type="number" 
          id="budget" 
          placeholder="Max Price ($)"
          value={form.budget}
          onChange={handleChange}
        />
        {errors.budget && <p className="error-text" style={{color:'red', fontSize:'0.8rem'}}>{errors.budget}</p>}
      </div>

      <button id="Search" className="search-button" onClick={handleSubmit}>
        Search Hotels
      </button>
    </div>
  );
}

export default Searcharea;