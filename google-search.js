/**
 * Google Search Script - Get First 30 Results
 * 
 * This script uses Google Custom Search API to fetch search results
 * for "Interior Design Company" in Hong Kong
 * 
 * Setup Required:
 * 1. Get Google API Key from: https://console.cloud.google.com/apis/credentials
 * 2. Create Custom Search Engine at: https://programmablesearchengine.google.com/
 * 3. Enable "Search the entire web" in your search engine settings
 * 4. Install dependencies: npm install axios dotenv
 */

const axios = require('axios');
require('dotenv').config();

// Configuration
const API_KEY = process.env.GOOGLE_API_KEY || 'YOUR_API_KEY_HERE';
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || 'YOUR_SEARCH_ENGINE_ID_HERE';
const SEARCH_QUERY = 'Interior Design Company';
const LOCATION = 'Hong Kong';
const NUM_RESULTS = 30;

/**
 * Fetch Google search results
 * Note: Google Custom Search API returns max 10 results per request
 * We need to make multiple requests to get 30 results
 */
async function getGoogleSearchResults() {
  try {
    console.log('🔍 Starting Google Search...');
    console.log(`Query: "${SEARCH_QUERY}"`);
    console.log(`Location: ${LOCATION}`);
    console.log(`Fetching ${NUM_RESULTS} results...\n`);

    const allResults = [];
    const resultsPerPage = 10; // Google API max per request
    const numRequests = Math.ceil(NUM_RESULTS / resultsPerPage);

    // Make multiple requests to get all 30 results
    for (let i = 0; i < numRequests; i++) {
      const startIndex = (i * resultsPerPage) + 1;
      
      console.log(`📡 Fetching results ${startIndex}-${Math.min(startIndex + resultsPerPage - 1, NUM_RESULTS)}...`);

      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: API_KEY,
          cx: SEARCH_ENGINE_ID,
          q: `${SEARCH_QUERY} ${LOCATION}`,
          start: startIndex,
          num: resultsPerPage,
          gl: 'hk', // Country code for Hong Kong
          cr: 'countryHK', // Restrict to Hong Kong
        }
      });

      if (response.data.items) {
        allResults.push(...response.data.items);
        console.log(`✅ Retrieved ${response.data.items.length} results\n`);
      } else {
        console.log(`⚠️  No more results available\n`);
        break;
      }

      // Add delay to respect rate limits
      if (i < numRequests - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Format and display results
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 SEARCH RESULTS (${allResults.length} total)`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    allResults.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.title}`);
      console.log(`   URL: ${item.link}`);
      console.log(`   Snippet: ${item.snippet}`);
      console.log('   ' + '─'.repeat(60));
    });

    // Save results to JSON file
    const fs = require('fs');
    const outputData = {
      query: SEARCH_QUERY,
      location: LOCATION,
      timestamp: new Date().toISOString(),
      totalResults: allResults.length,
      results: allResults.map((item, index) => ({
        rank: index + 1,
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink
      }))
    };

    fs.writeFileSync('search-results.json', JSON.stringify(outputData, null, 2));
    console.log('\n\n💾 Results saved to: search-results.json');

    return allResults;

  } catch (error) {
    console.error('❌ Error fetching search results:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.error?.message || 'Unknown error'}`);
      
      if (error.response.status === 400) {
        console.error('\n💡 Tips:');
        console.error('- Check if your API key is correct');
        console.error('- Check if your Search Engine ID is correct');
        console.error('- Make sure Custom Search API is enabled in Google Cloud Console');
      } else if (error.response.status === 429) {
        console.error('\n💡 Rate limit exceeded. You may have hit your daily quota.');
      }
    } else {
      console.error(error.message);
    }
    
    throw error;
  }
}

// Run the search
if (require.main === module) {
  getGoogleSearchResults()
    .then(() => {
      console.log('\n✨ Search completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Search failed');
      process.exit(1);
    });
}

module.exports = { getGoogleSearchResults };

