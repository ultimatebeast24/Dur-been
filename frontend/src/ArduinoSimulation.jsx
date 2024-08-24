import React, { useState } from "react";
import axios from "axios";

function ArduinoSimulation() {
  const [binNumber, setBinNumber] = useState("");
  const [binLevel, setBinLevel] = useState("");

  async function sendRequest(binNumber, binLevel) {
    try {
      const response = await axios.post("http://localhost:3000/send-request", {
        binNumber,
        binLevel,
      });

      if (response.status === 200) {
        console.log("Request sent successfully");
      } else {
        console.error("Failed to send request");
      }
    } catch (error) {
      console.error("An error occurred while sending the request:", error);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendRequest(binNumber, binLevel);
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Arduino Simulation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="binNumber" className="block text-sm font-medium text-gray-700">
            Bin Number
          </label>
          <input
            id="binNumber"
            type="text"
            value={binNumber}
            onChange={(event) => setBinNumber(event.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter bin number"
          />
        </div>
        <div>
          <label htmlFor="binLevel" className="block text-sm font-medium text-gray-700">
            Bin Level
          </label>
          <input
            id="binLevel"
            type="text"
            value={binLevel}
            onChange={(event) => setBinLevel(event.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter bin level"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Request
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArduinoSimulation;
