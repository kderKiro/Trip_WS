import { useEffect } from 'react'
import '../styles/AboutUsStiling.css'
import second from '../images/second.png'
import third from '../images/third.png'
import trip from '../images/trip.png'
import Aos from 'aos'
import 'aos/dist/aos.css'

export default function AboutUs() {
  useEffect(() => {
    Aos.init({ duration: 1700 })
  }, [])

  return (
    <div className="about-us">
      <div className='header-about-us'>
        <h1 data-aos='fade-up-right'>Why Should You Choose Us</h1>
        <p data-aos='fade-up-right'>
          At TravelWUs, we bring years of expertise and passion for global exploration.
          Our mission is to deliver extraordinary travel experiences with care and precision.
        </p>
      </div>
      <div className='content-container'>
        <div>
          <div>
            <img data-aos='fade-up-right' src={second} alt='second' />
            <div data-aos='fade-up'>
              <h2>Safety and Support</h2>
              <p>
                Your peace of mind is our top priority — we ensure secure, reliable journeys worldwide.
                Our 24/7 customer support keeps you protected and informed wherever you go.
              </p>
            </div>
          </div>
          <div>
            <i data-aos='fade-up-right' id='trip-i' class='bxr bx-trip'></i>
            <div data-aos='fade-up'>
              <h2>Customized Experiences</h2>
              <p>
                Every trip with TravelWUs is crafted to reflect your preferences and passions.
                From luxury escapes to budget adventures, we tailor every detail to perfection.
              </p>
            </div>
          </div>

          <div>
            <div>
              <i data-aos='fade-up-right' id='trip-i2' class='bxr bx-message-question-mark'></i>
              <img data-aos='fade-up' src={third} alt='third' />
            </div>
            <div data-aos='fade-up'>
              <h2>Expert Guidance</h2>
              <p>
                Our travel specialists offer insider insights and handpicked recommendations.
                We guide you to the world’s most inspiring destinations with confidence and care.
              </p>
            </div>
          </div>
        </div>
        <img src={trip} alt='trip' />
      </div>
    </div>
  )
}
