import React, { useState } from 'react';
import './css/CarRentalForm.css';

const CarRentalForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
    carType: '',
    driverAge: '',
    insuranceNeeded: 'No'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'pickupLocation':
        if (!formData.pickupLocation.trim()) {
          newErrors.pickupLocation = 'Pickup location is required';
        } else {
          delete newErrors.pickupLocation;
        }
        break;

      case 'dropoffLocation':
        if (!formData.dropoffLocation.trim()) {
          newErrors.dropoffLocation = 'Drop-off location is required';
        } else {
          delete newErrors.dropoffLocation;
        }
        break;

      case 'pickupDate':
        if (!formData.pickupDate) {
          newErrors.pickupDate = 'Pickup date is required';
        } else {
          const pickupDate = new Date(formData.pickupDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (pickupDate < today) {
            newErrors.pickupDate = 'Pickup date cannot be in the past';
          } else {
            delete newErrors.pickupDate;
          }
        }
        break;

      case 'dropoffDate':
        if (!formData.dropoffDate) {
          newErrors.dropoffDate = 'Drop-off date is required';
        } else if (formData.pickupDate && formData.dropoffDate) {
          const pickup = new Date(formData.pickupDate);
          const dropoff = new Date(formData.dropoffDate);
          
          if (dropoff <= pickup) {
            newErrors.dropoffDate = 'Drop-off date must be after pickup date';
          } else {
            delete newErrors.dropoffDate;
          }
        } else {
          delete newErrors.dropoffDate;
        }
        break;

      case 'carType':
        if (!formData.carType) {
          newErrors.carType = 'Please select a car type';
        } else {
          delete newErrors.carType;
        }
        break;

      case 'driverAge':
        if (!formData.driverAge) {
          newErrors.driverAge = 'Driver age is required';
        } else if (formData.driverAge < 18) {
          newErrors.driverAge = 'Driver must be at least 18 years old';
        } else if (formData.driverAge > 100) {
          newErrors.driverAge = 'Please enter a valid age';
        } else {
          delete newErrors.driverAge;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const fields = ['pickupLocation', 'dropoffLocation', 'pickupDate', 'dropoffDate', 'carType', 'driverAge'];
    fields.forEach(field => validateField(field));
    
    const allErrors = {};
    
    if (!formData.pickupLocation.trim()) allErrors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation.trim()) allErrors.dropoffLocation = 'Drop-off location is required';
    if (!formData.pickupDate) allErrors.pickupDate = 'Pickup date is required';
    if (!formData.dropoffDate) allErrors.dropoffDate = 'Drop-off date is required';
    if (!formData.carType) allErrors.carType = 'Please select a car type';
    if (!formData.driverAge) allErrors.driverAge = 'Driver age is required';

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setTouched({
      pickupLocation: true,
      dropoffLocation: true,
      pickupDate: true,
      dropoffDate: true,
      carType: true,
      driverAge: true,
      insuranceNeeded: true
    });

    if (validateForm()) {
      alert('Car rental form submitted successfully!');
      console.log('Form Data:', formData);
    }
  };

  return (
    <div className="car-rental-container">
      <form className="car-rental-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Car Rental Booking</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Pickup Location</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <input 
                type="text"
                name="pickupLocation"
                className={`form-input ${touched.pickupLocation && errors.pickupLocation ? 'error' : ''}`}
                placeholder="Enter pickup location"
                value={formData.pickupLocation}
                onChange={handleChange}
                onBlur={() => handleBlur('pickupLocation')}
              />
            </div>
            {touched.pickupLocation && errors.pickupLocation && (
              <span className="error-message">{errors.pickupLocation}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Drop-off Location</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <input 
                type="text"
                name="dropoffLocation"
                className={`form-input ${touched.dropoffLocation && errors.dropoffLocation ? 'error' : ''}`}
                placeholder="Enter drop-off location"
                value={formData.dropoffLocation}
                onChange={handleChange}
                onBlur={() => handleBlur('dropoffLocation')}
              />
            </div>
            {touched.dropoffLocation && errors.dropoffLocation && (
              <span className="error-message">{errors.dropoffLocation}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Pickup Date & Time</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2z"/>
              </svg>
              <input 
                type="datetime-local"
                name="pickupDate"
                className={`form-input ${touched.pickupDate && errors.pickupDate ? 'error' : ''}`}
                value={formData.pickupDate}
                onChange={handleChange}
                onBlur={() => handleBlur('pickupDate')}
              />
            </div>
            {touched.pickupDate && errors.pickupDate && (
              <span className="error-message">{errors.pickupDate}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Drop-off Date & Time</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2z"/>
              </svg>
              <input 
                type="datetime-local"
                name="dropoffDate"
                className={`form-input ${touched.dropoffDate && errors.dropoffDate ? 'error' : ''}`}
                value={formData.dropoffDate}
                onChange={handleChange}
                onBlur={() => handleBlur('dropoffDate')}
              />
            </div>
            {touched.dropoffDate && errors.dropoffDate && (
              <span className="error-message">{errors.dropoffDate}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Car Type</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
              <select 
                name="carType"
                className={`form-select ${touched.carType && errors.carType ? 'error' : ''}`}
                value={formData.carType}
                onChange={handleChange}
                onBlur={() => handleBlur('carType')}
              >
                <option value="">Select car type</option>
                <option value="economy">Economy</option>
                <option value="compact">Compact</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="van">Van</option>
              </select>
              <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
            {touched.carType && errors.carType && (
              <span className="error-message">{errors.carType}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Driver Age</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input 
                type="number"
                name="driverAge"
                className={`form-input ${touched.driverAge && errors.driverAge ? 'error' : ''}`}
                placeholder="Enter your age"
                min="18"
                max="100"
                value={formData.driverAge}
                onChange={handleChange}
                onBlur={() => handleBlur('driverAge')}
              />
            </div>
            {touched.driverAge && errors.driverAge && (
              <span className="error-message">{errors.driverAge}</span>
            )}
          </div>
        </div>

        <div className="form-row single-row">
          <div className="form-group">
            <label className="form-label">Insurance Coverage</label>
            <div className="insurance-options">
              <label className="radio-label">
                <input 
                  type="radio"
                  name="insuranceNeeded"
                  value="Yes"
                  checked={formData.insuranceNeeded === 'Yes'}
                  onChange={handleChange}
                />
                <span>Yes, add insurance</span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio"
                  name="insuranceNeeded"
                  value="No"
                  checked={formData.insuranceNeeded === 'No'}
                  onChange={handleChange}
                />
                <span>No, I'll skip insurance</span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          <svg className="button-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          Book Car Now
        </button>
      </form>
    </div>
  );
};

export default CarRentalForm;