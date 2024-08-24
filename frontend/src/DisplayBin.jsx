import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const DisplayBin = () => {
  const [binData, setBinData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/bin-data`);
        setBinData(response.data);
      } catch (error) {
        console.error("An error occurred while fetching the bin data:", error);
      }
    }

    fetchData();
  }, []);

  const createChartData = (binEntry) => {
    const timestamps = binEntry.data.map(dataPoint => new Date(dataPoint.timestamp).toLocaleString());
    const binLevels = binEntry.data.map(dataPoint => dataPoint.binLevel);
    return {
      labels: timestamps,
      datasets: [
        {
          label: `Bin ${binEntry.binNumber} Level`,
          data: binLevels,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bin Level Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Bin Level'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  const TrashCan = ({ fillLevel }) => {
    const height = 200;
    const width = 100;
    const fillHeight = height * (fillLevel / 100);

    return (
      <div className="relative" style={{ width, height }}>
        <div className="absolute bottom-0 w-full bg-gray-300 rounded-t-lg overflow-hidden" style={{ height }}>
          <div 
            className="absolute bottom-0 w-full bg-green-500 transition-all duration-500 ease-in-out" 
            style={{ height: `${fillHeight}px` }}
          ></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-600 rounded-t-lg"></div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Bins Data</h2>
      {binData.map((binEntry) => {
        const latestLevel = binEntry.data[binEntry.data.length - 1]?.binLevel || 0;
        return (
          <div key={binEntry.binNumber} className="mb-8 p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Bin {binEntry.binNumber}</h3>
            <div className="flex items-center">
              <div className="w-4/5 mx-0 h-96">
                <Line data={createChartData(binEntry)} options={options} />
              </div>
              <div className="w-1/4 flex flex-col justify-start items-center">
                <span className="text-lg font-bold mb-2">{latestLevel}%</span>
                <TrashCan fillLevel={latestLevel} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayBin;