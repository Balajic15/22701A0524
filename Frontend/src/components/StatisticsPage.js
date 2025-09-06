import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useLogging } from '../logging/LoggingContext';

function StatisticsPage() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);
  const { log } = useLogging();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stats');
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(data.error || 'Failed to fetch statistics');
          log('Stats error', data.error || response.statusText);
          return;
        }

        setUrls(data);
        log('Fetched statistics', data);
      } catch (err) {
        setError('Could not connect to backend. Is it running on port 3000?');
        log('Stats error', err.message);
      }
    };

    fetchData();
  }, [log]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && urls.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Last Click</TableCell>
                <TableCell>Source</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((u, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <a href={u.shortLink} target="_blank" rel="noreferrer">
                      {u.shortLink}
                    </a>
                  </TableCell>
                  <TableCell>{u.originalUrl}</TableCell>
                  <TableCell>{u.expiry || 'No expiry'}</TableCell>
                  <TableCell>{u.totalClicks || 0}</TableCell>
                  <TableCell>
                    {u.clicks?.length > 0
                      ? u.clicks[u.clicks.length - 1].timestamp
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {u.clicks?.length > 0
                      ? u.clicks[u.clicks.length - 1].referrer
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default StatisticsPage;
