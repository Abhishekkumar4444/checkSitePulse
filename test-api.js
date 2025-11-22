// Simple test script to verify the API is using real data
// Run with: node test-api.js

const testUrls = [
  'https://www.google.com',
  'https://www.github.com',
  'https://httpstat.us/500', // This should show as down
  'https://httpstat.us/200', // This should show as up
]

async function testAPI() {
  console.log('Testing API with real websites...\n')
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`)
      const response = await fetch('http://localhost:3000/api/check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      
      const data = await response.json()
      console.log(`  Status: ${data.status} ${data.statusText}`)
      console.log(`  Is Down: ${data.isDown}`)
      console.log(`  Response Time: ${data.responseTime}ms`)
      console.log(`  Verified: ${data.verified ? 'Yes ✓' : 'No ✗'}`)
      console.log('')
    } catch (error) {
      console.error(`  Error: ${error.message}\n`)
    }
  }
}

// Wait a bit for server to start, then test
setTimeout(() => {
  testAPI().catch(console.error)
}, 2000)

