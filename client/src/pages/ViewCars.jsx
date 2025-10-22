import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCars } from '../services/CarsAPI';
import '../App.css';

const ViewCars = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            const data = await getAllCars();
            setCars(data);
        };
        fetchCars();
    }, []);

    return (
        <div className="view-cars-container">
            <h2>My Custom Cars</h2>
            <div className="car-list">
                {cars.length > 0 ? (
                    cars.map(car => (
                        <div key={car.id} className="car-list-item">
                            <div className="car-item-header">
                                <h3>🏎️ {car.name}</h3>
                                <div className="car-item-price-details">
                                    <p className="total-price">${car.total_price.toLocaleString()}</p>
                                    <Link to={`/customcars/${car.id}`} role="button" className="details-button">Details</Link>
                                </div>
                            </div>
                            <div className="car-item-specs">
                                <div>
                                    <p><strong>Exterior:</strong> {car.exterior}</p>
                                    <p><strong>Roof:</strong> {car.roof}</p>
                                </div>
                                <div>
                                    <p><strong>Wheels:</strong> {car.wheels}</p>
                                    <p><strong>Interior:</strong> {car.interior}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You haven't created any custom cars yet.</p>
                )}
            </div>
        </div>
    );
};

export default ViewCars;