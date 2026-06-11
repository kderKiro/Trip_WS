import React, { useEffect, useRef, useState } from "react";
import "./css/Slider.css";

function Slider({ images }) {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      slider.scrollTo({
        left: slider.clientWidth * nextIndex,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    sliderRef.current.scrollTo({
      left: sliderRef.current.clientWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <div className="slider-wrapper">
      <div className="slider" ref={sliderRef}>
        {images.map((img, index) => (
          <div className="slide" key={index}>
            <img src={img.src} alt={`slide-${index}`} className="slide-img" />
            <div className="slide-overlay">
              <h2>{index + 1}. {img.label}</h2>
            </div>
          </div>
        ))}
      </div>
      
      <div className="slider-nav">
        {images.map((_, index) => (
          <span
            key={index}
            className={`nav-btn ${index === activeIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Slider;
