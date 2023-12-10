import express from "express";
import pkg from "pg";
import fetch from "node-fetch";

const { Pool } = pkg;
const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "siva",
  port: 1111,
});

const wazirxApiUrl = "https://api.wazirx.com/api/v2/tickers";

const fetchDataFromWazirX = async () => {
  try {
    const response = await fetch(wazirxApiUrl);
    const data = await response.json();

    const dataArray = Array.isArray(data) ? data : Object.values(data);

    const cryptos = dataArray.map((item) => ({
      name: item.name,
      last: parseFloat(item.last),
      buy: parseFloat(item.buy),
      sell: parseFloat(item.sell),
      volume: parseFloat(item.volume),
      base_unit: item.baseAsset,
    }));

    await Promise.all(
      cryptos.map((crypto) =>
        pool.query(
          "INSERT INTO cryptos (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)",
          Object.values(crypto)
        )
      )
    );

    console.log("Data successfully fetched and stored in the database.");
  } catch (error) {
    console.error("Error fetching data from WazirX API", error);
  }
};
app.use(express.static("public"));

app.get("/api/cryptos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cryptos LIMIT 10");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Fetch data from WazirX API and store it in the database on server startup
fetchDataFromWazirX();
