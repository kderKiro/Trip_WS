import '../F-Stiling/ClientOp.css'
import img1 from '../F-images/img1.jpg'
import star from '../F-images/star.png'
import Aos from 'aos'
import { useEffect } from 'react'

export default function ClientOp() {
  useEffect(() => {
    Aos.init({ duration: 1700 });
  }, [])

  function scrollToAboutUs() {
    const aboutUs = document.querySelector('.about-us');
    aboutUs.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div className="client-op">
      <div className="text-comp">
        <p data-aos='fade-up' >FROM OUR CLIENTS</p>
        <h1 data-aos='fade-up'>Real Travel History From Our Beloved Clients</h1>
        <small data-aos='fade-up'>At TravelWUs, we make travel planning effortless. From flights to stays and adventures, our platform connects you to the world’s best destinations with just a few clicks.</small>
        <div data-aos='fade-up-right' className="stars">
          <img src={star} alt='star' />
          <img src={star} alt='star' />
          <img src={star} alt='star' />
          <img src={star} alt='star' />
          <img src={star} alt='star' />
        </div>
        <div data-aos='fade-up' className="images">
          <img src="TouristPlace/persons/pers1.jpg" alt="pers" />
          <img src="TouristPlace/persons/pers2.jpg" alt="pers" />
          <img src="TouristPlace/persons/pers3.png" alt="pers" />
          <img src="TouristPlace/persons/pers4.png" alt="pers" />
        </div>
        <button data-aos='fade-up-left' onClick={scrollToAboutUs}>About Us <i id='flesh-btn' class='bxr  bx-arrow-right-stroke'  ></i> </button>
      </div>
      <img data-aos='fade-left' src={img1} />
    </div>
  )
}