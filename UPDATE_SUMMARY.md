# Update Summary

## ✅ Changes Completed

### 1. Database Schema Updates
- Added `ticketQuantity` field (required, default: 1)
- Made `phone` field required (was optional)
- Added index on `selectedDate` for faster queries

### 2. Form Updates
- ✅ Phone number is now **mandatory**
- ✅ Added ticket quantity selector (1-2 tickets)
- ✅ Tour selection is mandatory (already was)
- ✅ Real-time ticket availability checking
- ✅ "Sold Out" display when 10 tickets reached

### 3. Content Updates
- ✅ Updated page title: "Look Back at You"
- ✅ Updated subtitle: "An attentive walk with Elad at Louisiana Museum"
- ✅ Updated all text content with new copy
- ✅ Both tours now show "Language: English"
- ✅ Added pricing note section

### 4. Contact Buttons
- ✅ WhatsApp button (links to your phone)
- ✅ Facebook Messenger button
- ✅ Phone call button
- ⚠️ **You need to update**: `CONTACT_PHONE` and `MESSENGER_USERNAME` in `app/page.tsx`

## 🔧 Next Steps

### 1. Update Contact Information

Open `app/page.tsx` and update these constants at the top:

```typescript
const CONTACT_PHONE = '+45XXXXXXXXX'; // Replace with your actual phone number
const MESSENGER_USERNAME = 'yourusername'; // Replace with your Facebook Messenger username
```

### 2. Run Database Migration

The database schema has changed. You need to create and run a migration:

**Locally:**
```bash
npx prisma migrate dev --name add_ticket_quantity_and_phone_required
```

**On Railway:**
After pushing the code, Railway will run migrations automatically (it's in the build script).

### 3. Test Everything

1. **Test ticket selection:**
   - Select a tour
   - Choose 1 or 2 tickets
   - Submit form

2. **Test sold-out logic:**
   - Submit 10 tickets for a tour (you may need to do this manually in the database)
   - Verify "Sold Out" appears
   - Verify form doesn't show for sold-out tours

3. **Test contact buttons:**
   - Click WhatsApp button (should open WhatsApp)
   - Click Messenger button (should open Messenger)
   - Click Call button (should dial your number)

4. **Test validation:**
   - Try submitting without phone → should show error
   - Try submitting without tour → should show error
   - Try submitting without name/email → should show errors

## 📝 Important Notes

- **Ticket tracking**: Tickets are counted per tour based on the `selectedDate` field
- **Sold out**: When 10 tickets are sold, the tour shows "Sold Out" and can't be selected
- **Availability**: Updates every 30 seconds automatically
- **Phone format**: Use international format (e.g., +45 12 34 56 78)

## 🐛 If Something Doesn't Work

1. **Migrations not running?**
   - Check Railway build logs
   - Run manually: `railway run npx prisma migrate deploy`

2. **Availability not updating?**
   - Check browser console for errors
   - Verify `/api/availability` endpoint is working

3. **Contact buttons not working?**
   - Make sure you updated `CONTACT_PHONE` and `MESSENGER_USERNAME`
   - WhatsApp: Phone number should be in international format without spaces
   - Messenger: Should be your Facebook username (not full URL)
