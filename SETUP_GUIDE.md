# Google Search Script - Setup Guide

This guide will walk you through setting up the Google Custom Search API to fetch search results.

## Prerequisites

- Node.js installed (v14 or higher)
- A Google account
- Internet connection

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `axios` - for making HTTP requests to Google API
- `dotenv` - for managing environment variables

### 2. Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Custom Search API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Custom Search API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 3. Create Custom Search Engine

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" to create a new search engine
3. Configure your search engine:
   - **Sites to search**: Enter `www.google.com` initially
   - **Name**: Give it any name (e.g., "My Search Engine")
4. After creation, click on your search engine
5. Go to "Setup" > "Basic" tab
6. Turn ON "Search the entire web"
7. Copy your **Search Engine ID** (looks like: `a1b2c3d4e5f6g7h8i`)

### 4. Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:

```
GOOGLE_API_KEY=your_actual_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_actual_search_engine_id_here
```

### 5. Run the Script

```bash
npm start
```

Or directly:

```bash
node google-search.js
```

## Expected Output

The script will:
1. Make 3 API requests (10 results each) to get 30 total results
2. Display results in the console with:
   - Rank number
   - Title
   - URL
   - Snippet/description
3. Save results to `search-results.json`

## Important Notes

### API Limits

- **Free tier**: 100 queries per day
- **Max results per query**: 10
- **Total results available**: Up to 100 per search query

### Rate Limiting

The script includes a 1-second delay between requests to avoid rate limiting issues.

### Location Targeting

The script uses these parameters for Hong Kong location:
- `gl=hk` - Geographic location (Hong Kong)
- `cr=countryHK` - Country restrict to Hong Kong
- Query includes "Hong Kong" in the search term

## Troubleshooting

### Error: 400 Bad Request
- Check if your API key is correct
- Check if your Search Engine ID is correct
- Ensure Custom Search API is enabled

### Error: 429 Too Many Requests
- You've exceeded your daily quota (100 free queries)
- Wait until the next day or upgrade your plan

### No Results Returned
- Check your search query
- Ensure "Search the entire web" is enabled in your search engine settings
- Try a different search term

### SSL/Network Errors
- Check your internet connection
- Verify you can access google.com
- Check if you're behind a proxy/firewall

## Alternative: Using Third-Party Services

If you prefer not to set up Google API, you can use these alternatives:

### Option 1: SerpAPI (Easier Setup)
- Website: https://serpapi.com/
- Free tier: 100 searches/month
- Easier to use, no custom search engine needed

### Option 2: Serper API
- Website: https://serper.dev/
- Free tier: 2,500 searches
- Very fast and reliable

Let me know if you'd like a script for either of these alternatives!

## Cost Considerations

- **Free tier**: 100 queries/day (sufficient for testing)
- **Paid tier**: $5 per 1,000 queries if you need more
- Each run of this script uses 3 queries (to get 30 results)

## Support

For more information:
- [Custom Search JSON API Documentation](https://developers.google.com/custom-search/v1/overview)
- [API Reference](https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list)

