# Vercel Deployment Guide

To fix the "Oracle consultation interrupted" error and get your Ayurvedic Practice & Yoga Therapist Oracle app working on Vercel, we have refactored the backend API into a serverless function structure.

Follow these simple steps to push these changes to your Vercel deployment:

## 1. Commit and Push the Changes
Push the modified files and the new `api/` directory to your GitHub repository:
```bash
git add vercel.json src/App.tsx api/analyze.ts
git commit -m "Configure Vercel Serverless Function and improve error handling"
git push origin main
```

## 2. Configure the GEMINI_API_KEY on Vercel
Vercel is now hosting your backend as a serverless function (`/api/analyze`), which requires your Gemini API key:

1. Open your project on the [Vercel Dashboard](https://vercel.com).
2. Go to **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *[Your Google Gemini API Key]*
4. Click **Save**.

## 3. Redeploy your App
Since you pushed new changes to the `main` branch, Vercel will automatically trigger a new deployment. Once the build finishes, your site will work!

If you need to manually redeploy:
1. Go to the **Deployments** tab in Vercel.
2. Select the latest deployment, click the three dots (`...`), and select **Redeploy**.

---

### What We Changed:
* **Added `api/analyze.ts`**: Created a Vercel-compatible Node.js Serverless Function that runs server-side on Vercel and securely calls the Gemini SDK.
* **Updated `vercel.json`**: Excluded `/api/*` from Vite SPA rewrites so Vercel forwards API requests to the serverless function rather than returning `index.html`.
* **Improved `src/App.tsx` Error Handling**: Enhanced error parsing to handle empty/HTML responses gracefully, preventing generic JSON parsing alerts and showing the actual error messages.
