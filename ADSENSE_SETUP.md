# Google AdSense Setup Instructions

## How to Set Up Google AdSense

1. **Get Your AdSense Publisher ID**
   - Sign up for Google AdSense at https://www.google.com/adsense
   - Get your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)

2. **Update the AdSense Client ID**
   - Replace `ca-pub-XXXXXXXXXXXXXXXX` in the following files:
     - `app/layout.tsx` (line 22)
     - `app/components/SidebarAd.tsx` (line 30)
     - `app/page.tsx` (lines 334-335) - Update the slot numbers

3. **Get Ad Slot IDs**
   - In your AdSense account, create ad units
   - Get the ad slot IDs for:
     - Left sidebar ad
     - Right sidebar ad
   - Update the `slot` prop in `app/page.tsx`:
     ```tsx
     <SidebarAd position="left" slot="YOUR_LEFT_SLOT_ID" />
     <SidebarAd position="right" slot="YOUR_RIGHT_SLOT_ID" />
     ```

4. **Ad Placement**
   - Left sidebar: Fixed position on the left side (160px wide, 600px tall)
   - Right sidebar: Fixed position on the right side (160px wide, 600px tall)
   - Ads are hidden on screens smaller than 1400px for better mobile experience

5. **Testing**
   - Use Google AdSense test mode to verify ads are working
   - Check browser console for any AdSense errors

## Important Notes

- Replace all instances of `ca-pub-XXXXXXXXXXXXXXXX` with your actual publisher ID
- Replace slot IDs with your actual ad slot IDs
- Ads will only show on desktop screens (1400px+ width)
- Make sure your AdSense account is approved before going live

