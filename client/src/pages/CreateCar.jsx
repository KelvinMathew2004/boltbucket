import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCar, getOptions } from '../services/CarsAPI';
import { calculateTotalPrice, BASE_PRICE } from '../utilities/price-calculator.jsx';
import '../App.css';

const CreateCar = () => {
    const navigate = useNavigate();
    const [allOptions, setAllOptions] = useState({});
    const [car, setCar] = useState({
        name: '',
        is_convertible: false,
        exterior: '',
        wheels: '',
        roof: '',
        interior: '',
    });
    const [totalPrice, setTotalPrice] = useState(BASE_PRICE);
    const [activeOption, setActiveOption] = useState('exterior');
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        const fetchOptions = async () => {
            const options = await getOptions();
            setAllOptions(options);
            // Set defaults from API data
            if (options.exterior && options.wheels && options.roof && options.interior) {
                setCar({
                    name: '',
                    is_convertible: false,
                    exterior: options.exterior[0].name,
                    wheels: options.wheels[0].name,
                    roof: options.roof[0].name,
                    interior: options.interior[0].name,
                });
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        const newTotal = calculateTotalPrice(car, allOptions);
        setTotalPrice(newTotal);
    }, [car, allOptions]);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        if (name === 'is_convertible') {
            setApiError(''); // Clear error when checkbox is toggled
        }

        setCar(prevCar => ({ ...prevCar, [name]: newValue }));
    };

    const handleOptionClick = (category, option) => {
        if (category === 'roof') {
            if (option.is_convertible_only && !car.is_convertible) {
                setApiError(`'${option.name}' is for convertible models only.`);
                return;
            }
            if (!option.is_convertible_only && car.is_convertible) {
                setApiError(`'${option.name}' is not compatible with convertible models.`);
                return;
            }
        }
        
        setApiError('');
        setCar(prev => ({ ...prev, [category]: option.name }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError('');
        try {
            await createCar(car); // Total price is calculated on the backend
            navigate('/customcars');
        } catch (error) {
            setApiError(error.message);
        }
    };

    const renderOptions = () => {
        const categoryOptions = allOptions[activeOption] || [];

        return (
            <div className="options-selector">
                {apiError && <div className="error-message">{apiError}</div>}
                {categoryOptions.map(option => (
                    <div 
                        key={option.id} 
                        className={`option-card ${car[activeOption] === option.name ? 'selected' : ''}`} 
                        onClick={() => handleOptionClick(activeOption, option)}
                    >
                        <p>{option.name}</p>
                        <p>${option.price.toLocaleString()}</p>
                        {option.is_convertible_only && activeOption === 'roof' && <p className="convertible-only">convertible only</p>}
                    </div>
                ))}
                <button className="done-button" onClick={() => setActiveOption('')}>Done</button>
            </div>
        );
    };

    if (!allOptions.exterior) {
        return <div>Loading Configurator...</div>
    }

    return (
        <div className="configurator-container">
            <div className="price-display">
                <h2>${totalPrice.toLocaleString()}</h2>
            </div>

            <div className="configurator-panel">
                <div className="config-header">
                    <label>
                        <input
                            type="checkbox"
                            name="is_convertible"
                            checked={car.is_convertible}
                            onChange={handleInputChange}
                        />
                        Convertible
                    </label>
                    <div className="option-buttons">
                        <button onClick={() => setActiveOption('exterior')}>Exterior</button>
                        <button onClick={() => setActiveOption('roof')}>Roof</button>
                        <button onClick={() => setActiveOption('wheels')}>Wheels</button>
                        <button onClick={() => setActiveOption('interior')}>Interior</button>
                    </div>
                    <form onSubmit={handleSubmit} className="car-name-form">
                        <input
                            type="text"
                            name="name"
                            value={car.name}
                            onChange={handleInputChange}
                            placeholder="My New Car"
                            required
                        />
                        <button type="submit">Create</button>
                    </form>
                </div>

                {activeOption && renderOptions()}
            </div>
        </div>
    );
};

export default CreateCar;
