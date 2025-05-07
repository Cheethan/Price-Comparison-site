const axios = require('axios');
const fs = require('fs');

const apiKey = "SCRAPER_API_KEY"; 
const searchQuery = "nothing phone 3a";
const targetUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;

async function fetchFlipkartData() {
  try {
    const response = await axios.get("http://api.scraperapi.com", {
      params: {
        api_key: apiKey,
        url: targetUrl,
        country_code: 'us'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    fs.writeFileSync('flipkart_page.html', response.data, 'utf-8');
    console.log("HTML content has been saved to flipkart_page.html");

  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

fetchFlipkartData();
