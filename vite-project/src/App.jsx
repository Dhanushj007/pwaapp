import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("IBM"); // Default stock
  const [input, setInput] = useState("");

  const API_KEY = "JZX2TIB1CCVMWDDO"; 

  // Function to fetch data
  const fetchStock = (stockSymbol) => {
    setLoading(true);
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`)
      .then((res) => res.json())
      .then((json) => {
        if (json["Global Quote"]) {
          setData(json["Global Quote"]);
        } else {
          alert("Stock not found or API limit reached!");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  // Fetch default stock on load
  useEffect(() => {
    fetchStock(symbol);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input) {
      fetchStock(input.toUpperCase());
      setInput(""); // Clear input
    }
  };

  return (
    <div className="pwa-container">
      <header className="app-header">
        <div className="logo-circle">📊</div>
        <h1>Finance Tracker</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Search Symbol (e.g. AAPL)" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <main className="content">
        {loading ? (
          <div className="loader">Updating Market Data...</div>
        ) : (
          <div className="stock-card">
            <p className="symbol">{data?.["01. symbol"] || "No Data"}</p>
            <div className="price-section">
              <span className="price">
                ${data?.["05. price"] ? parseFloat(data["05. price"]).toFixed(2) : "0.00"}
              </span>
              <span className={`change ${parseFloat(data?.["09. change"]) >= 0 ? 'up' : 'down'}`}>
                {data?.["10. change percent"] || "0%"}
              </span>
            </div>
            <div className="details-grid">
              <div><small>High</small><p>{data?.["03. high"] || "-"}</p></div>
              <div><small>Low</small><p>{data?.["04. low"] || "-"}</p></div>
              <div><small>Volume</small><p>{data?.["06. volume"] || "-"}</p></div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer-nav">
        <button className="nav-btn">Home</button>
        <button className="nav-btn">Watchlist</button>
        <button className="nav-btn">News</button>
      </footer>
    </div>
  );
}

export default App;