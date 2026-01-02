# 🗣️ BinusianTalks-API (Backend)
Backend REST API for the BinusianTalks platform, built using Node.js, Express, and MongoDB, and is deployed on Railway.

# 🎯 Tech Stack
  • Node.js – Runtime environment
  • Express.js – Backend framework
  • MongoDB Atlas – NoSQL cloud database
  • JWT (JSON Web Token) – Authentication
  • Railway – Backend deployment platform

# 🛎️ Requirements 
Before running the backend, ensure you have:

  •	Node.js
	•	MongoDB Atlas account (for database connection)
	•	Git (to clone the repository)
	•	Code editor (Visual Studio Code)

# 📱 Getting Started 
### 1. Clone the Repository
```bash
git clone https://github.com/zhafirahkamila/BinusianTalks-API.git
cd BinusianTalks-API
```

# 🗄️ MongoDB Atlas Setup
### 2. Create MongoDB Cluster
1. Visit: (https://www.mongodb.com/cloud/atlas)
2. Sign in or create an account
3. Create a __Free Tier (M0)__ cluster
4. Choose a cloud provider and region
5. Wait for the cluster to be provisioned

### 3. Create Database User
1. Go to __Database Access__
2. Add a new database user
3. Set username & password
4. Give __Read and Write__ access

### 4. Whitelist Your IP Address
1. Go to __Network Access__
2. Add your current IP Address
3. (Optional for dev) Allow access from anywhere: `0.0.0.0/0`

### 5. Get MongoDB Connection String
1. Click __Connect__
2. Choose __Drivers__
3. Select Node.js
4. Copy the connection string
Example:
```bash
mongodb+srv://<db_username>:<db_password>@binusian-talks.bpu0mep.mongodb.net/
```
Replace <db_username> and <db_password> with your database credentials.

# 📑 Application Configuration
### 6. Create Environment File
Create a .env file in the root directory of the project.

### 7. Configure Environment Variables
```bash
ATLAS_URI=mongodb+srv://<db_username>:<db_password>@binusian-talks.bpu0mep.mongodb.net/<database>
JWT_SECRET=your_jwt_secret_key
PORT=5050
```

### 8. Install Dependencies
```bash
npm install
```

### 9. Run the Backend
```bash
node server.js
```
The server will be running at:
```bash
http://localhost:5050
```

### 🌐 Deployment
  • Backend is deployed on Railway
	•	Database hosted on MongoDB Atlas
	•	Frontend deployed separately on Vercel
