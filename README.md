# CheckSitePulse

A Next.js application that checks if websites are down or experiencing issues in real-time. Features a search functionality and displays the status of 5 popular websites by default.

## Features

- 🔍 Search any website to check its status
- 📊 Default display of 5 popular websites (Google, GitHub, Twitter, Facebook, ChatGPT)
- ⚡ Real-time status checking with response times
- 🎨 Modern, responsive UI with gradient design
- 🔄 Refresh functionality to update all statuses

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Search a Website**: Enter any website URL in the search box (with or without https://) and click "Check Status"
2. **View Popular Sites**: The default view shows the status of 5 popular websites
3. **Refresh Status**: Click "Refresh All" to update the status of all popular websites

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules

## API Endpoint

The application includes an API route at `/api/check-status` that accepts POST requests with a JSON body containing a `url` field.

## Notes

- Website status checks use HEAD requests with a 10-second timeout
- Status codes 500+ are considered "down"
- Network errors and timeouts are also considered "down"

