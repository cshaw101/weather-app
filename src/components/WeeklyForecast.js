import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { weatherIcons } from './weatherIcons';

const WeeklyForecast = () => {
  const [forecastData, setForecastData] = useState([
    { day: 'Monday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Tuesday', temp: '', icon: 'cloudy', precipitationChance: '' },
    { day: 'Wednesday', temp: '', icon: 'rain', precipitationChance: '' },
    { day: 'Thursday', temp: '', icon: 'thunderstorm', precipitationChance: '' },
    { day: 'Friday', temp: '', icon: 'snow', precipitationChance: '' },
    { day: 'Saturday', temp: '', icon: 'fog', precipitationChance: '' },
    { day: 'Sunday', temp: '', icon: 'partlyCloudy', precipitationChance: '' },
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
    const updatedForecastData = forecastData.map((forecast) => ({
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

    let xPosition = 20;
    let yPosition = 40;

    data.forEach((forecast, index) => {
      const { day, temp, icon, precipitationChance } = forecast;

      doc.setDrawColor(0);
      doc.setFillColor(240, 240, 240);
      doc.rect(xPosition, yPosition, 120, 100, 'F');

      // Get icon image URL from the weatherIcons object
      const iconUrl = weatherIcons[icon];

      // Add the weather icon image (ensure your icon source is a proper image URL)
      doc.addImage(iconUrl, 'PNG', xPosition + 40, yPosition + 5, 40, 40);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`${day}`, xPosition + 5, yPosition + 50);
      doc.text(`Temp: ${temp}°F`, xPosition + 5, yPosition + 60);
      doc.text(`Precipitation: ${precipitationChance}%`, xPosition + 5, yPosition + 70);

      xPosition += 140;
      if (index === 4) {
        xPosition = 20;
        yPosition += 120; // Increase space for the second row
      }
    });

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
