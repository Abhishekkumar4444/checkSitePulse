import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Normalize URL - add https:// if no protocol
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    // Remove trailing slash
    normalizedUrl = normalizedUrl.replace(/\/$/, '')

    // Validate URL format
    try {
      new URL(normalizedUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const startTime = Date.now()
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      // Make real HTTP request - try GET first as some sites block HEAD requests
      let response: Response
      try {
        // Try GET request first (more reliable for sites like Twitter)
        response = await fetch(normalizedUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          redirect: 'follow',
          cache: 'no-store',
        })
      } catch (getError) {
        // If GET fails, try HEAD request as fallback
        try {
          response = await fetch(normalizedUrl, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': '*/*',
            },
            redirect: 'follow',
            cache: 'no-store',
          })
        } catch (headError) {
          throw getError // Throw original error if both fail
        }
      }

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime

      // Consider site down only if status is 500+ (server errors)
      // 4xx errors (403, 404, 429, etc.) mean the site is up but blocking/not found
      // 3xx redirects mean the site is up and redirecting
      // 2xx means the site is up
      const isDown = response.status >= 500
      
      return NextResponse.json({
        url: normalizedUrl,
        status: response.status,
        statusText: response.statusText || 'Unknown',
        isDown,
        responseTime,
        timestamp: new Date().toISOString(),
        verified: true, // Flag to indicate this is real data
      })
    } catch (error: any) {
      const responseTime = Date.now() - startTime
      
      // Network errors, timeouts, DNS failures, etc. indicate the site is down
      const errorType = error.name === 'AbortError' 
        ? 'Timeout' 
        : error.message?.includes('fetch failed') 
        ? 'Network Error' 
        : 'Connection Error'
      
      return NextResponse.json({
        url: normalizedUrl,
        status: 0,
        statusText: errorType,
        isDown: true,
        responseTime,
        timestamp: new Date().toISOString(),
        error: error.message || 'Failed to connect',
        verified: true, // Flag to indicate this is real data
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to check website status' },
      { status: 500 }
    )
  }
}

