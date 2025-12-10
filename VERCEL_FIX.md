# Vercel Deployment Fix Guide

## Issues Fixed

### 1. ❌ Client Component with Metadata
**Problem**: `app/[slug]/page.js` is a client component ("use client") but tried to use metadata exports
**Solution**: Disabled metadata.js for now. Client components cannot export metadata.

### 2. ❌ Hardcoded URLs in Metadata
**Problem**: Using hardcoded "https://mangaara.com" in metadata causes issues
**Solution**: Use `metadataBase` and environment variables

### 3. ❌ Build-time API Calls
**Problem**: Some functions might fail during build if API is not accessible
**Solution**: Use ISR with revalidation instead of build-time static generation

## Quick Fix Steps

### Step 1: Add Environment Variables to Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables for **Production**:

```
NEXT_PUBLIC_API_URL=https://manga.cipacmeeting.com
NEXT_PUBLIC_API_BASE_URL=https://manga.cipacmeeting.com/api
NEXT_PUBLIC_SITE_URL=https://your-actual-vercel-domain.vercel.app
```

**Important**: Replace `https://your-actual-vercel-domain.vercel.app` with your actual Vercel domain (e.g., `https://manga-40gu33d5k-polawat-huangs-projects.vercel.app`)

### Step 2: Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click on the latest deployment
3. Click "Redeploy" button
4. Select "Use existing Build Cache" → No (force fresh build)

### Step 3: Monitor Build Logs

Watch for these potential errors:
- ✅ No metadata export errors
- ✅ No URL parsing errors
- ✅ No API fetch failures during build

## Common Vercel Deployment Issues

### Issue: Build Timeout
**Symptom**: Build takes >10 minutes and times out
**Solution**: 
- Reduce static page generation
- Use ISR instead of SSG
- Already implemented with `next: { revalidate: 60 }`

### Issue: API Not Accessible During Build
**Symptom**: "Failed to fetch" errors during build
**Solution**:
- We're using ISR, so pages are generated on first request
- Build will succeed even if API is down

### Issue: Environment Variables Not Working
**Symptom**: Metadata shows undefined or localhost URLs
**Solution**:
- Ensure variables are added to Vercel dashboard
- Redeploy after adding variables
- Check variable names (must start with NEXT_PUBLIC_ for client-side)

### Issue: Deployment Loop
**Symptom**: Vercel keeps redeploying automatically
**Solution**:
- Check Git hooks settings in Vercel
- Disable auto-deploy if needed
- Check for file changes triggering rebuilds

## SEO Considerations with Client Component

### Current Limitation
The `app/[slug]/page.js` is a **client component**, which means:
- ❌ Cannot export metadata
- ❌ Cannot use generateMetadata()
- ❌ SEO is limited to layout.js metadata

### To Get Full SEO for Manga Pages (Optional)

If you want full SEO metadata for individual manga pages:

1. **Rename current file**:
   ```bash
   mv app/[slug]/page.js app/[slug]/page-client.js.backup
   ```

2. **Use the server component version**:
   ```bash
   mv app/[slug]/page-server.js app/[slug]/page.js
   ```

3. **Benefits**:
   - ✅ Dynamic metadata per manga
   - ✅ JSON-LD structured data
   - ✅ Better SEO
   - ✅ Faster initial load

4. **Trade-offs**:
   - Search functionality moves to separate client component
   - Slightly different code structure

## Verification Steps

After successful deployment:

### 1. Check Homepage
- Visit your Vercel URL
- View page source (Ctrl+U)
- Verify metadata tags are present:
  ```html
  <title>อ่านมังงะแปลไทย...</title>
  <meta property="og:title" content="...">
  <script type="application/ld+json">...</script>
  ```

### 2. Check Manga Pages
- Visit any manga page (e.g., /henshin-metamorphosis)
- Should load without errors
- View tracker should work

### 3. Check Console
- Open browser console (F12)
- No critical errors
- API calls should succeed

### 4. Test Mobile
- Responsive design works
- Images load properly
- Navigation functions

## Performance Optimization

### Already Implemented
- ✅ ISR with 60s revalidation
- ✅ Image optimization via Next.js Image
- ✅ Component code splitting
- ✅ Server components where possible

### Recommended Next Steps
1. **Add image CDN**: Configure Vercel Image Optimization
2. **Add caching headers**: Configure in next.config.mjs
3. **Optimize fonts**: Already using next/font
4. **Add loading states**: Improve UX

## Monitoring

### After Deployment
1. **Check Vercel Analytics**: View performance metrics
2. **Monitor Error Logs**: Vercel → Your Project → Logs
3. **Test Core Web Vitals**: Use PageSpeed Insights
4. **Check SEO**: Use Google Search Console (after indexing)

## If Build Still Fails

### Debug Steps
1. Check build logs in Vercel for exact error
2. Test build locally:
   ```bash
   npm run build
   ```
3. Common fixes:
   - Clear build cache in Vercel
   - Update dependencies
   - Check for TypeScript errors
   - Verify all imports resolve

### Get Build Logs
```bash
# Download logs from Vercel CLI
vercel logs <deployment-url>
```

## Summary of Changes

### Files Modified
1. ✅ `app/layout.js` - Fixed metadataBase, removed hardcoded URLs
2. ✅ `app/page.js` - Removed canonical URL causing issues
3. ✅ `app/sitemap.js` - Use environment variables
4. ✅ `app/[slug]/metadata.js` - Disabled (client component)
5. ✅ `utils/fetchMangaData.js` - Use ISR instead of no-store
6. ✅ `utils/fetchTagData.js` - Use ISR instead of no-store
7. ✅ `utils/fetchRecommendData.js` - Use ISR instead of no-store

### Files Created
1. ✅ `.env.production` - Environment variable template
2. ✅ `VERCEL_FIX.md` - This guide

### Result
- ✅ Build should complete successfully
- ✅ Pages should render properly
- ✅ SEO metadata should be present
- ✅ No deployment loops
- ✅ ISR ensures fresh data without build-time issues

---

**Need Help?**
If deployment still fails, check:
1. Vercel build logs for specific error message
2. Ensure all environment variables are set
3. Try deploying from a fresh branch
4. Contact Vercel support with build logs
