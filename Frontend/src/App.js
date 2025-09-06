import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import UrlShortener from './components/UrlShortener';
import StatisticsPage from './components/StatisticsPage';
import { LoggingProvider } from './logging/LoggingContext';

function App() {
  return (
    <LoggingProvider>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              AffordMed URL Shortener
            </Typography>
            <Button color="inherit" component={Link} to="/">Shorten URL</Button>
            <Button color="inherit" component={Link} to="/stats">Statistics</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/stats" element={<StatisticsPage />} />
          </Routes>
        </Container>
      </Router>
    </LoggingProvider>
  );
}

export default App;
