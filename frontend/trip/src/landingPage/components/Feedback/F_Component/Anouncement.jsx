import '../F-Stiling/Anouncement.css'
import trpImg from '../F-images/firstImg.png'
import React from 'react'
import Aos from 'aos'
import 'aos/dist/aos.css'
import Typed from 'typed.js'

export default function Anouncement() {
  React.useEffect(() => {
    Aos.init({ duration: 1700 })
  }, [])

  React.useEffect(() => {
    const typed = new Typed('.typed', {
      strings: ['Best Way To Start Your Journey', 'Welcome to our travel platform', 'Discover amazing destinations', 'Book your dream vacation'],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true
    });
    return () => typed.destroy();
  }, [])

  const scrollToTripForm = () => {
    const explorePage = document.querySelector('.explore-page');
    const locationInput = document.getElementById('LocInp');

    const absPosition = window.scrollY + explorePage.getBoundingClientRect().top;
    const scrlTop = window.innerHeight * 0.18;

    if (explorePage) {
      window.scrollTo({
        top: absPosition - scrlTop,
        behavior: 'smooth'
      });
    }

    setTimeout(() => locationInput.focus(), 1000);

  }
  return (
    <div className="ann-section">
      <img src={trpImg} />
      <div className="txt-content">
        <h1 data-aos='fade-up'><span className="typed"></span></h1>
        <p data-aos='fade-up'>We offer personalized itineraries tailored to individual preferences and interests</p>
        <button data-aos='fade-up-left' onClick={scrollToTripForm}>Start Here</button>
      </div>
    </div>
  )
}