# College Utility Portal

A comprehensive web application for college students featuring Lost & Found, Marketplace, and Academic Notes sharing.

## Features

- 🔐 **User Authentication** - Secure login/signup with email verification
- 📱 **Lost & Found** - Report and find lost items
- 🛒 **Student Marketplace** - Buy and sell items with fellow students
- 📚 **Academic Hub** - Share and access study materials
- 🔔 **Notifications** - Real-time updates and alerts
- 👨‍💼 **Admin Panel** - Content moderation and user management
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer for OTP verification

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd college-utility-portal
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables:
     \`\`\`env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     PORT=5000
     \`\`\`

4. **Start the application**
   \`\`\`bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

5. **Access the application**
   - Open your browser and go to `http://localhost:5000`

## Deployment

### Heroku Deployment

1. **Create a Heroku app**
   \`\`\`bash
   heroku create your-app-name
   \`\`\`

2. **Set environment variables**
   \`\`\`bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set EMAIL_USER=your_email
   heroku config:set EMAIL_PASS=your_password
   \`\`\`

3. **Deploy**
   \`\`\`bash
   git push heroku main
   \`\`\`

### Railway Deployment

1. **Connect your GitHub repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically**

### Render Deployment

1. **Connect your GitHub repository to Render**
2. **Set environment variables**
3. **Deploy with build command**: `npm install`
4. **Start command**: `npm start`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Lost & Found
- `GET /api/lostfound` - Get approved lost items
- `POST /api/lostfound` - Post a lost item
- `GET /api/lostfound/user` - Get user's lost items
- `GET /api/lostfound/pending` - Get pending items (admin)

### Marketplace
- `GET /api/marketplace` - Get approved marketplace items
- `POST /api/marketplace` - Post a marketplace item
- `GET /api/marketplace/user` - Get user's marketplace items

### Notes
- `GET /api/notes` - Get approved notes
- `POST /api/notes` - Upload notes
- `GET /api/notes/user` - Get user's notes
- `GET /api/notes/pending` - Get pending notes (admin)

### Admin
- `POST /api/admin/approve/lostitem/:id` - Approve lost item
- `POST /api/admin/reject/lostitem/:id` - Reject lost item
- `POST /api/admin/approve/note/:id` - Approve note
- `POST /api/admin/reject/note/:id` - Reject note
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/user/:id` - Delete user

## Default Admin Credentials

- **Email**: `srkrcup@gmail.com`
- **Password**: `Srkrcup@25`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the
