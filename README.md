# Personal Documents Manager

A secure, responsive Angular application for managing personal documents (Aadhar, PAN, Passport, etc.) with data masking and secure storage.

## Features
- **User Authentication**: Secure Signup and Login.
- **Document Management**: Upload, View, and Delete personal documents.
- **Privacy First**: Document numbers are masked by default (e.g., `********1234`).
- **Responsive Design**: Works on Mobile and Desktop.
- **Tech Stack**: Angular 18, Node.js, Express, MongoDB.

## Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/personaldocs
   JWT_SECRET=your_super_secret_key
   ```

3. **Run the Application**:
   This command starts both the Backend API (port 3000) and Frontend (port 4200):
   ```bash
   npm run dev
   ```

4. **Access**:
   Open [http://localhost:4200](http://localhost:4200)

## Deployment (Vercel)
The project is configured for Vercel deployment.
- `vercel.json` handles the API routing.
- Ensure you set `MONGO_URI` and `JWT_SECRET` in Vercel project settings.
