# LinkedIn Clone - Social Media Web Application

A full-stack social media web application inspired by LinkedIn, built as part of the AppDost Full Stack Developer Internship Assignment.

## 🚀 Live Demo

- **Frontend**: [Your Netlify/Vercel URL here]
- **Backend**: [Your Render/Railway URL here]

## 📋 Features

### Core Features
- ✅ **User Authentication**: Sign up and login with email and password
- ✅ **Create Posts**: Users can create text posts
- ✅ **View Feed**: Public feed displaying all users' posts (latest first)
- ✅ **User Profile Display**: Shows logged-in user's name in the header

### Bonus Features
- ✅ **Like Posts**: Users can like/unlike posts
- ✅ **Comment on Posts**: Add comments to any post
- ✅ **Edit Posts**: Users can edit their own posts
- ✅ **Delete Posts**: Users can delete their own posts
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Real-time Updates**: Feed updates after actions

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **CSS3** - Styling
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
linkedin-clone/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
│
└── frontend/
    ├── src/
    │   ├── App.js         # Main React component
    │   ├── App.css        # Styles
    │   └── index.js       # Entry point
    ├── package.json       # Frontend dependencies
    └── public/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/linkedin-clone
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Linkedin-Clone
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (optional, for production)
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the React app**
   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000`

## 🌐 Deployment

### Deploy Backend (Render/Railway)

#### Using Render:
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
6. Deploy!

#### Using Railway:
1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add MongoDB plugin
4. Set environment variables
5. Deploy!

### Deploy Frontend (Netlify/Vercel)

#### Using Netlify:
1. Create a new site on [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL
6. Deploy!

#### Using Vercel:
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variables in Vercel dashboard

## 🔑 API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)
- `POST /api/posts/:id/comment` - Add comment (protected)

## 📱 Screenshots

### Login/Signup Page
![Auth Page](screenshots/auth.png)

### Feed Page
![Feed](screenshots/feed.png)

### Create Post
![Create Post](screenshots/create-post.png)

## 🧪 Testing the Application

1. **Sign Up**: Create a new account
2. **Login**: Login with your credentials
3. **Create Post**: Write and post content
4. **Interact**: Like, comment, edit, and delete posts
5. **Logout**: Sign out securely

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### CORS Errors
- Ensure backend has CORS enabled
- Check API URL in frontend `.env`

### Port Already in Use
- Change PORT in backend `.env`
- Kill the process using the port: `lsof -ti:5000 | xargs kill`

## 📝 Future Enhancements

- [ ] Image upload for posts
- [ ] User profile pages
- [ ] Follow/Unfollow users
- [ ] Private messaging
- [ ] Notifications
- [ ] Search functionality
- [ ] Infinite scroll pagination

## 👨‍💻 Author

**Your Name**
- Email: akashasahu2001@gmail.com
- GitHub: [@akashasahu07](https://github.com/akashasahu07)

## 📄 License

This project is created for the AppDost Full Stack Developer Internship Assignment.

## 🙏 Acknowledgments

- AppDost for the internship opportunity
- MongoDB documentation
- React documentation
- Express.js documentation

---

**Assignment Submitted to**: hr@appdost.in  
**Deadline**: Within 3 days of receiving the assignment