# EmailJS Integration Guide

## Overview
EmailJS has been integrated into the Officer Requests component to send email notifications when an admin approves or rejects an officer registration request.

## Installation

EmailJS has been added to `package.json`:
```bash
npm install @emailjs/browser
```

## Configuration

### EmailJS Credentials
- **Service ID:** service_7y5jtnq
- **Template ID:** template_8i5btvp
- **Public Key:** pWiGdaj5MKAhJn1nP

### Initialization
EmailJS is initialized in the `useEffect` hook:
```javascript
useEffect(() => {
  fetchRequests();
  emailjs.init('pWiGdaj5MKAhJn1nP');
}, []);
```

## Email Function

### sendOfficerStatusEmail()
Sends an email notification to the officer with their approval/rejection status.

```javascript
const sendOfficerStatusEmail = (officerName, officerEmail, status) => {
  emailjs.send(
    'service_7y5jtnq',
    'template_8i5btvp',
    {
      officer_name: officerName,
      status: status,
      email: officerEmail
    },
    'pWiGdaj5MKAhJn1nP'
  )
    .then((result) => {
      console.log('Email sent successfully', result.text);
    })
    .catch((error) => {
      console.error('Email sending failed', error);
    });
};
```

### Parameters
- `officerName` (string): Name of the officer
- `officerEmail` (string): Email address of the officer
- `status` (string): Either "approved" or "rejected"

## Integration Points

### Approve Handler
```javascript
const handleApprove = async (request) => {
  try {
    await api.patch(`/admin/approve-officer/${request._id}`);
    // Send email after successful approval
    sendOfficerStatusEmail(request.name, request.email, 'approved');
    setSuccess('Officer approved successfully');
    fetchRequests();
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    setError('Failed to approve officer');
    setTimeout(() => setError(''), 3000);
  }
};
```

### Reject Handler
```javascript
const handleReject = async (request) => {
  try {
    await api.patch(`/admin/reject-officer/${request._id}`);
    // Send email after successful rejection
    sendOfficerStatusEmail(request.name, request.email, 'rejected');
    setSuccess('Officer rejected successfully');
    fetchRequests();
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    setError('Failed to reject officer');
    setTimeout(() => setError(''), 3000);
  }
};
```

## Email Template Variables

The EmailJS template uses these variables:
- `officer_name`: Officer's full name
- `status`: "approved" or "rejected"
- `email`: Officer's email address

## How It Works

1. Admin clicks "Approve" or "Reject" button
2. Backend API call is made to approve/reject the officer
3. If successful, `sendOfficerStatusEmail()` is called
4. EmailJS sends an email to the officer with their status
5. Success/error message is displayed to the admin
6. Officer requests list is refreshed

## Error Handling

- If the backend API call fails, the email is not sent
- If the email fails to send, it's logged to console but doesn't affect the UI
- Admin sees success/error messages for the approval/rejection action
- Email sending errors don't block the user experience

## Testing

To test the email functionality:

1. Go to Admin Dashboard → Officer Requests
2. Click "Approve" or "Reject" on a pending request
3. Check the officer's email for the notification
4. Check browser console for EmailJS logs

## Troubleshooting

### Email not sending
- Check EmailJS credentials are correct
- Verify the template ID exists in EmailJS dashboard
- Check browser console for error messages
- Ensure officer email is valid

### Email sending but not received
- Check spam/junk folder
- Verify email address is correct
- Check EmailJS dashboard for delivery status
- Verify template is configured correctly

## Files Modified

- `frontend/package.json` - Added @emailjs/browser dependency
- `frontend/src/pages/admin/OfficerRequests.jsx` - Added EmailJS integration

## No Backend Changes

- ✅ Backend APIs remain unchanged
- ✅ Approval/rejection logic unchanged
- ✅ Database logic unchanged
- ✅ Only frontend email notification added

---

**Status:** ✅ Complete
**Version:** 1.0
