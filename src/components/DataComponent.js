import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import './Data.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DataComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

  const fetchData = useCallback(async (field = searchField, term = searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const finalTerm = term.trim() || 'accounts';
      const response = await axios.get(`https://datarecord-backend.onrender.com/data/${field}/${finalTerm}`);

      const result = response.data;
      if (Array.isArray(result)) {
        setData(result.slice(0, 50));
        if (result.length === 0) setError('No records found for this search.');
      } else if (result && typeof result === 'object') {
        // Handle single object response (likely for ID search)
        setData([result]);
      } else {
        setData([]);
        setError('Unexpected data format from server.');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Connection failed. Please ensure backend CORS allows this domain.');
    }
    setLoading(false);
  }, [searchField, searchTerm]);

  useEffect(() => {
    fetchData('all', 'accounts');
  }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Prepare chart data
  const sectorData = {};
  const regionData = {};

  data.forEach(item => {
    if (item.sector) sectorData[item.sector] = (sectorData[item.sector] || 0) + 1;
    if (item.region) regionData[item.region] = (regionData[item.region] || 0) + 1;
  });

  const barChartData = {
    labels: Object.keys(sectorData),
    datasets: [{
      label: 'Records by Sector',
      data: Object.values(sectorData),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1,
    }],
  };

  const pieChartData = {
    labels: Object.keys(regionData),
    datasets: [{
      label: 'Records by Region',
      data: Object.values(regionData),
      backgroundColor: [
        '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4',
      ],
    }],
  };

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="dashboard" id="data-dashboard">
      <h1>Data Visualization Dashboard</h1>

      {/* Search bar */}
      <form className="search-bar" onSubmit={handleSearch} id="search-form">
        <select value={searchField} onChange={(e) => setSearchField(e.target.value)} id="search-field">
          <option value="all">All Fields</option>
          <option value="id">ID</option>
          <option value="sector">Sector</option>
          <option value="region">Region</option>
          <option value="country">Country</option>
          <option value="topics">Topics</option>
          <option value="pest">PEST</option>
          <option value="source">Source</option>
        </select>
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="search-input"
        />
        <button type="submit" id="search-button">Search</button>
      </form>

      {/* Ping backend button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
          onClick={async () => {
            try {
              const res = await fetch('https://datarecord-backend.onrender.com/data/all/accounts');
              const json = await res.json();
              console.log('Backend alive:', json);
              alert('Backend is alive! Check console.');
            } catch (err) {
              console.error(err);
              alert('Backend unreachable!');
            }
          }}
        >
          Ping Backend
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner" id="loading">Loading dynamic data...</div>
      ) : error ? (
        <div className="error-message" id="error">{error}</div>
      ) : (
        <>
          {/* Charts */}
          <div className="charts">
            <div className="chart-box" id="sector-chart">
              <h3>Sector Breakdown</h3>
              <div style={{ flex: 1, position: 'relative' }}>
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    }
                  }}
                />
              </div>
            </div>

            <div className="chart-box" id="region-chart">
              <h3>Regional Distribution</h3>
              <div style={{ flex: 1, position: 'relative' }}>
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                          color: '#94a3b8',
                          padding: 15
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="data-table" id="records-table">
            <div className="table-header">
              <h3>Latest Records ({data.length})</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sector</th>
                  <th>Topic</th>
                  <th>Region</th>
                  <th>Intensity</th>
                  <th>PEST</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => {
                  const itemId = item.id || idx;
                  const isExpanded = expandedId === itemId || (searchField === 'id' && data.length === 1);

                  return (
                    <React.Fragment key={itemId}>
                      <tr id={`record-${itemId}`} className={isExpanded ? 'active-row' : ''}>
                        <td>{item.id || 'N/A'}</td>
                        <td>{item.sector || 'N/A'}</td>
                        <td>{item.topics || 'N/A'}</td>
                        <td>{item.region || 'Global'}</td>
                        <td>
                          <span className="intensity-badge">
                            {item.intensity || 0}
                          </span>
                        </td>
                        <td>{item.pest || 'N/A'}</td>
                        <td>
                          <button
                            className="detail-toggle"
                            onClick={() => toggleExpand(itemId)}
                          >
                            {isExpanded ? 'Hide' : 'Show'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="expanded-row">
                          <td colSpan="7">
                            <div className="details-grid">
                              {Object.entries(item).map(([key, value]) => (
                                <div key={key} className="detail-item">
                                  <strong>{key}:</strong> {value !== null && value !== undefined ? String(value) : 'N/A'}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DataComponent;
