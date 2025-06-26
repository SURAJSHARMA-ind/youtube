# YouTube Live Music Search

A React application that searches for videos on YouTube with infinite scrolling, hover effects, and responsive design.

## Features

- ♾️ Infinite scroll loading
- 🖱️ Hover effects with card scaling
- ⏱️ Video duration display
- 👁️ View count and publish date
- 🔴 Live broadcast indicators
- 🖼️ Channel logos and thumbnails

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A YouTube Data API key from Google Cloud Console

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd youtube
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Get YouTube Data API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### 4. Environment Setup

Create a `.env` file in the root directory:


Add your YouTube API key to the `.env` file:

```env
VITE_API_KEY=your_youtube_api_key_here
```


### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).


### Customizing Search Parameters

You can modify the search behavior by editing the constants in `App.jsx`:

```javascript
const SEARCH_QUERY = "live music";  // Change search term
const MAX_RESULTS = 20;             // Results per API call
```

