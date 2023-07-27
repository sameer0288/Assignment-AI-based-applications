const axios = require("axios");
const scrapingbee = require("scrapingbee");
const apiKey = "AIzaSyAgoFKSMlwtOU8zFqzShhaE7QbqAWpeVko"; // Replace 'YOUR_GOOGLE_CUSTOM_SEARCH_API_KEY' with your actual API key
const scrapingBeeApiKey =
  "P5IS953T7OYL5KJG8J3SVPAV5VUJ49L2OXB7HIQDVL8SSG7O9A3J6DQ6CTK65KEAM7L7MQJIEW20ZOCP"; // Replace 'YOUR_SCRAPING_BEE_API_KEY' with your actual API key

const searchEngineId = "b46ca51d4f2f84d05"; // Replace with your Custom Search Engine ID
const numResults = 5; // Number of results to retrieve

// Function to get top 5 URLs from Google Custom Search API

async function getTop5Urls(query) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: apiKey,
          cx: searchEngineId,
          q: query,
          num: numResults,
        },
      }
    );

    if (response.data && response.data.items) {
      // Extract URLs from the API response
      const top5Urls = response.data.items.map((item) => item.link);
      console.log("top5Urls", top5Urls);
      return top5Urls;
    } else {
      throw new Error("No items found in the API response.");
    }
  } catch (error) {
    console.error("Error fetching data from Custom Search API:", error.message);
    throw error;
  }
}

// Function to scrape text content from a URL using ScrapingBee API

var extract_rules = {
  title: "body",
};

async function scrapeTextFromUrl(url) {
  var client = new scrapingbee.ScrapingBeeClient(scrapingBeeApiKey);
  var response = await client.get({
    url: url,
    params: {
      block_ads: "true",
      premium_proxy: "true",
      stealth_proxy: "true",
      extract_rules: extract_rules,
      json_response: "true",
      country_code: "us",
    },
  });
  return response;
}

// Handler for the /api/search endpoint
async function search(req, res) {
  try {
    const { query } = req.body;

    // Get top 5 URLs from Custom Search API
    const top5Urls = await getTop5Urls(query);

    // Scrape text from each URL using ScrapingBee API
    const scrapedTextData = await Promise.all(
      top5Urls.map((url) =>
        scrapeTextFromUrl(url).then(function (response) {
          var decoder = new TextDecoder();
          var text = decoder.decode(response.data);
          console.log(text);
          return text;
        })
      )
    );

    res.json(scrapedTextData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  search,
};
