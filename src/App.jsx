import React, { useState, useEffect } from 'react';
import './App.css';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
    const [catData, setCatData] = useState(null);
    const [banList, setBanList] = useState([]);
    const [breeds, setBreeds] = useState([]);

    useEffect(() => {
        fetchBreeds();
    }, []);

    const fetchBreeds = async () => {
        try {
            const response = await fetch('https://api.thecatapi.com/v1/breeds');
            const data = await response.json();
            setBreeds(data);
        } catch (error) {
            console.error('Error fetching breeds:', error);
        }
    };

    const fetchRandomCatByBreed = async (breedId) => {
        try {
            const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);
            const data = await response.json();
            setCatData(data[0]);
        } catch (error) {
            console.error('Error fetching random cat by breed:', error);
        }
    };

    const addToBanList = (attribute) => {
        setBanList([...banList, attribute]);
    };

    const renderCatAttributes = () => {
        if (catData && Object.keys(catData).length > 0) {
            const { id, url, breeds } = catData;
            return (
                <div>
                    <img src={url} alt="Cat" />
                    <ul>
                        <li>ID: {id}</li>
                        <li>Breed: {breeds}</li>
                        {breeds && breeds.length > 0 && breeds.map((breed, index) => (
                            <li key={index}>
                                Breed: {breed.name} | Origin: {breed.origin}
                                <button onClick={() => addToBanList(breed.name)}>Ban Breed</button>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    const renderBanList = () => {
        return (
            <div>
                <h2>Ban List</h2>
                <ul>
                    {banList.map((attribute, index) => (
                        <li key={index}>
                            {attribute} <button onClick={() => removeFromBanList(attribute)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const removeFromBanList = (attribute) => {
        setBanList(banList.filter(item => item !== attribute));
    };

    const handleRandomBreedClick = () => {
        const randomIndex = Math.floor(Math.random() * breeds.length);
        const randomBreedId = breeds[randomIndex].id;
        fetchRandomCatByBreed(randomBreedId);
    };

    return (
        <div className="App">
            <h1>Random Cat Viewer</h1>
            <button onClick={handleRandomBreedClick}>Get Random Cat by Breed</button>
            <div className="cat-attributes">
                {renderCatAttributes()}
            </div>
            <div className="ban-list">
                {renderBanList()}
            </div>
        </div>
    );
}

export default App;



