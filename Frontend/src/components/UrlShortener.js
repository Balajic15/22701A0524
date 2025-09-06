import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useLogging } from '../logging/LoggingContext';

function UrlShortener() {
  const [url, setUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { log } = useLogging();

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    if (!url || !/^https?:\/\//.test(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    if (validity && (isNaN(validity) || Number(validity) <= 0)) {
      setError('Validity must be a positive number (minutes)');
      return;
    }

    log('Submitting URL shortening request', { url, validity, shortcode });

    try {
      const response = await fetch('http://localhost:3000/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          validity: validity ? Number(validity) : 30,
          shortcode: shortcode || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || `Request failed with status ${response.status}`);
        log('Shorten error', data.error || response.statusText);
        return;
      }

      const data = await response.json();
      setResult(data);
      log('Shorten success', data);

    } catch (err) {
      setError('Could not connect to backend. Is it running on port 3000?');
      log('Shorten error', err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Shorten a URL</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Original URL"
        fullWidth
        margin="normal"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <TextField
        label="Validity (minutes, optional)"
        fullWidth
        margin="normal"
        type="number"
        value={validity}
        onChange={(e) => setValidity(e.target.value)}
      />
      <TextField
        label="Custom Shortcode (optional)"
        fullWidth
        margin="normal"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Shorten
      </Button>

      {result && (
        <Box mt={3}>
          <Alert severity="success">
            Shortened URL:{" "}
            <a href={result.shortLink} target="_blank" rel="noreferrer">
              {result.shortLink}
            </a>
            <br />
            Expiry: {result.expiry ? new Date(result.expiry).toLocaleString() : 'No expiry'}
          </Alert>
        </Box>
      )}
    </Box>
  );
}

export default UrlShortener;
