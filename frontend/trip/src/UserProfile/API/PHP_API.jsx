import axios from "axios";

const api = axios.create(
    {
        baseURL: 'https://full-trip.onrender.com/Frosty/Routes'|| 'http://localhost/Full_Trip_WS/backend/Frosty/Routes',
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    }

)

export default api;