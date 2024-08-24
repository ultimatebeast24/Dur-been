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

  return (
    <div>
      <h2>All Bins Data</h2>
      {binData.map((binEntry) => (
        <div key={binEntry.binNumber} style={{ marginBottom: '30px' }}>
          <h3>Bin {binEntry.binNumber}</h3>
          <Line data={createChartData(binEntry)} options={options} />
        </div>
      ))}
    </div>
  );
};

export default DisplayBin;