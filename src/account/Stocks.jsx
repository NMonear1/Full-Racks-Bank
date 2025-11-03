import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API || "";


function Stocks() {
  const [symbols, setSymbols] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbols.trim()) return alert("Please enter at least one symbol");

    setLoading(true);
    try {
      // Use a relative URL so it works in both dev and production
      console.log("API_BASE_URL:", API_BASE_URL);
      const res = await fetch(`${API_BASE_URL}/stocks/${symbols}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      // StockData.org wraps data in { data: [...] }
      setStocks(data.data || []);
    } catch (err) {
      console.error("Error fetching stock data:", err);
      alert("Error fetching stock data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Stocks</h1>
      <h2>Check a Stock Price</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
          placeholder="Enter stock symbol(s), e.g. AAPL,TSLA"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Stock Price"}
        </button>
      </form>

      {stocks.length > 0 && (
        <div>
          <h3>Stock Data:</h3>
          <ul>
            {stocks.map((stock) => (
              <li key={stock.ticker}>
                {stock.ticker}: ${stock.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Stocks;
