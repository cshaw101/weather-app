import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { weatherIcons } from './weatherIcons';

const Forecast = ({ day, temp, icon, precipitationChance }) => {
  return (
    <div className="forecast">
      <div className="day">{day}</div>
      <div className="temp">{temp}°C</div>
      <div className="icon">
        <FontAwesomeIcon icon={weatherIcons[icon]} size="4x" />
      </div>
      <div className="precipitation">Chance of Precipitation: {precipitationChance}%</div>
    </div>
  );
};

export default Forecast;
