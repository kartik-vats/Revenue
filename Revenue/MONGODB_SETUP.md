# MongoDB Setup Guide for RevenueSense

## 🚨 Database Connection Issue

If you're getting "error seeding db", it means MongoDB is not running or not accessible.

## 🔧 Quick Fix Options

### Option 1: Install MongoDB Community Edition (Recommended)

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Download the Windows version
   - Run the installer

2. **Install MongoDB**:
   - Choose "Complete" installation
   - Install MongoDB Compass (GUI tool) if you want
   - Complete the installation

3. **Start MongoDB Service**:
   - Open Services (Win + R, type `services.msc`)
   - Find "MongoDB" service
   - Right-click → Start
   - Set to "Automatic" startup

### Option 2: Use MongoDB Atlas (Cloud - Free)

1. **Create Free Account**:
   - Go to: https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create Cluster**:
   - Choose "Free" tier
   - Select region close to you
   - Create cluster

3. **Get Connection String**:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

4. **Update Environment**:
   - Create `backend/.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/revenuesense
   ```

### Option 3: Use Docker (Advanced)

1. **Install Docker Desktop**:
   - Download from: https://www.docker.com/products/docker-desktop

2. **Run MongoDB Container**:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## 🧪 Test MongoDB Connection

### Test 1: Check if MongoDB is running
```bash
# Open Command Prompt as Administrator
netstat -an | findstr 27017
```
If you see `TCP    0.0.0.0:27017    0.0.0.0:0    LISTENING`, MongoDB is running.

### Test 2: Try connecting manually
```bash
# Install MongoDB Shell (mongosh)
# Download from: https://www.mongodb.com/try/download/shell

# Connect to local MongoDB
mongosh "mongodb://localhost:27017"
```

### Test 3: Check Windows Services
1. Press `Win + R`, type `services.msc`
2. Look for "MongoDB" service
3. Make sure it's running and set to "Automatic"

## 🔄 Alternative: Use In-Memory Database

If you can't get MongoDB working, I can modify the project to use an in-memory database for development.

## 📋 Troubleshooting Steps

1. **Check if port 27017 is free**:
   ```bash
   netstat -an | findstr 27017
   ```

2. **Check Windows Firewall**:
   - Allow MongoDB through Windows Firewall
   - Add exception for port 27017

3. **Check MongoDB logs**:
   - Look in `C:\Program Files\MongoDB\Server\[version]\log\`
   - Check for error messages

4. **Restart MongoDB service**:
   ```bash
   net stop MongoDB
   net start MongoDB
   ```

## ✅ After MongoDB is Working

1. **Run the seeder**:
   ```bash
   cd backend
   npm run seed
   ```

2. **Start the backend**:
   ```bash
   npm run dev
   ```

3. **Start the frontend**:
   ```bash
   cd ../frontend
   npm run dev
   ```

## 🆘 Still Having Issues?

1. **Check the error message** from the seeder
2. **Verify MongoDB version** (should be 6.0+)
3. **Try different connection string**:
   - `mongodb://127.0.0.1:27017/revenuesense`
   - `mongodb://localhost:27017/revenuesense`
   - `mongodb://0.0.0.0:27017/revenuesense`

4. **Contact support** with the exact error message

---

**Quick Start**: The easiest solution is usually installing MongoDB Community Edition from the official website.
