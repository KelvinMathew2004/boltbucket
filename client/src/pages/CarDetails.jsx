import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCarById, deleteCar } from '../services/CarsAPI';
import '../App.css';

const CarDetails = () => {
    const [car, setCar] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarDetails = async () => {
            const data = await getCarById(id);
            setCar(data);
        };
        fetchCarDetails();
    }, [id]);

    const handleDelete = async () => {
        await deleteCar(id);
        navigate('/customcars');
    };

    if (!car) {
        return <div>Loading Car Details...</div>;
    }

    return (
        <div className="car-details-container">
            <div className="details-header">
                <h2>{car.name}</h2>
                <p className="total-price-details">${car.total_price.toLocaleString()}</p>
            </div>

            <div className="details-content">
                <div className="details-specs">
                    <div className="spec-item">
                        <p>Exterior</p>
                        <h3>{car.exterior}</h3>
                    </div>
                     <div className="spec-item">
                        <p>Roof</p>
                        <h3>{car.roof}</h3>
                    </div>
                     <div className="spec-item">
                        <p>Wheels</p>
                        <h3>{car.wheels}</h3>
                    </div>
                     <div className="spec-item">
                        <p>Interior</p>
                        <h3>{car.interior}</h3>
                    </div>
                </div>
            </div>
            
            <div className="details-actions">
                <Link to={`/edit/${id}`} role="button" className="edit-button">Edit</Link>
                <button onClick={handleDelete} className="delete-button">Delete</button>
            </div>
        </div>
    );
};

export default CarDetails;