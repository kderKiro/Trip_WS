import '../../styles/explStiling.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Aos from 'aos'
import 'aos/dist/aos.css'
import CityAutocomplete from './cityAutoComplete'

export default function Explore() {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState(false);
  const [destination, setDestination] = useState('');
  const [resetForm, setResetForm] = useState(false);
  const [cityValid, setCityValid] = useState(false);

  const navigate = useNavigate();

  function onsubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const locationValue = formData.get('location');
    if (!cityValid) {
      alert('Please select a valid city from the list');
      return;
    }
    if (locationValue !== '') {
      setLocation(true);
    }
    setDate('');
    setPrice('');
    setResetForm(true);
    setTimeout(() => setResetForm(false), 0);
    navigate('/Flights', {
      state: {
        date: formData.get('depDate'),
        to: formData.get('destination'),
        budget: formData.get('budget')
      },
    });
  }

  const [price, setPrice] = useState('');

  const formatPrice = (value) => {
    const numbers = value.replace(/\D/g, '');

    const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return formatted ? formatted + '$' : '';
  };

  const handleChange = (e) => {
    const formatted = formatPrice(e.target.value);
    setPrice(formatted);
  };

  useEffect(() => {
    Aos.init({ duration: 1700 })
  }, [])

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className='explore-page'>
      <p data-aos='fade-up'>EXPLORE NOW</p>
      <h1 data-aos='fade-up'>Find Your Dream Destination</h1>
      <small data-aos='fade-up'>Fill in the fields below to find the best spot for your next tour</small>
      <form className='tr-form' onSubmit={onsubmit}>

        <label className='kra' data-aos='fade-up'>
          {location ? (<i class='bxr  bx-location-check'  ></i>)
            : (<i class='bxr  bx-location'  ></i>)}
          <CityAutocomplete value={destination} onChange={setDestination} onAppearChange reset={resetForm} onValidationChange={setCityValid} />
        </label>
        <label className='kra' data-aos='fade-up'>
          <i class='bxr  bx-calendar-minus'  ></i>
          <input
            className='kr'
            type='text'
            value={price}
            name='budget'
            onChange={handleChange}
            placeholder='budget'
            required
          />
        </label>
        <label className='kra' data-aos='fade-up'>
          <i class='bxr  bx-calendar-minus'  ></i>
          <input
            className='kr'
            type='date'
            name='depDate'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            placeholder='Date'
            required>
          </input>
        </label>
        <button data-aos='fade-left'><i class='bxr  bx-search'  ></i> Search</button>
      </form>
    </div>
  )
}
