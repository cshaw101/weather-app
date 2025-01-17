import React from 'react';
import WeeklyForecast from './components/WeeklyForecast';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <h1>Weekly Weather Forecast</h1>
      <WeeklyForecast />
    </div>
  );
};

export default App;
