# FullStack-Blogging

A complete full-stack blogging platform with modern UI, comprehensive user management, and rich content creation features.



## 🚀 Features

### 👤 User Authentication
- Secure signup/login/logout using JWT
- Password encryption with bcrypt
- Role-based access (admin vs regular users)
- Protected routes for authenticated users

### 📝 Blog Management
- Create new blog posts with rich text editor
- Upload cover images for blogs
- View all blogs with pagination
- Read individual blog posts with full content
- Update blogs (author/admin only)
- Delete blogs (author/admin only)
- Draft saving functionality

### 🏷️ Categories & Tags
- Assign categories and tags to posts
- Browse blogs by category or tag
- Admin panel for category management
- Tag cloud visualization

### 💬 Comment System
- Add comments to blog posts
- Reply to existing comments
- Delete your own comments
- Admin moderation capabilities

### 👍 Like System
- Like/unlike blog posts
- Display like count on each post
- Track user likes

### 🔎 Search & Filtering
- Search posts by title or content
- Filter posts by category or tag
- Sort posts by date, popularity, or likes
- Advanced filtering options

### 👤 User Profiles
- Customizable user profiles
- Profile pictures with Cloudinary integration
- Bio and social media links
- View user's published blogs
- Follow other users

### 📊 Admin Dashboard
- Comprehensive admin controls
- User management (view, edit, delete)
- Content moderation tools
- Analytics dashboard
- Site statistics

### 📱 Responsive Design
- Mobile-first approach
- Fully responsive on all devices
- Modern UI with animations
- Dark/light mode toggle

## 💻 Tech Stack

### Frontend
- **React.js**: UI library
- **Tailwind CSS**: Styling
- **Redux**: State management
- **React Router**: Navigation
- **Axios**: API requests
- **React Quill**: Rich text editor
- **React Icons**: Icon library

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Multer**: File handling
- **Cloudinary**: Image storage

## 📁 Project Structure

### Backend (`/server`)
```
server/
├── config/             # Configuration files
│   ├── db.js           # Database connection
│   └── cloudinary.js   # Cloudinary setup
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── blogController.js
│   ├── commentController.js
│   ├── userController.js
│   └── categoryController.js
├── middlewares/        # Custom middlewares
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
├── models/             # Mongoose schemas
│   ├── Blog.js
│   ├── Category.js
│   ├── Comment.js
│   └── User.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   ├── commentRoutes.js
│   ├── userRoutes.js
│   └── categoryRoutes.js
├── utils/              # Helper functions
│   ├── generateToken.js
│   └── validators.js
├── app.js              # Express app
└── server.js           # Entry point
```

### Frontend (`/client`)
```
client/
├── public/             # Static files
├── src/
│   ├── api/            # API integration
│   │   └── index.js    # Axios instance & API calls
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   ├── auth/       # Authentication components
│   │   ├── blog/       # Blog-related components
│   │   ├── common/     # Common UI components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI elements
│   ├── context/        # React context
│   │   └── AuthContext.js
│   ├── hooks/          # Custom hooks
│   │   ├── useAuth.js
│   │   └── useBlog.js
│   ├── pages/          # Application pages
│   │   ├── Admin/      # Admin dashboard pages
│   │   ├── Auth/       # Login/Register pages
│   │   ├── Blog/       # Blog pages
│   │   ├── Profile/    # User profile pages
│   │   └── Home.js     # Homepage
│   ├── redux/          # State management
│   │   ├── actions/
│   │   ├── reducers/
│   │   └── store.js
│   ├── utils/          # Utility functions
│   ├── App.js          # Main component
│   ├── index.js        # Entry point
│   └── routes.js       # Route definitions
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account

### Backend Setup
1. Navigate to server directory
   ```bash
   cd server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the server
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to client directory
   ```bash
   cd client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the application
   ```bash
   npm start
   ```

## 🌐 Deployment

### Frontend
- Deployed on Vercel
- Automatic deployments from main branch

### Backend
- Deployed on Render
- Database hosted on MongoDB Atlas

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Blogs
- `GET /api/blogs` - Get all blogs (with pagination)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Like blog

### Comments
- `GET /api/blogs/:blogId/comments` - Get all comments for a blog
- `POST /api/blogs/:blogId/comments` - Add new comment
- `DELETE /api/comments/:id` - Delete comment

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License

