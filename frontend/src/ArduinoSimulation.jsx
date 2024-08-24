import React, { useState } from 'react';
import axios from 'axios';

function ArduinoSimulation() {
    const [binNumber, setBinNumber] = useState('');
    const [binLevel, setBinLevel] = useState('');

    async function sendRequest(binNumber, binLevel) {
        try {
            const response = await axios.post('https://localhost:8000/send-request', {
                binNumber,
                binLevel
            });

            if (response.status === 200) {
                console.log('Request sent successfully');
            } else {
                console.error('Failed to send request');
            }
        } catch (error) {
            console.error('An error occurred while sending the request:', error);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        sendRequest(binNumber, binLevel);
    }

    return (
        <div>
            <h2>Arduino Simulation</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Bin Number:
                    <input
                        type="text"
                        value={binNumber}
                        onChange={(event) => setBinNumber(event.target.value)}
                    />
                </label>
                <br />
                <label>
                    Bin Level:
                    <input
                        type="text"
                        value={binLevel}
                        onChange={(event) => setBinLevel(event.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Send Request</button>
            </form>
        </div>
    );
}

export default ArduinoSimulation;