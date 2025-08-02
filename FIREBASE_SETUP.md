# Firebase Setup Issue Resolution

## Current Problem
The API key "AIzaSyByZHjnXf0aPkq_ZWj4kzHxmyN2nd-aPtg" is being rejected by Firebase servers.

## Required Steps to Fix

### 1. Verify Firebase Project Setup
1. Go to https://console.firebase.google.com/
2. Ensure you're in the correct project: "smartspend-app-5eab0"
3. Check that Authentication is enabled:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider

### 2. Get Fresh API Key
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. If no web app exists, click "Add app" → Web
4. Copy the EXACT config values from the Firebase SDK snippet

### 3. Check API Key Restrictions
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Find your API key
4. Ensure it's not restricted to specific IPs/domains
5. Ensure "Identity Toolkit API" is enabled

### 4. Alternative: Create New Firebase Project
If the current project has issues:
1. Create a new Firebase project
2. Enable Authentication → Email/Password
3. Add a web app
4. Use the fresh credentials

## Testing
Use this curl command to test the API key:
```bash
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"testpass123","returnSecureToken":true}'
```

If you get a successful response (not "API key not valid"), the key works.