import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { weatherIcons } from './weatherIcons';

const WeeklyForecast = () => {
  const [forecastData, setForecastData] = useState([
    { day: 'Monday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Tuesday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Wednesday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Thursday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Friday', temp: '', icon: 'sunny', precipitationChance: '' },
  ]);
  const [submittedData, setSubmittedData] = useState(null);

  const convertToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...forecastData];
    newData[index][field] = value;
    setForecastData(newData);
  };

  const handleSubmit = () => {
    const updatedForecastData = forecastData.slice(0, 5).map((forecast) => ({
      ...forecast,
      temp: forecast.temp ? convertToFahrenheit(parseFloat(forecast.temp)) : '',
    }));

    setSubmittedData(updatedForecastData);
    generatePDF(updatedForecastData);
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.text('Weekly Weather Forecast', 20, 20);

    const margin = 10;
    const spaceBetweenBoxes = 10;
    const maxWidth = doc.internal.pageSize.width - 2 * margin;

    // Use smaller boxes: width and height reduced from 35x60 to 30x50
    const boxWidth = 30;
    const boxHeight = 50;
    const boxesPerRow = Math.floor((maxWidth + spaceBetweenBoxes) / (boxWidth + spaceBetweenBoxes));
    let xPosition = margin;
    let yPosition = 40;

    data.forEach((forecast, index) => {
      const { day, temp, icon, precipitationChance } = forecast;

      // Draw the background box for each day
      doc.setDrawColor(0);
      doc.setFillColor(240, 240, 240); // Light gray background
      doc.rect(xPosition, yPosition, boxWidth, boxHeight, 'F');

      // Icon
      const iconUrl = weatherIcons[icon];

      if (iconUrl) {
        doc.addImage(iconUrl, 'PNG', xPosition + 2, yPosition + 5, 25, 25); // Adjusted icon size
      } else {
        console.error('Icon not found for', icon);
      }

      // Text content (Day, Temperature, Precipitation)
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(day, xPosition + 5, yPosition + 35);
      doc.text(`${temp}°F`, xPosition + 5, yPosition + 40);
      doc.text(`Precip: ${precipitationChance}%`, xPosition + 5, yPosition + 45);

      // Update position for next box
      xPosition += boxWidth + spaceBetweenBoxes;

      // Move to next row if necessary
      if ((index + 1) % boxesPerRow === 0) {
        xPosition = margin;
        yPosition += boxHeight + spaceBetweenBoxes;
      }
    });

    // Trigger PDF download
    doc.save('weekly_forecast.pdf');
  };

  return (
    <div className="weekly-forecast">
      <div className="input-container">
        {forecastData.map((forecast, index) => (
          <div key={index} className="forecast-entry">
            <input
              type="number"
              placeholder="Temp in °C"
              value={forecast.temp}
              onChange={(e) => handleInputChange(index, 'temp', e.target.value)}
            />
            <input
              type="number"
              placeholder="Precipitation Chance"
              value={forecast.precipitationChance}
              onChange={(e) => handleInputChange(index, 'precipitationChance', e.target.value)}
            />
            <select
              value={forecast.icon}
              onChange={(e) => handleInputChange(index, 'icon', e.target.value)}
            >
              {Object.keys(weatherIcons).map((iconKey) => (
                <option key={iconKey} value={iconKey}>
                  {iconKey.charAt(0).toUpperCase() + iconKey.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button onClick={handleSubmit}>Submit Forecast</button>
      </div>

      {submittedData && (
        <div className="grid-container">
          {submittedData.map((forecast, index) => (
            <div key={index} className="grid-item">
              <div className="forecast-box">
                <p>{forecast.day}</p>
                <p>{forecast.temp}°F</p>
                <p>{forecast.precipitationChance}%</p>
                <img src={weatherIcons[forecast.icon]} alt={forecast.icon} width="40" height="40" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyForecast;
