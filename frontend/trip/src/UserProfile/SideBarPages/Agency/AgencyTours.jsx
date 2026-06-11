import { faN, faCompass, faPlus, faSave, faD, faPen, faClock, faDollar, faUpload, faCamera, faPlane, faPlaneUp, faC, faBed, faUtensils, faCalendar, faUser, faEllipsisV, faCaretDown, faEye, faTrashCan, faUsers, faX, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Routes, Route, Navigate, Form, data } from "react-router-dom";


import './styles/AgencyTours.css'
import { faMap } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";

import { createPortal } from 'react-dom';

import api from "../../API/PHP_API";




const today = new Date().toISOString().split("T")[0];







function AddTour() {

    //Form Vlidations:
    const tourNameIn = useRef();
    const destinationIn = useRef();
    const descriptionIn = useRef();
    const durationIn = useRef();
    const amountIn = useRef();

    //Iclusions:
    const [SelectedOptions, setSelectedOptions] = useState([]);

    function handleCheckBoxChange(e) {

        const value = e.target.value;
        const checked = e.target.checked;




        if (checked) {

            setSelectedOptions([...SelectedOptions, value]);
        }
        else {

            setSelectedOptions(SelectedOptions.filter((item) => item !== value));
        }


    }




    const [formData, setFormData] = useState({

        tourName: "",
        destination: "",
        description: "",
        duration: "",
        amount: ""

    })
    const [errors, setErrors] = useState({});
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));//resets errors

        e.target.classList.remove("InvalidIn");
    }
    function validate(values) {
        const newErrors = {};

        // Tour name
        if (!values.tourName.trim()) {
            newErrors.tourName = "Tour name is required.";
            tourNameIn.current.classList.add("InvalidIn");
        } else if (values.tourName.trim().length < 3) {
            newErrors.tourName = "Tour name must be at least 3 characters.";
            tourNameIn.current.classList.add("InvalidIn");

        }

        // Destination
        if (!values.destination.trim()) {
            newErrors.destination = "Destination is required.";
            destinationIn.current.classList.add("InvalidIn");

        }

        // Description
        if (!values.description.trim()) {
            newErrors.description = "Description is required.";
            descriptionIn.current.classList.add("InvalidIn");

        } else if (values.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters.";
            descriptionIn.current.classList.add("InvalidIn");

        }

        // Duration
        if (!values.duration.toString().trim()) {
            newErrors.duration = "Duration is required.";
            durationIn.current.classList.add("InvalidIn");
        }
        //Pricing
        if (!values.amount.toString().trim()) {
            newErrors.amount = "Amount is required";
            amountIn.current.classList.add("InvalidIn");
        }
        // Departure Dates
        if (DDates.length === 0) {
            newErrors.date = "At least one departure date is required.";
        }

        return newErrors;
    }



    async function HandleSubmit(e) {

        e.preventDefault();

        const validationErrors = validate(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        const data = {
            ...formData,
            Departure_Dates: DDates,
            Highlights: Highlights,
            Inclusions: SelectedOptions
        };



        try {

            const response = await api.post('/Add_Tours.php', data)

            console.log("Data Sent Succefully:", response.data);

            if (response.data === "Transaction Completed") {

                alert("Tour Published");
            };
        }

        catch (error) {

            console.log("Data Not Sent:", error);
        }


    }
    function handleReset() {
        setFormData(
            {
                tourName: "",
                destination: "",
                description: "",
                duration: "",
                amount: ""
            }
        )
        tourNameIn.current.classList.remove("InvalidIn");
        destinationIn.current.classList.remove("InvalidIn");
        descriptionIn.current.classList.remove("InvalidIn");
        durationIn.current.classList.remove("InvalidIn");
        amountIn.current.classList.remove("InvalidIn");
        setErrors({});

        setDDates([]);


    }



    const [HighlightsCount, SetHighlightsCount] = useState(1);
    const [HighlightsIDCount, SetHighlightsIDCount] = useState(1);
    const [Highlights, SetHighlights] = useState([{ id: 0, Highlight_Detail: "" }]);

    //Dates Management:
    const [DDates, setDDates] = useState([]);
    const [IdCount, setIdCount] = useState(0);

    const [DateValid, SetDateValid] = useState(true);
    const [SpotsValid, SetSpotsValid] = useState(true);

    const Dateinput = useRef();
    const Spotsinput = useRef();
    function AddDepartureDate(e) {
        e.preventDefault();
        const date = Dateinput.current.value.trim();
        const spots = Spotsinput.current.value.trim();
        var Valid = true;
        if (date === "") {

            SetDateValid(false);
            Valid = false;

        }
        else {
            SetDateValid(true);
        }
        if (spots === "") {
            SetSpotsValid(false);
            Valid = false;
        }
        else {
            SetSpotsValid(true);

        }
        if (Valid) {
            setDDates(prev => [...prev, { Date: date, Spots: spots, id: IdCount, SpotsTaken: 0 }]);
            setIdCount(IdCount + 1);
        }
    }
    function DeleteDate(id) {

        setDDates(prev => prev.filter(Date => Date.id !== id));
    }
    //--------------------------------------------

    function AddHighlight(e) {
        e.preventDefault();

        SetHighlightsCount(HighlightsCount + 1);
        SetHighlights(prev => [...prev, { id: HighlightsIDCount, Highlight_Detail: "" }]);
        SetHighlightsIDCount(HighlightsIDCount + 1);

    }
    function RemoveHighlight(idToRemove) {

        SetHighlights(prev => prev.filter((i) => i.id !== idToRemove));
        SetHighlightsCount(HighlightsCount - 1);

    }
    function HandleHighlightChange(id, event) {
        const text = event.target.value;

        SetHighlights(prev =>
            prev.map(hgh =>
                hgh.id === id ? { ...hgh, Highlight_Detail: text } : hgh
            )
        );

    }



    return (<>
        <div className="Section">
            <form action onSubmit={HandleSubmit} onReset={handleReset} className="FlexV">


                <div className="SecHeader FlexH_spaceBetween">
                    <div>
                        <h3>Publish New Tour Package</h3>
                        <p>Create and publish a new tour package for your travel agency</p>
                    </div>
                    <input type="reset" className="SecondaryB"></input>
                    <input type="submit" className="PrimaryB" value="Publish"></input    >
                </div>
                <div className="parent">
                    <div className="div1 Section">
                        <div className="SecHeader">

                            <h3> Tour Inforamtion:</h3>
                        </div>
                        <div className="TourInfoForm FlexV">
                            <div className="InputContainer">
                                <label>Tour Name:</label>
                                <div>
                                    <label className="CostumeLabel inputIcon"><FontAwesomeIcon icon={faN}></FontAwesomeIcon></label>
                                    <input ref={tourNameIn} onChange={handleChange} name="tourName" value={formData.tourName} className="CostumeInput" placeholder="e.g., Paris Romance"></input>
                                    {errors && <small className="error">{errors.tourName}</small>}
                                </div>
                            </div>
                            <div className="InputContainer">
                                <label>Destination:</label>
                                <div>
                                    <label className="CostumeLabel inputIcon"><FontAwesomeIcon icon={faMap}></FontAwesomeIcon></label>
                                    <input ref={destinationIn} onChange={handleChange} name="destination" value={formData.destination} className="CostumeInput" placeholder="e.g., Paris France"></input>
                                    {errors.destination && <small className="error">{errors.destination}</small>}
                                </div>
                            </div>
                            <div className="InputContainer">
                                <label>Description:</label>
                                <div>
                                    <label className="CostumeLabel inputIcon"><FontAwesomeIcon icon={faPen}></FontAwesomeIcon></label>
                                    <textarea ref={descriptionIn} onChange={handleChange} name="description" value={formData.description} className="CostumeInput" placeholder="Describe Your Package"></textarea>
                                    {errors.description && <small className="error">{errors.description}</small>}
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="div2 Section">
                        <div className="SecHeader">
                            <h3> Pricing And Duration:</h3>
                        </div>
                        <div className="InputContainer">

                            {/* Duration ----------------------- */}
                            <label> Duration (Days) :</label>
                            <div>
                                <label className="CostumeLabel inputIcon"><FontAwesomeIcon icon={faClock}></FontAwesomeIcon></label>
                                <input ref={durationIn} onChange={handleChange} type="number" min={1} name="duration" className="CostumeInput" placeholder="0"></input>
                            </div>
                            {errors.duration && <small className="error">{errors.duration}</small>}
                        </div>
                        <div className="InputContainer">
                            <label>Amount :</label>
                            <div>
                                <label className="CostumeLabel inputIcon"><FontAwesomeIcon icon={faDollar}></FontAwesomeIcon></label>
                                <input onChange={handleChange} ref={amountIn} type="number" min={1} name="amount" className="CostumeInput" placeholder="0"></input>
                                {errors.amount && <small className="error">{errors.amount}</small>}
                            </div>
                        </div>
                    </div>
                    <div className="div3 Section Inclusion">
                        <div className="SecHeader">
                            <h3> Includes:</h3>
                        </div>

                        <div className="FlexV">
                            <div className="FlexH">
                                <input onChange={handleCheckBoxChange} value="Flight" className="CostumeCheckBox" type="checkbox"></input>
                                <FontAwesomeIcon className="Icon" icon={faPlaneUp}></FontAwesomeIcon>
                                Flight
                            </div>
                        </div>
                        <div className="FlexV">
                            <div className="FlexH">
                                <input onChange={handleCheckBoxChange} value="Hotel" className="CostumeCheckBox" type="checkbox"></input>
                                <FontAwesomeIcon className="Icon" icon={faBed}></FontAwesomeIcon>
                                Hotel
                            </div>
                        </div>
                        <div className="FlexV">
                            <div className="FlexH">
                                <input onChange={handleCheckBoxChange} value="Guided_Tours" className="CostumeCheckBox" type="checkbox"></input>
                                <FontAwesomeIcon className="Icon" icon={faCamera}></FontAwesomeIcon>
                                Guided Tours
                            </div>
                        </div>
                        <div className="FlexV">
                            <div className="FlexH">
                                <input onChange={handleCheckBoxChange} value="Meals" className="CostumeCheckBox" type="checkbox"></input>
                                <FontAwesomeIcon className="Icon" icon={faUtensils}></FontAwesomeIcon>
                                Meals
                            </div>
                        </div>
                    </div>
                    <div className="div4 Section">
                        <div className="SecHeader">
                            <h3> Tour Highlights:</h3>
                        </div>

                        {Highlights.map(Highlight => (

                            <div id={Highlight.id} className="InputContainer FlexH" key={Highlight.id}>
                                <div style={{ flexGrow: "1" }}>
                                    <label className="CostumeLabel inputIcon"><FontAwesomeIcon className="Icon" icon={faCamera}></FontAwesomeIcon></label>
                                    <input id={Highlight.id} type="Text" onChange={() => HandleHighlightChange(Highlight.id, event)} className="CostumeInput SmoothAppear" placeholder="Highlight"  ></input>
                                </div>
                                <button onClick={() => RemoveHighlight(Highlight.id)} style={{ display: HighlightsCount > 1 ? "block" : "none" }} className="SecondaryB"><FontAwesomeIcon icon={faX}></FontAwesomeIcon></button>
                            </div>

                        ))}

                        <button className="PrimaryB FlexH" onClick={AddHighlight}><FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>ADD a Highlight</button>

                    </div>
                    <div className="div6 Section">
                        <div className="SecHeader">
                            <h3> Departure Dates:</h3>
                        </div>
                        <label htmlFor="date">
                            <div className="InputContainer">
                                <label>Date:</label>
                                <div>
                                    <input ref={Dateinput} id="date" type="Date" min={today} className={`CostumeInput ${DateValid ? "" : "InvalidIn"}`} placeholder="Select Date" ></input>
                                </div>
                            </div>
                            {errors && <small className="error">{errors.date}</small>}
                            <div className="InputContainer">
                                <label>Spots:</label>
                                <div>
                                    <label className=" inputIcon" ><FontAwesomeIcon icon={faUsers}></FontAwesomeIcon></label>
                                    <input ref={Spotsinput} type="number" min={2} className={`CostumeInput ${SpotsValid ? "" : "InvalidIn"}`} placeholder="1" ></input>
                                </div>
                            </div>
                        </label>
                        <button onClick={AddDepartureDate} className="PrimaryB FlexH"><FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>ADD Date</button>
                        {DDates.map(Date => (
                            <div key={Date.id} className="Section ">
                                <div className="FlexH_spaceBetween">
                                    <div className="FlexH">
                                        <FontAwesomeIcon className="DateIcon" icon={faCalendar}></FontAwesomeIcon>
                                        <div>
                                            <h4>{Date.Date}</h4>
                                            <div className="Spots" >{Date.SpotsTaken}/{Date.Spots} Spots</div>
                                        </div>
                                    </div>
                                    <button className="SecondaryB" onClick={() => DeleteDate(Date.id)}><FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>

    </>)
}

const response = await api.get('/ToursManagment.php');
const ToursData = response['data'];


function ToursManagement() {

    // Keep tours as an array so we can map/filter it naturally
    const [ToursList, SetToursList] = useState(() => {
        return Array.isArray(ToursData) ? ToursData : [];
    });



    //Actions Menu-------------------------------
    const [openCustomer, SetopenCustomers] = useState(() => {
        return ToursData.reduce((acc, item) => {
            acc[item.tour_id] = false;
            return acc;
        }, {});
    });
    const [openManageDates, setManageDatesOpen] = useState(() => {
        return ToursData.reduce((acc, item) => {
            acc[item.tour_id] = false;
            return acc;
        }, {});
    });



    const [open, setopen] = useState(false);
    const [menuindex, setmenuindex] = useState();
    //Dates Management:
    const [DDates, setDDates] = useState([]);
    const [IdCount, setIdCount] = useState(0);
    const Dateinput = useRef();
    const Spotsinput = useRef();
    async function AddDepartureDate(tour_id) {

        const date = Dateinput.current.value.trim();
        const spots = Spotsinput.current.value.trim();
        if (date === "") {

            Dateinput.current.className += " InvalidIn";

        }
        if (spots === "") {
            Spotsinput.current.className += " InvalidIn";
        }
        else {
            const data = {
                Date: date,
                Spots: spots,
                tour_id: tour_id
            }

            try {

                const response = await api.post('/Add_DDate.php', data)
                if (response.data.success) {
                    alert("Departure Date Added!");
                    setManageDatesOpen((prev) => ({ ...prev, [tour_id]: true }));

                    // Update tours list (array) by appending the new date to the correct tour
                    SetToursList(prev => {
                        const found = prev.some(t => t.tour_id === tour_id);
                        if (!found) {
                            console.warn(`Tour with ID ${tour_id} not found in state.`);
                            return prev;
                        }

                        return prev.map(t =>
                            t.tour_id === tour_id
                                ? {
                                    ...t,
                                    departure_dates: [
                                        ...(Array.isArray(t.departure_dates) ? t.departure_dates : []),
                                        {
                                            ddate_id: response.data.date_id,
                                            tour_id: tour_id,
                                            date: date,
                                            spot: spots,
                                            reserved_spots: 0
                                        }
                                    ]
                                }
                                : t
                        );
                    });







                }
                else {
                    console.log("Inertion failed:", response.data)
                }


            } catch (error) {
                console.error("There was an error inserting the Date:", error);
            }



        }
    }


    async function DeleteDate(date_id, tour_id) {


        try {
            const response = await api.delete(`/Del_DDate.php?id=${date_id}`);
            console.log(response.data);


            if (response.data.success) {
                alert("Deleted successfully!");
                setDDates(prev => prev.filter(d => d.id !== date_id));

                // Update tours list (array) by removing the date from the correct tour
                SetToursList(prev => prev.map(t =>
                    t.tour_id === tour_id
                        ? { ...t, departure_dates: (t.departure_dates || []).filter(date => date.ddate_id !== date_id) }
                        : t
                ));

                setManageDatesOpen((prev) => ({ ...prev, [tour_id]: true }))
            }
        } catch (error) {
            console.error("There was an error deleting the record:", error);
        }




    }
    //--------------------------------------------

    useEffect(() => {

        function handleClickOutside(e) {
            // Close actions menu when clicking outside any ActionsB button or ActionsMenu
            if (!e.target.closest('.ActionsB') && !e.target.closest('.ActionsMenu')) {
                setopen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            // Cleanup
            document.removeEventListener("click", handleClickOutside);
        };
    }, [])

    function Portal({ isOpen, onClose, children }) {
        if (!isOpen) return null;

        return createPortal(

            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div className="Section SmoothAppear" style={{ height: "80vh", overflow: "auto" }}>
                    {children}
                    <button className="PrimaryB" onClick={onClose}>Close</button>
                </div>
            </div>


            , document.body)
    }
    function DeleteTour(idToRemove) {
        // Call backend to delete then update state
        (async () => {
            try {
                const response = await api.delete(`/Del_Tour.php?id=${idToRemove}`);
                if (response.data.success) {
                    alert("Tour Deleted")
                    // re-fetch authoritative tours list from server
                    try {
                        SetToursList(resp.data || []);
                        const resp = await api.get('/ToursManagment.php');
                    } catch (err) {
                        // fallback to removing locally
                        SetToursList(prev => prev.filter(tour => tour.tour_id !== idToRemove));
                    }
                    // close actions menu
                    setopen(false);
                    // also clear any open portals for this tour
                    SetopenCustomers((prev) => ({ ...prev, [idToRemove]: false }));
                    setManageDatesOpen((prev) => ({ ...prev, [idToRemove]: false }));
                } else {
                    console.error('Delete failed', response.data);
                    alert('Delete failed');
                }
            } catch (error) {
                console.error('Error deleting tour', error);
                alert('Error deleting tour');
            }
        })();

    }
    //GET Cosutmers Per Tour-------------------------------------------------------

    const [bookings, setbookings] = useState([]);


    async function GetCostumers(tour_id) {



        try {
            const response = await api.get('/tour_bookings.php', {
                params: { id: tour_id }
            });

            const result = response.data;
            return result.data;
        } catch (error) {
            console.error('Error fetching customers for tour', tour_id, error);
            return [];
        }
    }


    async function OpenCostumers_list(tour_id) {
        const result = await GetCostumers(tour_id);
        console.log(result)


        setbookings(result);

        SetopenCustomers((prev) => ({ ...prev, [tour_id]: true }));
    }






    console.log(ToursList);
    return (<>
        <div className="Section" >
            {ToursList.map((Tour) => (

                <div key={Tour.tour_id} className="Section">
                    <div className="FlexH_spaceBetween" >
                        <h4>{Tour.tour_name}</h4>

                        {/*Actions Menu--------------------------------- */}
                        <div style={{ position: "relative" }}>
                            <button className="ActionsB" onClick={(e) => {
                                e.stopPropagation();// prevent document click from immediately closing it
                                if (menuindex === Tour.tour_id) {
                                    setopen(prev => !prev);
                                } else {
                                    setmenuindex(Tour.tour_id);
                                    setopen(true);
                                }

                            }}><FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon></button>
                            {open && (menuindex == Tour.tour_id) &&


                                (<div className="ActionsMenu FlexV" style={{ gap: 0, translate: "-100% 90%" }}>
                                    <h4>Actions</h4>
                                    <button onClick={() => OpenCostumers_list(Tour.tour_id)} className="FlexH"> <FontAwesomeIcon className="Icon" icon={faUsers}></FontAwesomeIcon><p>View Costumers</p></button>

                                    <button onClick={() => setManageDatesOpen((prev) => ({ ...prev, [Tour.tour_id]: true }))} className="FlexH"> <FontAwesomeIcon className="Icon" icon={faCalendar}></FontAwesomeIcon><p>Manage Dates</p></button>

                                    <div onClick={() => DeleteTour(Tour.tour_id)} className="FlexH DeleteC"> <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon><p>Delete Tour</p></div>
                                </div>)


                            }

                        </div>

                        <Portal isOpen={openManageDates[Tour.tour_id]} onClose={() => (setManageDatesOpen((prev) => ({ ...prev, [Tour.tour_id]: false })))}>
                            <div className="SecHeader">
                                <h3>Manage Departure Dates - {Tour.tour_name}</h3>
                                <p>Add or remove departure dates for this tour</p>
                            </div>
                            <h4>Add a New Departure Date:</h4>
                            <div className="FlexH DatesForm">
                                <input ref={Dateinput} className="CostumeInput" type="Date" min={today}></input>
                                <div className="InputContainer">
                                    <div>
                                        <label className="CostumeLabel inputIcon"><FontAwesomeIcon icon={faUsers}></FontAwesomeIcon></label>
                                        <input ref={Spotsinput} type="number" min={1} className="CostumeInput" placeholder="Spots"></input>
                                    </div>
                                </div>

                                <button className="PrimaryB FlexH" onClick={() => AddDepartureDate(Tour.tour_id)}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>Add</button>
                            </div>
                            <h4>Current DepartureDates:</h4>

                            <hr style={{ width: "100%", margin: "0" }}></hr>
                            {Tour.departure_dates.map(Date => (
                                <div key={Date.ddate_id} className="Section ">
                                    <div className="FlexH_spaceBetween">
                                        <div className="FlexH">
                                            <FontAwesomeIcon className="DateIcon" icon={faCalendar}></FontAwesomeIcon>
                                            <div>
                                                <h4>{Date.date}</h4>
                                                <div className="Spots">{Date.reserved_spots}/{Date.spot} Spots</div>
                                            </div>
                                        </div>
                                        <button className="SecondaryB" onClick={() => DeleteDate(Date.ddate_id, Tour.tour_id)}><FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon></button>
                                    </div>
                                </div>
                            ))}

                        </Portal>
                        <Portal isOpen={openCustomer[Tour.tour_id]} onClose={() => (SetopenCustomers((prev) => ({ ...prev, [Tour.tour_id]: false })))}>
                            <div className="SecHeader">
                                <h3>
                                    Booked Customers - {Tour.tour_name}
                                </h3>
                                <p>View all customers who have booked this tour</p>
                            </div>
                            <table className="CostumeTable">
                                <tr>
                                    <th>Costumer</th>
                                    <th>Contact</th>
                                    <th>DepartureDate</th>
                                    <th>Status</th>
                                </tr>


                                {bookings.map((costumer, index) => (
                                    <tr key={index} style={{ color: "brown" }}>
                                        <td style={{ color: "black" }}><div ><p>{costumer.first_name + costumer.last_name}</p><p style={{ color: "red" }}>{costumer.user_id}</p></div></td>
                                        <td><div className="Contact">
                                            <p><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon> {costumer.email}</p>
                                            <p><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon> {costumer.phone_num}</p>

                                        </div></td>
                                        <td><FontAwesomeIcon icon={faCalendar} style={{ color: "red" }}></FontAwesomeIcon> {costumer.date}</td>
                                        <td>
                                            <div className={costumer.status}>
                                                {costumer.status}
                                            </div>
                                        </td>
                                    </tr>

                                ))}
                            </table>
                        </Portal>

                    </div>
                    <div className="FlexH">
                        <p className="FlexH" style={{ gap: "5px" }}><FontAwesomeIcon icon={faMap} color="brown" />{Tour.location}</p>
                        <p className="FlexH" style={{ gap: "5px" }}><FontAwesomeIcon icon={faClock} color="brown" />{Tour.location}</p>
                        <p className="FlexH Money" style={{ gap: "5px" }}><FontAwesomeIcon icon={faDollar} />{Tour.price} / person</p>
                    </div>
                    <div className="FlexH_spaceBetween TourStat" >

                        <div>
                            <p> Total Bookings: </p>




                            <p> {Tour.departure_dates.length > 0 ? String(Tour.departure_dates[0]['reserved_spots']) + " / " + String(Tour.departure_dates[0]['spot']) : 0}   </p>
                        </div>
                        <div>
                            <p> Revenu: </p>
                            <p>  {Tour.departure_dates.length > 0 ? Tour.departure_dates[0]['reserved_spots'] * Number(Tour.price) : 0} </p>
                        </div>
                        <div>
                            <p> Next Departure Date: </p>
                            <p> {Tour.departure_dates.length > 0 ? Tour.departure_dates[0]['date'] : "none"} </p>{/*  upcoming departuer dates*/}
                        </div>
                    </div>
                </div>

            ))}
        </div>
    </>)
}


function AgencyTours() {

    const ToursNavItems = [
        { Section: "Tours Management", Icon: faCompass },
        { Section: "Add a Tour", Icon: faPlus },
    ];
    return (<>



        <div className=" S_Container">

            <nav className="SettingsNav">
                <ul>
                    {ToursNavItems.map((item, index) => (
                        <li key={index}>
                            <NavLink className={({ isActive }) => (isActive ? "NavLink activeNavLink" : "NavLink")} to={`/Profile/Agency Tours/${item.Section}`}>
                                <FontAwesomeIcon icon={item.Icon} />
                                <p>{item.Section}</p>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>



            <Routes>
                <Route index element={<Navigate to="Tours Management" replace />}></Route>
                <Route path="Tours Management" element={<ToursManagement />} />
                <Route path="Add a Tour" element={<AddTour />} />
            </Routes>

        </div>

    </>)
}

export default AgencyTours;