import '../F-Stiling/F-backs.css'
import { useState, useEffect } from 'react'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { addFeedback } from '../../../services/fb_service';

export default function Fbacks() {
  const [expandedItems, setExpandedItems] = useState([0]);
  const [feedback, setFeedback] = useState({ email: '', feedback: '' });
  const [sessionChecked, setSessionChecked] = useState(false);
  const [emailFromSession, setEmailFromSession] = useState(false);
  const [emailError, setEmailError] = useState('');

  function showDetails(index) {
    setExpandedItems((prev) => {
      return (prev.includes(index) ? [] : [index])
    })
  }

  useEffect(() => {
    Aos.init({ duration: 1000 });

    async function loadSessionEmail() {
      try {
        const resp = await fetch(
          'https://full-trip.onrender.com/Kad_Be/routes/login.php',
          { credentials: 'include' }
        );

        if (!resp.ok) {
          return;
        }

        const data = await resp.json();

        setFeedback(f => ({ ...f, email: data.email }));
        setEmailFromSession(true);
      } catch (err) {
        console.warn('Session check failed', err);
      } finally {
        setSessionChecked(true);
      }
    }

    loadSessionEmail();
  }, []);



  const feedbacks = [
    {
      summary: 'The booking process was fast and easy to navigate.',
      details: 'Iâ€™ve used several travel websites before, but this one stands out for its clean interface and speed. I was able to compare destinations, manage my budget, and confirm all reservations within minutes. The confirmation emails and reminders were timely and professional.'
    },
    {
      summary: 'Perfect for solo travelers looking for new adventures.',
      details: 'As someone who travels alone often, I appreciated how safe and structured everything felt. The app suggested unique spots off the beaten path, helped me connect with other travelers, and made sure all bookings were verified. I discovered more in five days than I did on my previous two trips combined.'
    },
    {
      summary: 'A truly reliable service for planning group trips!',
      details: 'We planned a university trip for eight people, and I expected chaos â€" but everything went perfectly. The platform handled multiple travelers, provided budget tracking, and even suggested places that fit everyoneâ€™s preferences. Customer support responded in under 10 minutes every time.'
    },
    {
      summary: 'Absolutely loved my trip to Santorini â€" everything was organized perfectly!',
      details: 'From the moment I booked through this platform, everything went smoothly. The hotel recommendations were spot-on, and the itinerary suggestions saved me hours of research. I even got a local guide who made the experience unforgettable. Definitely using this service again!'
    }
  ]

  async function handelSubmit(e) {
    e.preventDefault();
    const emailValue = (feedback.email || '').trim();
    if (!emailFromSession) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
      if (!emailOk) {
        setEmailError('Please enter a valid email address.');
        return;
      }
    }
    try {
      await addFeedback({ ...feedback, email: emailValue });
      setFeedback({ email: '', feedback: '' });
      setEmailError('');
      alert('Feedback submitted successfully!');
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
      console.error(error);
    }
    console.log(feedback.email);
  }

  return (
    <div className="feedback-section">
      <div className="some-feedbacks">
        <h1 data-aos='fade-up' >Some Of Our Client Feedbacks</h1>
        <ul>
          {feedbacks.map((feedback, index) => (
            <li data-aos='fade-up' key={index}>
              <p style={{
                borderRadius: expandedItems.includes(index) ? '15px 15px 0 0' : '15px'
              }}>
                {feedback.summary}
                <button id='btn' onClick={() => showDetails(index)}>
                  {expandedItems.includes(index) ?
                    <i id='app-arrow' className='bxr  bx-arrow-up-stroke-circle'  ></i>
                    : <i className='bxr  bx-arrow-down-circle'></i>}
                </button>
              </p>
              <small className={
                expandedItems.includes(index) ? 'expand' : 'minimize'
              }>{feedback.details}</small>
            </li>
          ))}
        </ul>
      </div>
      <div className="add-feedback">
        <h1 data-aos='fade-up'>Add Feedback Here:</h1>
        <p data-aos='fade-up'>Please fill the form below with your feedbacks.</p>
        <form onSubmit={handelSubmit}>
          {!emailFromSession && (
            <input
              type="email"
              data-aos="fade-up-left"
              value={feedback.email}
              onChange={(e) =>
                setFeedback(f => ({ ...f, email: e.target.value }))
              }
              placeholder="enter your email here"
              required
            />
          )}
          {!emailFromSession && emailError && (
            <small className="email-error" data-aos="fade-up-left">
              {emailError}
            </small>
          )}

          {sessionChecked && feedback.email && (
            <div className="logged-email" data-aos="fade-up-left">
              <label>
                Logged in as: <strong>{feedback.email}</strong>
              </label>
            </div>
          )}

          <textarea
            data-aos="fade-up-left"
            value={feedback.feedback}
            onChange={(e) =>
              setFeedback(f => ({ ...f, feedback: e.target.value }))
            }
            placeholder="Enter your feedback here"
            required
          />

          <button type="submit" data-aos="fade-up-left">
            Submit Feedback
          </button>

        </form>
      </div>
    </div >
  )
}
