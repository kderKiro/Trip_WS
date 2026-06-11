import React, { useState, useEffect } from 'react';
import './styles/AgencyOverview.css'
import api from '../../API/PHP_API';

function AgencyOverview() {
    // 1. Use State to hold the data
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ensure your API client sends cookies!
                const response = await api.get('./overview.php'); 
                
                if (response.data.status === "success") {
                    setRecentBookings(response.data.data);
                } else {
                    setError(response.data.message || "Failed to load data");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Network error or Unauthorized");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
        <div className='S_Container'>
            <div className='Section'>
                <div className='SecHeader'>
                    <h2>Recent Bookings:</h2>
                    <p>Review your Last Bookings</p>
                </div>
                <div className='TableContainer' style={{ overflow: "auto" }}>
                    <table className='CostumeTable' style={{ backgroundColor: "white" }}>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Tour</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 3. Map safely over the state */}
                            {recentBookings.length > 0 ? (
                                recentBookings.map((Booking, index) => (
                                    <tr key={index}>
                                        <td>{Booking.id}</td>
                                        <td>{Booking.first_name}</td>
                                        <td>{Booking.tour_name}</td>
                                        <td>{Booking.reserved_at ? Booking.reserved_at.split(' ')[0] : 'N/A'}</td>
                                        <td><div className={Booking.status}>{Booking.status}</div></td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5">No bookings found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AgencyOverview;