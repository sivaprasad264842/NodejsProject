const cryptoList = document.getElementById("cryptoList");

async function fetchCryptos() {
  try {
    const response = await fetch("/api/cryptos");
    const data = await response.json();

    data.forEach((crypto) => {
      const cryptoCard = document.createElement("div");
      cryptoCard.className = "cryptoCard";
      cryptoCard.innerHTML = `
        <h2>${crypto.name}</h2>
        <p>Last: $${crypto.last}</p>
        <p>Buy: $${crypto.buy}</p>
        <p>Sell: $${crypto.sell}</p>
        <p>Volume: ${crypto.volume}</p>
        <p>Base Unit: ${crypto.base_unit}</p>
      `;
      cryptoList.appendChild(cryptoCard);
    });
  } catch (error) {
    console.error("Error fetching cryptocurrency data", error);
  }
}

fetchCryptos();
