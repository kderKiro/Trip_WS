import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShield, faCreditCard, faWallet, faLocationDot, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

import { useRef, useState, useEffect } from "react";
import './Styles/Settings.css'
import api from "../../API/PHP_API";






function Settings() {



    const SettingsNavItems = [
        { Section: "Personal Info", Icon: faUser },
        { Section: "Security", Icon: faShield },
    ];

    return (
        <>
            <div className="S_Container">
                <section>
                    <h1>Settings</h1>
                    <p>Manage your account settings and preferences</p>
                </section>

                <nav className="SettingsNav">
                    <ul>
                        {SettingsNavItems.map((item, index) => (
                            <li key={index}>
                                <NavLink className={({ isActive }) => (isActive ? "NavLink activeNavLink" : "NavLink")} to={`/Profile/Settings/${item.Section}`}>
                                    <FontAwesomeIcon icon={item.Icon} />
                                    <p>{item.Section}</p>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Routes>
                    <Route index element={<Navigate to="Personal Info" replace />} />
                    <Route path="Personal Info" element={<Profile />} />
                    <Route path="Security" element={<Security />} />
                </Routes>
            </div>
        </>
    );
}

function Profile() {
    const [user, setuser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('./Settings.php');
                const result = response.data;
                const user_data = result.data;
                setuser(user_data);
                console.log(user_data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);





    const firstNameIn = useRef();
    const lastNameIn = useRef();
    const emailIn = useRef();
    const phoneNumberIn = useRef();
    const addressIn = useRef();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState({});

    // Update formData when user data is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phoneNumber: user.phone_num || '',
            });
        }
    }, [user]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));//resets errors
    }
    function validate(values) {

        const newErrors = {};

        // First name
        if (!values.firstName.trim()) {

            newErrors.firstName = "First name is required.";

            firstNameIn.current.classList.add("InvalidIn");
        } else if (values.firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters.";

            firstNameIn.current.classList.add("InvalidIn");
        }
        else if (values.firstName) {

        }
        else {
            firstNameIn.current.classList.remove("InvalidIn");

        }

        // Last name
        if (!values.lastName.trim()) {
            newErrors.lastName = "Last name is required.";

            lastNameIn.current.classList.add("InvalidIn");
        } else if (values.lastName.trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters.";
            lastNameIn.current.classList.add("InvalidIn");
        }
        else {
            lastNameIn.current.classList.remove("InvalidIn");
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!values.email.trim()) {
            newErrors.email = "Email is required.";

            emailIn.current.classList.add("InvalidIn");
        } else if (!emailRegex.test(values.email.trim())) {
            newErrors.email = "Enter a valid email address.";
            emailIn.current.classList.add("InvalidIn");
        }
        else {
            emailIn.current.classList.remove("InvalidIn");

        }


        // Phone
        const phoneRegex = /^\+?(0|213|213\s?)([567])[0-9]{8}$/;

        if (!values.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required.";
            phoneNumberIn.current.classList.add("InvalidIn");
        } else if (!phoneRegex.test(values.phoneNumber.trim())) {
            newErrors.phoneNumber = "Phone must be an algerian number.";
            phoneNumberIn.current.classList.add("InvalidIn");
        }
        else {
            phoneNumberIn.current.classList.remove("InvalidIn");

        }

        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = validate(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        else {

            const response = await api.post('./Settings.php', formData);
            if (response.data === "success") {
                alert("User Updated!");
            }
        }
    }
    function handleReset() {
        setFormData({
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            email: user?.email || '',
            phoneNumber: user?.phone_num || '',

        });

        addressIn.current.classList.remove("InvalidIn");
        firstNameIn.current.classList.remove("InvalidIn");
        lastNameIn.current.classList.remove("InvalidIn");
        phoneNumberIn.current.classList.remove("InvalidIn");
        emailIn.current.classList.remove("InvalidIn");

        setErrors({});
    }



    if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;
    if (error) return <h2 style={{ textAlign: 'center', color: 'red' }}>Error: {error}</h2>;
    if (!user) return <h2 style={{ textAlign: 'center' }}>No user data found</h2>;

    return (<>


        <div className="Section">
            <div className="SecHeader">
                <h3>Profile informations</h3>
                <p>Update your personal information</p>

            </div>
            <form onSubmit={handleSubmit} onReset={handleReset} >
                <div className="InfoForm">
                    <div className="InfoFormInput">
                        <label>First Name</label>
                        <input name="firstName" value={formData.firstName} ref={firstNameIn} onChange={handleChange} type="text" ></input>
                        {errors.firstName && <small className="error">{errors.firstName}</small>}
                    </div>

                    <div className="InfoFormInput">
                        <label>Last Name</label>
                        <input name="lastName" value={formData.lastName} ref={lastNameIn} onChange={handleChange} type="text"></input>
                        {errors.lastName && <small className="error">{errors.lastName}</small>}

                    </div>

                    <div className="InfoFormInput" style={{ gridColumn: "span 2" }}>
                        <label>Email</label>
                        <FontAwesomeIcon icon={faEnvelope} className="InfoFormIcon" ></FontAwesomeIcon>
                        <input name="email" value={formData.email} ref={emailIn} onChange={handleChange} type="email" style={{ paddingLeft: "40px" }} placeholder="example@gmail.com"></input>
                        {errors.lastName && <small className="error">{errors.lastName}</small>}

                    </div>
                    <div className="InfoFormInput" >
                        <label>Phone Number</label>
                        <FontAwesomeIcon icon={faPhone} className="InfoFormIcon"></FontAwesomeIcon>
                        <input name="phoneNumber" value={formData.phoneNumber} ref={phoneNumberIn} onChange={handleChange} type="text" style={{ paddingLeft: "40px" }} placeholder="0540493067"></input>
                        {errors.phoneNumber && <small className="error">{errors.phoneNumber}</small>}
                    </div>

                </div>
                <div className="Submition" style={{}}>
                    <input type="reset" className="SecondaryB" />
                    <input type="submit" className="PrimaryB" value={"Save Changes"} />
                </div>
            </form>
        </div>







    </>);
}




function Security() {

    const curr_pass = useRef();
    const new_passRef = useRef();
    const confirmed_passRef = useRef();


    async function UpdatePassword(e) {


        e.preventDefault();

        const current_pass = curr_pass.current.value;

        const response = await api.get('./Password_update.php', {
            params: {
                curr_pass: current_pass
            }
        });

        if (response.data === "Password Match") {

            const new_password = new_passRef.current.value;
            const confirmed_pass = confirmed_passRef.current.value;


            const response = await api.post('./Password_update.php', {
                new_password: new_password,
                confirmed_pass: confirmed_pass
            }
            )

            if (response.data === "password updated") {
                alert("Password Updated!");
            }
            else {
                alert("Failed to update password");
            }

        }
        else {
            alert(response.data);
        }



    }


    return <>
        <div className="Section">
            <div className="SecHeader">
                <h3>Change Password</h3>
                <p>Update your password to keep your account secure</p>
            </div>
            <form className="PassChangeForm" onSubmit={UpdatePassword}>
                <div className="InfoFormInput">
                    <label>Current Password</label>
                    <input ref={curr_pass} type="text" required></input>
                </div>
                <div className="InfoFormInput">
                    <label>New Password</label>
                    <input ref={new_passRef} type="text" required ></input>
                </div>
                <div className="InfoFormInput">
                    <label>Confirm New Password</label>
                    <input ref={confirmed_passRef} type="text" required ></input>
                </div>
                <div>
                    <input type="submit" className="PrimaryB" value={"Update Password"}></input>
                </div>
            </form>
        </div>

    </>
}






export default Settings