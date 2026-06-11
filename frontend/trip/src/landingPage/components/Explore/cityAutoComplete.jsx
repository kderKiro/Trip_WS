import { useState, useEffect } from "react";
import '../../styles/explStiling.css';

export default function CityAutocomplete({ value, onChange, onAppearChange, reset, onValidationChange }) {
  const [query, setQuery] = useState(value || "");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (reset) {
      onChange('');
      setQuery("");
      setCities([]);
      setSelected(null);
      setError("");
    }
  }, [reset]);

  useEffect(() => {
    if (query.length < 2) {
      setCities([]);
      return;
    }

    const controller = new AbortController();

    async function fetchCities() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://full-trip.onrender.com/Kad_Be/index.php?endpoint=cities&q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setCities(data.data || []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
    return () => controller.abort();
  }, [query]);

  function selectCity(city) {
    setSelected(city);
    const cityName = city.name;
    setQuery(cityName);
    onChange(cityName);
    setCities([]);
    setError("");
    if (onValidationChange) {
      onValidationChange(true);
    }
    if (selected == null && onAppearChange) {
      onAppearChange(false);
    }
  }

  const handleInputBlur = () => {
    if (query.trim() && !selected) {
      setError("Please select a city from the list");
      if (onValidationChange) {
        onValidationChange(false);
      }
    }
  };

  return (
    <div>
      <input
        name="destination"
        type="text"
        placeholder="destination city"
        value={query}
        onChange={(e) => {
          const newValue = e.target.value;
          setQuery(newValue); 
          onChange(newValue); 
          setSelected(null);
          setError("");
        }}
        onBlur={handleInputBlur}
        style={{
          fontSize: '0.9rem',
          backgroundColor: 'transparent',
          border: error ? '2px solid red' : 'none',
          outline: 'none',
          width: 'clamp(120px, 25vw, 200px)',
          padding: "8px",
          transform: 'none',
          boxShadow: 'none'
        }}
      />

      {error && <div style={{ color: 'red', fontSize: '0.8rem' }}>{error}</div>}
      {loading && <div>Loading...</div>}

      {cities.length > 0 && (
        <ul className="autoCompleteList">
          {cities.map(city => (
            <li
              key={city.id}
              onClick={() => selectCity(city)}
              className="dest_input"
              style={{ boxShadow: 'none' }}
            >
              {city.name.split(",")[0].trim()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}