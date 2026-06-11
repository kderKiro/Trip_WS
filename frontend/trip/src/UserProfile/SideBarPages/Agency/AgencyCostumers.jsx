import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faEllipsisV, faEnvelope, faPhone, faCalendar, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import './styles/AgencyCostumers.css'
import { useEffect, useRef, useState } from "react";

import api from "../../API/PHP_API";








const response = await api.get('/Costumers.php');
if (!response.data.success) {
    console.error(response);
}



function Ag_Costumers() {

    const [CostumersList, setCostumersList] = useState(response.data.UsersData);

    function Search(e) {
        const value = e.target.value.trim();
        console.log(value);

        if (value.trim() === "") {
            setCostumersList(response.data.UsersData);
        }
        else {

            setCostumersList(response.data.UsersData.filter(customer =>
                customer.first_name.toLowerCase().startsWith(value.toLowerCase()) ||
                customer.last_name.toLowerCase().startsWith(value.toLowerCase()) ||
                String(customer.user_id).toLowerCase().startsWith(value.toLowerCase()) ||
                customer.email.toLowerCase().startsWith(value.toLowerCase()) ||
                String(customer.phone).toLowerCase().startsWith(value.toLowerCase())
            ))
        }


    }

    return (<>
        <div className="S_Container :">
            <div className="Section">
                <div className="SecHeader">

                    <h2>Costumers </h2>

                </div>
                <div className="Section" style={{ backgroundColor: "white" }}>
                    <div className="InputContainer">
                        <div>
                            <label className="CostumeLabel inputIcon"><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon></label>
                            <input onChange={Search} id="search" className="CostumeInput" placeholder="Search by name,email,ID..."></input>
                        </div>
                    </div>
                </div>
                <div className="Section" style={{ backgroundColor: "white" }}>
                    <div className="FlexH_spaceBetween">
                        <p style={{ fontWeight: "600" }}>Costumers List:</p>
                        <p style={{ color: "brown" }}>Showing {CostumersList.length} Costumers</p>
                    </div>


                    <div className="TableContainer" style={{ overflow: "auto" }}>
                        <table className="CostumeTable" style={{ zIndex: 0 }}>
                            <thead>
                                <th>Custumer</th>
                                <th>Contact</th>
                                <th>Bookings</th>
                                <th>Join Date</th>

                            </thead>
                            {CostumersList.map((costumer, index) => (
                                <thead key={index} style={{ color: "brown" }}>
                                    <td style={{ color: "black" }}><div ><p>{costumer.first_name + costumer.last_name}</p><p style={{ color: "red" }}>{costumer.user_id}</p></div></td>
                                    <td><div className="Contact">
                                        <p><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon> {costumer.email}</p>
                                        <p><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon> {costumer.phone_num}</p>

                                    </div></td>
                                    <td><FontAwesomeIcon icon={faCalendar} style={{ color: "red" }}></FontAwesomeIcon> {costumer.Bookings_num}</td>
                                    <td>{costumer.created_at.split(' ')[0]}</td>
                                </thead>

                            ))}

                        </table>
                    </div>
                </div>
            </div>





        </div>
    </>)
}
export default Ag_Costumers;