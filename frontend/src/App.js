import React, { useState } from "react";
import axios from "axios";
const { POST_QUERY } = require("../src/api/search");
const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(POST_QUERY, { query });
      console.log("------>", response.data);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Enter your search query"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {results.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
