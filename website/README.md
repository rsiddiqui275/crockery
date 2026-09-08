# Crokary Website (React + Vite)

Retail & wholesale storefront for glass jars, bottles and decor. Built with React,
TypeScript and Vite. No backend/payment gateway yet - customers browse products and
send an itemized enquiry over WhatsApp; you close the sale via chat/UPI/bank transfer.

## Quick start

```powershell
cd website
npm install
npm run dev
```

Open the printed local URL (e.g. http://localhost:5173).

## Configure your business details

Copy `.env.example` to `.env` and fill in:

- `VITE_WHATSAPP_NUMBER` - your WhatsApp number in international format, digits only
  (e.g. `919876543210`). All "Enquire on WhatsApp" buttons use this.
- `VITE_BUSINESS_NAME` - shown in the navbar/footer/messages.
- `VITE_PRODUCTS_CSV_URL` - optional, see below.

## Product data: start with placeholders, move to Google Sheets later

Right now the site shows sample data from `src/data/sampleProducts.ts` (a handful of
products using your real photos, with placeholder prices).

To manage the full catalog yourself without touching code:

1. Open `public/products-template.csv` - it already lists every image in
   `public/media` with empty columns to fill in.
2. Import that CSV into a new Google Sheet (File > Import).
3. Fill in `name`, `category`, `sizeMl`, `colour`, `retailPrice`, `wholesalePrice`,
   `moq`, `description` for each row. Leave `image` as-is (or replace with a hosted
   image URL from Google Drive/Firebase later). Add a `video` column with a URL if
   you want a product video (use files already in `public/media`, e.g.
   `/media/WhatsApp Video 2026-09-08 at 10.54.48 AM.mp4`, or a hosted URL).
4. In Google Sheets: File > Share > Publish to web > choose the sheet + **CSV** format
   > Publish. Copy the generated URL.
5. Paste that URL into `.env` as `VITE_PRODUCTS_CSV_URL` and restart the dev server
   (or redeploy). The site will now load live data from your sheet - edit the sheet
   any time and refresh the site to see changes, no redeploy needed.

CSV columns used: `id, name, category, sizeMl, colour, material, retailPrice,
wholesalePrice, moq, description, image, video, inStock`.

### Moving images to Drive/Firebase for scalability

The `image`/`video` columns accept any public URL, so once you're ready you can:
- Upload photos to Firebase Storage or Google Drive (shared "Anyone with link" access
  for Drive), and paste the direct file URL into the sheet, or
- Keep using `/media/<filename>` for anything already copied into
  `public/media` (fine for a small catalog, no extra hosting needed).

## Retail vs Wholesale

The Retail/Wholesale toggle in the navbar switches which price (`retailPrice` /
`wholesalePrice`) and MOQ are shown across the whole site, including in the WhatsApp
enquiry message. Persisted per-visitor in `localStorage`.

## Build & deploy

```powershell
npm run build
```

Outputs static files to `dist/`. Deploy `dist/` to any static host: Netlify, Vercel,
GitHub Pages, Azure Static Web Apps, etc. Remember to set the same environment
variables (`VITE_...`) in your hosting provider's build settings.

## Project structure

```
src/
  components/   Navbar, Hero, ProductCard, ProductGrid, EnquiryDrawer, Footer
  context/      StoreContext - products, price mode, enquiry cart (localStorage)
  data/         sampleProducts.ts (fallback data), loadProducts.ts (CSV/sheet loader)
  pages/        Home, Products, ProductDetail, Wholesale, Contact
  utils/        whatsapp.ts - wa.me link builder, currency formatting
public/
  media/                 copied product photos & videos
  products-template.csv  starter sheet for all current photos
```
