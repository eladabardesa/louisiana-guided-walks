# Generate QR Code

## Quick Method (Online)

The easiest way is to use an online QR code generator:

1. Go to: https://www.qr-code-generator.com/ or https://qr.io/
2. Enter URL: `https://louisiana-guided-walks.up.railway.app/`
3. Download the QR code image
4. Save it to `/public/qr-code.png` if you want to use it on the site

## Method 2: Using npm script (After installing dependencies)

1. **Install QR code library:**
   ```bash
   npm install --save-dev qrcode
   ```

2. **Run the script:**
   ```bash
   node scripts/generate-qr.js
   ```

3. **QR code will be saved to:** `public/qr-code.png`

## Method 3: Using Python (if you have it)

```bash
pip install qrcode[pil]
python -c "import qrcode; qrcode.make('https://louisiana-guided-walks.up.railway.app/').save('public/qr-code.png')"
```

## Method 4: Direct API (No installation needed)

You can also use a free QR code API:

```
https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://louisiana-guided-walks.up.railway.app/
```

Just open this URL in your browser and save the image!

## Use QR Code on Your Site

Once you have the QR code image, you can add it to your page:

```tsx
<img src="/qr-code.png" alt="QR Code" className="w-48 h-48" />
```
