# QuickScan Prototype (PWA) — Minimal

This is a minimal prototype of the QuickScan PWA. It includes:
- Camera capture (getUserMedia)
- Add pages and export to PDF (client-side using pdf-lib)
- Basic PWA manifest for packaging

How to run:
1. Install dependencies:
   npm install

2. Run dev server:
   npm run dev

3. Build for production:
   npm run build

4. Serve preview:
   npm run preview

Packaging to APK:
- Deploy the built site to HTTPS host (Netlify/Vercel).
- Open PWABuilder (https://www.pwabuilder.com), enter your site URL, follow steps to generate an Android package (APK/AAB).
- Alternatively use Trusted Web Activity or Bubblewrap for Play Store AAB.

Notes / Next steps to reach full QuickScan feature set:
- Integrate cropperjs for manual crop UI.
- Integrate opencv.js WASM for auto edge detection & perspective transform.
- Add Tesseract.js as local OCR fallback and server-side OCR for high accuracy.
- Implement IndexedDB (localForage) for offline storage & document library.
- Add auth & signed uploads to Supabase/S3 for backup & premium features.
