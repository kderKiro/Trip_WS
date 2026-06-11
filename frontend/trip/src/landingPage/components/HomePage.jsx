import '../styles/homeStyle.css'
import { useEffect, useState } from 'react';
import Aos from 'aos'
import 'aos/dist/aos.css'

export default function Home() {
  let [images, setImages] = useState(['TouristPlace/tourist-Place1.jpg', 'TouristPlace/tourist-Place2.jpg', 'TouristPlace/tourist-Place3.jpg', 'TouristPlace/tourist-Place4.jpg'])
  let image = images.map((img) => (
    <img data-aos='fade-up' src={img} key={img} />
  ))
  function scrollToTripForm() {
    const explorePage = document.querySelector('.explore-page');
    const locationInput = document.getElementById('LocInp');

    const scrlTop = window.scrollY + explorePage.getBoundingClientRect().top;
    const offset = window.innerHeight * 0.18;

    if (explorePage) {
      window.scrollTo({
        top: scrlTop - offset,
        behavior: 'smooth'
      })
      setTimeout(() => {
        locationInput.focus()
      }, 1000);
    }
  };

  useEffect(() => {
    Aos.init({ duration: 1700 })
  }, [])
  return (
    <>
      <div className='main-page'>
        <p data-aos='fade-down'>Unlock Your Travel Dreams With Us!</p>
        <p data-aos='fade-left'>Discover the world most adventurus places ,life is so short for a trip.</p>
        <button data-aos='zoom-in' onClick={scrollToTripForm}>GET STARTED <i class='bxr  bx-arrow-right'  ></i> </button>
        <div className='popular-places-tit'>
          <span data-aos='fade-right'>Popular places</span><hr data-aos='fade-right' />
        </div>
        <div className='images'>
          {image}
        </div>
      </div>
      <div className="review-div">
        <ul className="review">
          <li data-aos='zoom-in'>
            <h1 data-aos='fade-right'>10<small data-aos='fade-left'>World Of Experiences</small></h1>

          </li>
          <li data-aos='zoom-in'>
            <h1 data-aos='fade-right'>4K+<small data-aos='fade-left'>Fine Destination</small></h1>

          </li>
          <li data-aos='zoom-in'>
            <h1 data-aos='fade-right'>10K+<small data-aos='fade-left'>Customer Reviews</small></h1>

          </li>
          <li data-aos='zoom-in'>
            <h1 data-aos='fade-right'>5.6
              <small data-aos='fade-left'>Overall Rating</small>
            </h1>

          </li>
        </ul>
      </div>
    </>
  )
}