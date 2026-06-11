import React, { useState, useRef } from "react";
import NavBar from "../components/NavBar";
import Slider from "../components/Slider";
import AttractionForm from "../components/AttractionForm";
import AttractionCard from "../components/AttractionCard";
import Footer from "../../landingPage/components/Footer";
import "./css/Attraction.css";

import top1 from "../img/Attractions/top1.webp";
// ... Other imports if needed

const sliderImages = [
  { src: top1, label: "The forbidden City - China" },
  // ... Add other images here if you have them
];

function Attractions() {
  const formRef = useRef(null);

  const [attractionsList, setAttractionsList] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ✅ NEW: Sort State
  const [sortType, setSortType] = useState("");

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = async (searchData) => {
    setLoading(true);
    try {
      const response = await fetch("https://full-trip.onrender.com/Mohammed/Attractions/search_attractions.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAttractionsList(data);
      setHasSearched(true);
      setSortType(""); // Reset sort on new search
      
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error connecting to server. Make sure the PHP terminal is open.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Sorting Logic
  const handleSortChange = (e) => {
    const type = e.target.value;
    setSortType(type);

    const sortedList = [...attractionsList];

    if (type === "price_asc") {
        sortedList.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (type === "price_desc") {
        sortedList.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (type === "rating_desc") {
        sortedList.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (type === "name_asc") {
        sortedList.sort((a, b) => a.name.localeCompare(b.name));
    }

    setAttractionsList(sortedList);
  };

  // ✅ NEW: Styles for Sort Bar (Same as CarRental)
  const sortContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    marginBottom: "10px",
    position: "relative",
    zIndex: 10
  };

  const sortWrapperStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "10px 25px",
    background: "rgba(255, 255, 255, 0.9)", 
    border: "2px solid #ff7e5f", 
    borderRadius: "50px", 
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
  };

  const selectStyle = {
    padding: "8px 10px",
    borderRadius: "20px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    appearance: "none", 
    textAlign: "center"
  };

  return (
    <div className="attractions-main-container">
      
      <h1 className="attractions-scroll-h1" onClick={scrollToForm}>
        <span className="carrental-h1-icon" style={{marginRight: "10px"}}>
          {/* Reusing existing SVG or Icon if available, or just text */}
          🌍
        </span>
        Explore Attractions
      </h1>
      
      <Slider images={sliderImages} />

      <div className="attractions-form-wrapper" ref={formRef}>
        <AttractionForm onSearch={handleSearch} />
      </div>
    
      {/* ✅ NEW: Sort Bar Section */}
      <div style={sortContainerStyle}>
          <div 
            className="sort-bar-hover-effect"
            style={sortWrapperStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 126, 95, 0.4)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
            }}
          >
            <label htmlFor="sortAttractions" style={{ color: "#ff7e5f", fontSize: "1.1rem", fontWeight: "bold" }}>
                Sort Results:
            </label>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select 
                    id="sortAttractions"
                    value={sortType}
                    onChange={handleSortChange}
                    style={selectStyle}
                >
                    <option value="" style={{color: "black"}}>Recommended</option>
                    <option value="price_asc" style={{color: "black"}}>Price: Low to High</option>
                    <option value="price_desc" style={{color: "black"}}>Price: High to Low</option>
                    <option value="rating_desc" style={{color: "black"}}>Top Rated</option>
                    <option value="name_asc" style={{color: "black"}}>Name: A - Z</option>
                </select>
                {/* Arrow */}
                <span style={{ color: "#ff7e5f", marginLeft: "5px", pointerEvents: "none" }}>▼</span>
            </div>
          </div>
      </div>

      <div className="attractions-cards-container">
        {loading ? (
            <h2 style={{color: 'white', textAlign: 'center'}}>Loading...</h2>
        ) : attractionsList.length > 0 ? (
          attractionsList.map((item) => (
            <AttractionCard
              key={item.attrac_id}
              id={item.attrac_id}
              image={item.attrac_img_url} 
              name={item.name}
              type={item.category}
              entryFee={item.price}
              rating={item.rating}
              location={item.location}
            />
          ))
        ) : (
          <div style={{ color: "white", textAlign: "center", width: "100%", padding: "20px" }}>
            {hasSearched ? (
              <h2>No attractions found matching your search.</h2>
            ) : (
              <h2>Please use the search box above.</h2>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Attractions;