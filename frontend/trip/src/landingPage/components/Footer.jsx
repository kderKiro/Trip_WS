import '../styles/Footer.css'
import titIcon from '../images/title-icon.svg'
export default function Footer() {

  function scrollToPage(page) {
    const home = document.querySelector('.main-page');
    const explorePage = document.querySelector('.explore-page');
    const clientOp = document.querySelector('.client-op');
    const feedbacks = document.querySelector('.feedback-section');

    switch (page) {
      case 'explore':
        if (explorePage) {
          const scrlTop = window.scrollY + explorePage.getBoundingClientRect().top;
          const offset = window.innerHeight * 0.18;

          window.scrollTo({
            top: scrlTop - offset,
            behavior: 'smooth'
          })
        }
        break;
      case 'home':
        if (home) {
          const scrlTop = window.scrollY + home.getBoundingClientRect().top;
          const offset = window.innerHeight * 0.18;

          window.scrollTo({
            top: scrlTop - offset,
            behavior: 'smooth'
          })
        }
        break;
      case 'client':
        if (clientOp) {
          const scrlTop = window.scrollY + clientOp.getBoundingClientRect().top;
          const offset = window.innerHeight * 0.3;

          window.scrollTo({
            top: scrlTop - offset,
            behavior: 'smooth'
          })
        }
        break;
      case 'feedback':
        if (feedbacks) {
          const scrlTop = window.scrollY + feedbacks.getBoundingClientRect().top;
          const offset = window.innerHeight * 0.18;
          window.scrollTo({
            top: scrlTop - offset,
            behavior: 'smooth'
          })
        }
        break;
    }

  };
  return (
    <footer id='myFooter'>
      <div className="footer">
        <div className="social-contact">
          <div className="slogo">
            <img src={titIcon}></img>
            <h1>TravelWUs</h1>
          </div>
          <div className="icons">
            <a href="https://t.me/kader_IRO" target="_blank"><i class='bx bxl-telegram'></i></a>
            <a href="https://instagram.com/alg_abdo2006" target="_blank"><i class='bx bxl-instagram'></i></a>
            <a href="https://discord.com/kader_59741" target="_blank"><i class='bx bxl-discord-alt'></i></a>
          </div>
        </div>
        <div className='information'>
          <h3>Information</h3>
          <div className="page-sections">
            <p onClick={() => scrollToPage('home')}>Home</p>
            <p onClick={() => scrollToPage('explore')}>Explore</p>
            <p onClick={() => scrollToPage('client')}>From Our Cliens</p>
            <p onClick={() => scrollToPage('feedback')}>Feedback</p>
          </div>
        </div>
        <div className="contact-details">
          <p>+213 799314679</p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=megdoud.abdelkader@ensia.edu.dz"
            target="_blank"
            rel="noreferrer"
          >
            megdoud.abdelkader@ensia.edu.dz
          </a>
        </div>
      </div>
      <p id='copyright'>TravelWUs | All Right Reserved</p>
    </footer>
  )
}