import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { TextField, MenuItem, Select, Button, Grid, Typography, Paper, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // Deep blue for primary accents
    },
    secondary: {
      main: '#FF7043', // Light coral for secondary accents
    },
    background: {
      default: '#E3F2FD', // Sky blue background color
    },
    text: {
      primary: '#212121', // Dark text for contrast
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h4: {
      fontSize: '2.2rem',
      fontWeight: 700,
      color: '#1976D2',
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#FF7043',
    },
  },
});

const weatherIcons = {
  sunny: './images/sun.png',  // Sunny icon (Example) yes 
  cloudy: './images/cloudy.png', // Cloudy icon (Example) yes
  rain: './images/heavy-rain.png',   // Rain icon (Example) yes
  thunderstorm: './images/storm.png', // Thunderstorm icon yes
  snow: './images/snow.png',  // Snow icon (Example) yes
  partlyCloudy: './images/cloudy.png', // Partly Cloudy icon
};


const WeeklyForecast = () => {
  const [forecastData, setForecastData] = useState([
    { day: 'Tuesday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Wednesday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Thursday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Friday', temp: '', icon: 'sunny', precipitationChance: '' },
    { day: 'Saturday', temp: '', icon: 'sunny', precipitationChance: '' },
  ]);
  const [submittedData, setSubmittedData] = useState(null);

  const convertToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;
  const convertToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

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
    // Create the jsPDF document with landscape orientation
    const doc = new jsPDF('l', 'mm', 'a4');  // 'l' is for landscape, 'mm' is for millimeters, 'a4' is the page size
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.text('Weekly Weather Forecast', 20, 20);
  
    const margin = 10;
    const spaceBetweenBoxes = 10;
    const boxesPerRow = 5;
    const maxWidth = doc.internal.pageSize.width - 2 * margin; // Total width available on the page
  
    // Dynamically calculate box width to fit the page (considering space between boxes)
    const boxWidth = (maxWidth - (boxesPerRow - 1) * spaceBetweenBoxes) / boxesPerRow;
    const boxHeight = 80; // Reduced height to make boxes more compact
  
    let xPosition = margin;
    let yPosition = 40;
  
    data.forEach((forecast, index) => {
      const { day, temp, icon, precipitationChance } = forecast;
  
      // Draw background box for each day with a border for the divider
      doc.setDrawColor(0);
      doc.setFillColor(240, 240, 240); // Light gray background
      doc.rect(xPosition, yPosition, boxWidth, boxHeight, 'F'); // Background fill
  
      // Draw a divider (border) around the box
      doc.setDrawColor(0); // Black color for the border
      doc.rect(xPosition, yPosition, boxWidth, boxHeight); // Border around each box
  
      // Add the weather icon (scaled to fit inside the box)
      const iconUrl = weatherIcons[icon];
      if (iconUrl) {
        doc.addImage(iconUrl, 'PNG', xPosition + 5, yPosition + 5, boxWidth - 10, boxWidth - 10); // Adjust icon size to fit inside box
      }
  
      // Add text (Day, Temperature, Precipitation Chance)
      doc.setFontSize(12);
      doc.setTextColor(0); // Black text color
      doc.text(day, xPosition + 5, yPosition + boxWidth + 5);
      doc.text(`${convertToCelsius(temp)}°C / ${temp}°F`, xPosition + 5, yPosition + boxWidth + 15);
      doc.text(`Precip: ${precipitationChance}%`, xPosition + 5, yPosition + boxWidth + 25);
  
      // Move to next box position
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
    <ThemeProvider theme={theme}>
      <div className="weekly-forecast">
        <Box sx={{ padding: 3, background: 'linear-gradient(135deg, #1E88E5, #0288D1)', borderRadius: 2, boxShadow: 5 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#fff' }}>
            Weekly Weather Forecast Input
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {forecastData.map((forecast, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper sx={{ padding: 3, backgroundColor: '#FFF8E1', borderRadius: 3, boxShadow: 5, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {forecast.day}
                  </Typography>

                  <TextField
                    label="Temperature (°F)"
                    type="number"
                    fullWidth
                    value={forecast.temp}
                    onChange={(e) => handleInputChange(index, 'temp', e.target.value)}
                    margin="normal"
                    sx={{
                      '& .MuiInputBase-root': {
                        backgroundColor: '#e3f2fd',
                      },
                    }}
                  />

                  <TextField
                    label="Precipitation Chance (%)"
                    type="number"
                    fullWidth
                    value={forecast.precipitationChance}
                    onChange={(e) => handleInputChange(index, 'precipitationChance', e.target.value)}
                    margin="normal"
                    sx={{
                      '& .MuiInputBase-root': {
                        backgroundColor: '#e3f2fd',
                      },
                    }}
                  />

                  <Select
                    fullWidth
                    value={forecast.icon}
                    onChange={(e) => handleInputChange(index, 'icon', e.target.value)}
                    displayEmpty
                    sx={{
                      marginTop: 2,
                      backgroundColor: '#e3f2fd',
                      borderRadius: 1,
                      '& .MuiSelect-select': {
                        padding: '10px',
                      },
                    }}
                  >
                    {Object.keys(weatherIcons).map((iconKey) => (
                      <MenuItem key={iconKey} value={iconKey}>
                        {iconKey.charAt(0).toUpperCase() + iconKey.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 3, padding: '12px', borderRadius: '25px', boxShadow: 3 }}
            onClick={handleSubmit}
          >
            Submit Forecast
          </Button>
        </Box>

        {submittedData && (
          <div className="submitted-data" style={{ marginTop: '40px' }}>
            <Grid container spacing={4} justifyContent="center">
              {submittedData.map((forecast, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper sx={{ padding: 3, backgroundColor: '#FFF8E1', borderRadius: 3, boxShadow: 5, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {forecast.day}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {forecast.temp}°F / {convertToCelsius(forecast.temp)}°C
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Precipitation: {forecast.precipitationChance}%
                    </Typography>
                    <img
                      src={weatherIcons[forecast.icon]}
                      alt={forecast.icon}
                      width="50"
                      height="50"
                      style={{ marginTop: '10px' }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default WeeklyForecast;
