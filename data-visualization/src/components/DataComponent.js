import React, { useState } from 'react';
import axios from 'axios';
import './Data.css';

const DataComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchField, setSearchField] = useState('All'); 

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSearchField(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://data-record-n9bn.onrender.com/Data/${searchField}/${searchTerm}`);
      setSearchResults(response.data);
      console.log(setSearchResults);
    } catch (error) {
      console.error('Error fetching data:',error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div className="data-search">
      <h2>Data Search</h2>
      <form className='form1' onSubmit={handleSubmit}>
        <select value={searchField} onChange={handleSelectChange}>
          <option value="All">All</option>
          <option value="endYear">End Year</option>
          <option value="topics">Topics</option>
          <option value="sector">Sector</option>
          <option value="region">Region</option>
          <option value="pest">Pest</option>
          <option value="source">Source</option>
          <option value="swot">SWOT</option>
          <option value="country">Country</option>
          <option value="city">City</option>
        </select>
        <input
          type="text"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>

      <div className="search-results">
        <h3 className="results">Search Results:</h3>
        <ul className='cells'>
          {Array.isArray(searchResults)&&searchResults.map(record => (
            <li className="cell" key={record.id}>
              <p>ID: {record.id}</p>
              <p>Intensity:{record.intensity}</p>
              <p>likelihood:{record.likelihood}</p>
              <p>relevance:{record.relevance}</p>
              <p>country:{record.country}</p>
              <p>topics:{record.topics}</p>
              <p>region:{record.region}</p>
              <p>city:{record.city}</p>
              <p>sector:{record.sector}</p>
              <p>pest:{record.pest}</p>
              <p>source:{record.source}</p>
              <p>swot:{record.swot}</p>
              <p>startYear:{record.startYear}</p>
              <p>endYear:{record.endYear}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default DataComponent;
