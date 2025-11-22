# AdSense Account Verification Guide

## How to Verify Your AdSense Account Status

### Step 1: Check Account Approval Status

1. **Log into Google AdSense**
   - Go to https://www.google.com/adsense
   - Sign in with your Google account

2. **Check Account Status**
   - Look at the top of your AdSense dashboard
   - You should see one of these statuses:
     - ✅ **"Ready"** or **"Active"** - Account is approved and ads can show
     - ⏳ **"Getting ready"** - Account is under review (can take 1-14 days)
     - ❌ **"Needs attention"** - Account has issues that need to be fixed
     - 🚫 **"Disabled"** - Account has been disabled

3. **Check Payment Status**
   - Go to **Payments** → **Payment settings**
   - Ensure your payment information is set up
   - Account must be fully set up to show ads

### Step 2: Verify Ad Units Are Created

1. **Check Ad Units**
   - Go to **Ads** → **Ad units** in your AdSense dashboard
   - You should see your ad units listed with their slot IDs
   - Each ad unit should have a status:
     - ✅ **"Active"** - Ready to show ads
     - ⏳ **"Getting ready"** - Still being reviewed
     - ❌ **"Needs attention"** - Has issues

2. **Verify Slot IDs**
   - Click on each ad unit to see its details
   - Copy the **Ad unit ID** (format: `1234567890`)
   - Compare with the slot IDs in your code:
     - `app/components/AdSense.tsx` (line 73)
     - `app/components/SidebarAd.tsx` (line 76)
     - `app/page.tsx` (lines 334-335)

### Step 3: Verify Site is Added to AdSense

1. **Check Sites**
   - Go to **Sites** in your AdSense dashboard
   - Your website domain should be listed
   - Status should be **"Ready"** or **"Active"**

2. **Add Site if Missing**
   - Click **Add site**
   - Enter your domain (e.g., `yourdomain.com`)
   - Wait for verification (can take a few hours)

### Step 4: Check Policy Compliance

1. **Review Policy Status**
   - Go to **Account** → **Policy center**
   - Check for any policy violations
   - All violations must be resolved before ads show

2. **Common Policy Issues**
   - Insufficient content
   - Copyright violations
   - Invalid traffic
   - Misrepresentation

### Step 5: Test Ads in Browser

1. **Check Browser Console**
   - Open your website
   - Press `F12` to open Developer Tools
   - Go to **Console** tab
   - Look for AdSense-related messages:
     - ✅ `adsbygoogle.push()` executed - Ad initialization successful
     - ❌ Errors about invalid slot IDs
     - ❌ Errors about account not approved

2. **Check Network Tab**
   - In Developer Tools, go to **Network** tab
   - Filter by "adsbygoogle" or "googlesyndication"
   - You should see requests to Google's ad servers
   - Status should be `200 OK`

3. **Inspect Ad Elements**
   - Right-click on where ads should appear
   - Select **Inspect**
   - Look for `<ins class="adsbygoogle">` elements
   - Check the `data-adsbygoogle-status` attribute:
     - `"done"` - Ad loaded successfully
     - `"unfilled"` - No ad available (common for new accounts)
     - `"error"` - Ad failed to load

### Step 6: Use AdSense Test Mode

1. **Enable Test Mode**
   - Add `?google_force_console=1` to your URL
   - Example: `https://yourdomain.com?google_force_console=1`
   - This shows AdSense diagnostic information

2. **Check Test Console**
   - Look for a console panel showing ad information
   - It will tell you if ads are configured correctly
   - Shows any errors or warnings

## Common Issues and Solutions

### Issue: Ads Not Showing

**Possible Causes:**
1. Account not approved yet
   - **Solution:** Wait for approval (1-14 days typically)

2. Invalid slot ID
   - **Solution:** Verify slot IDs match your AdSense account

3. Site not verified
   - **Solution:** Add and verify your site in AdSense

4. Ad blockers enabled
   - **Solution:** Disable ad blockers for testing

5. Policy violations
   - **Solution:** Fix policy issues in AdSense dashboard

### Issue: "Unfilled" Status

**Meaning:** AdSense has no ads to show for that slot/region
- This is normal for new accounts
- Ads will show once Google has inventory
- Can take a few days to weeks

### Issue: Script Not Loading

**Check:**
1. Verify script URL in `app/layout.tsx` is correct
2. Check browser console for script loading errors
3. Ensure no content security policy is blocking it

## Quick Verification Checklist

- [ ] AdSense account status is "Ready" or "Active"
- [ ] Payment information is set up
- [ ] Ad units are created and active
- [ ] Slot IDs in code match AdSense dashboard
- [ ] Website is added to AdSense sites
- [ ] No policy violations
- [ ] AdSense script loads (check Network tab)
- [ ] Ad elements exist in DOM (check Inspect)
- [ ] No console errors related to AdSense

## Testing Your Setup

Run this in your browser console to check AdSense status:

```javascript
// Check if AdSense script loaded
console.log('AdSense loaded:', typeof window.adsbygoogle !== 'undefined');

// Check ad elements
const adElements = document.querySelectorAll('.adsbygoogle');
console.log('Ad elements found:', adElements.length);
adElements.forEach((el, i) => {
  console.log(`Ad ${i + 1}:`, {
    slot: el.getAttribute('data-ad-slot'),
    status: el.getAttribute('data-adsbygoogle-status'),
    client: el.getAttribute('data-ad-client')
  });
});
```

## Need Help?

- **AdSense Help Center:** https://support.google.com/adsense
- **AdSense Community:** https://support.google.com/adsense/community
- **Check your site:** Use Google's AdSense diagnostic tools in your dashboard

