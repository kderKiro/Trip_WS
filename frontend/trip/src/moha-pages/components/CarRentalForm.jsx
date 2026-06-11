import React from "react";
import { useForm } from "react-hook-form";
import "./css/CarRentalForm.css";

// ---------------------- VALIDATION FUNCTIONS ---------------------- //

const validatePickupDate = (value) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(value);

    if (!value) return "Pickup date is required";
    if (selected < today) return "Pickup date must be in the future";

    return true;
};

const validateDropoffDate = (value, pickupDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(value);

    if (!value) return "Dropoff date is required";
    if (selected < today) return "Dropoff date must be in the future";
    if (pickupDate && selected <= new Date(pickupDate))
        return "Dropoff must be after pickup date";

    return true;
};

// 1. Accept the 'onSearch' prop from the parent
const CarRentalForm = ({ onSearch }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const pickupDate = watch("pickupDate");

    const onSubmit = (data) => {
        // 2. Pass the form data to the parent component
        if (onSearch) {
            onSearch(data);
        }
        console.log("Form submitted successfully:", data);
    };

    return (
        <form className="car-rental-form" onSubmit={handleSubmit(onSubmit)}>

            {/* Pickup Location */}
            <div className="form-group pickup-group">
                <div className="car-fpart">
                    <label htmlFor="pickupLocation">Pickup Location</label>
                    <input
                        id="pickupLocation"
                        {...register("pickupLocation", { required: "Pickup location is required" })}
                    />
                </div>
                {errors.pickupLocation && <span className="error-message">{errors.pickupLocation.message}</span>}
            </div>

            {/* Dropoff Location */}
            <div className="form-group dropoff-group">
                <div className="car-fpart">
                    <label htmlFor="dropoffLocation">Dropoff Location</label>
                    <input
                        id="dropoffLocation"
                        {...register("dropoffLocation", { required: "Dropoff location is required" })}
                    />
                </div>
                {errors.dropoffLocation && <span className="error-message">{errors.dropoffLocation.message}</span>}
            </div>

            {/* Pickup Date */}
            <div className="form-group pickup-date-group">
                <div className="car-fpart">
                    <label htmlFor="pickupDate">Pickup Date</label>
                    <input
                        id="pickupDate"
                        type="date"
                        {...register("pickupDate", { validate: validatePickupDate })}
                    />
                </div>
                {errors.pickupDate && <span className="error-message">{errors.pickupDate.message}</span>}
            </div>

            {/* Dropoff Date */}
            <div className="form-group dropoff-date-group">
                <div className="car-fpart">
                    <label htmlFor="dropoffDate">Dropoff Date</label>
                    <input
                        id="dropoffDate"
                        type="date"
                        {...register("dropoffDate", {
                            validate: (value) => validateDropoffDate(value, pickupDate),
                        })}
                    />
                </div>
                {errors.dropoffDate && <span className="error-message">{errors.dropoffDate.message}</span>}
            </div>

            {/* Car Type */}
            <div className="form-group car-type-group">
                <div className="car-fpart">
                    <label htmlFor="carType">Car Type</label>
                    <select
                        id="carType"
                        {...register("carType", { required: "Car type is required" })}
                    >
                        <option value="">Select a car</option>
                        <option value="Economy">Economy</option>
                        <option value="Comfort">Comfort</option>
                        <option value="Luxury">Luxury</option>
                    </select>
                </div>
                {errors.carType && <span className="error-message">{errors.carType.message}</span>}
            </div>

            {/* Submit */}
            <div id="btn-form-car">
                <button type="submit" className="submit-button">Search</button>
            </div>

        </form>
    );
};

export default CarRentalForm;