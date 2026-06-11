
import { faPlane, faMapPin, faUtensils, faCamera, faBed, faStar, faUser, faClock } from "@fortawesome/free-solid-svg-icons"
import Paris from './Images/Paris.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './Styles/Tours.css'


const Tour_info1 = {

    name: "Paris: City of Lights",
    rating: 4.9,
    RateCount: 234,
    Agency: "MMA Travel",
    location: "Paris, France",

    //!ADD This:
    TotalTickets:10,
    TicketsBought:8,
    
    imageUrl: Paris,
    Includes: [{
        name: "Flight",
        icon: faPlane
    }, {
        name: "Hotel",
        icon: faBed
    }, {
        name: "Meals",
        icon: faUtensils
    }, {
        name: "Tours",
        icon: faCamera
    }],

    Highlights: ["Eiffel Tower", "Seine River cruise with dinner", "Day Trip to Versailles Palace", "Louis Museuem Tour"],

    TourDuration: "7 Days / 6 nights",
    DepartureDate: "Dec 15 2025",

    price: 2999,
    N_Tickets: 2,


    Status: "Active",

}

function TourCard({ Tour }) {


    return (<>

        <div className="Section" style={{ backgroundColor: "white" }}>

            <div className="Hotel">

                <img src={Tour.imageUrl}></img>
                <div className="HotelDetails">

                    <div className="CardHeader">
                        <h3>{Tour.name}</h3>
                        <div className="TourRating">
                            <FontAwesomeIcon icon={faStar} className="Icon"></FontAwesomeIcon>
                            <p style={{ display: "inline" }}> {Tour.rating} ({Tour.RateCount})</p>
                        </div>
                    </div>

                    <div style={{display:"flex",gap:"15px"}}>
                        <div className="Location">
                            <FontAwesomeIcon icon={faMapPin}></FontAwesomeIcon>
                            <p>{Tour.location}</p>
                        </div>
                        <div className="TourDuration">
                            <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>
                            <p>{Tour.TourDuration}</p>
                        </div>
                    </div>

                    <h4>Includes:</h4>
                    <div className="Amenities">
                        {Tour.Includes.map((amenitie, index) => (

                            <div className="Amenitie" key={index}>
                                <FontAwesomeIcon icon={amenitie.icon}></FontAwesomeIcon>
                                <p>{amenitie.name}</p>
                            </div>
                        ))}
                    </div>
                    <h4>Highlights:</h4>
                    <div className="Highlights">
                        {Tour.Highlights.map((item, index) => (
                            <div className="Highlight" key={index}>

                                <FontAwesomeIcon icon={faCamera} className="Icon"></FontAwesomeIcon>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>

                    <p className="Price"><span>{Tour.price}$</span> / Person</p>
                    <p className="Price">Total: <span>{Tour.price * Tour.N_Tickets}$
                    </span></p>

                    <div className="Res_info">
                        <div className="NightsRes">

                            <h4>Tickets:</h4>
                            <p><FontAwesomeIcon icon={faUser}></FontAwesomeIcon>        {Tour.N_Tickets}</p>
                        </div>
                        <div className="HStatus">
                            <h4> Status: </h4>
                            <div className={Tour.Status}>{Tour.Status}</div>
                        </div>
                        <div className="DateIn">
                            <h4> Departure Date: </h4>
                            <p>{Tour.DepartureDate}</p>
                        </div>
                    </div>

                </div>

            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="SecondaryB RemoveCard">Cancel Reservation</button>
            </div>


        </div>

    </>)




}





function Tours() {
    return (<>

        <div className="S_Container Section">
            <div className="SecHeader" >
                <h1>My Tours</h1>
                <p>Manage your Tour Tickets</p>
            </div>
            <TourCard Tour={Tour_info1}/>
            <TourCard Tour={Tour_info1}/>

        </div>


    </>)
}
export default Tours