# 🤖 NodeGPT - AI Chat Assistant

A modern, full-stack ChatGPT-like AI chatbot built with React, Node.js, and OpenAI API. Features real-time chat, user authentication, conversation history, and a beautiful responsive UI.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** with secure JWT tokens
- **Password Hashing** using bcryptjs
- **Session Management** with localStorage
- **Protected Routes** with middleware authentication

### 💬 Chat Functionality
- **Real-time AI Responses** using OpenAI GPT-4o-mini
- **Conversation Threads** - Organize chats by topics
- **Message History** - Persistent chat storage in MongoDB
- **Typewriter Effect** - Smooth text animation for AI responses
- **Markdown Support** - Rich text formatting with syntax highlighting
- **Code Copy Feature** - One-click code block copying

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered transitions
- **Loading States** - Interactive loading indicators
- **Toast Notifications** - User feedback with react-hot-toast
- **Mobile Sidebar** - Swipeable navigation for mobile devices

### 🔧 Technical Features
- **RESTful API** - Clean backend architecture
- **MongoDB Integration** - Scalable data storage
- **CORS Enabled** - Cross-origin resource sharing
- **Environment Variables** - Secure configuration management
- **Error Handling** - Comprehensive error management

## 🚀 Live Demo

- **Frontend**: [node-chatbot-ai.vercel.app](https://node-chatbot-ai.vercel.app)
- **Backend**: [chatbot-ai-bber.onrender.com](https://chatbot-ai-bber.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Markdown** - Markdown rendering
- **React Hot Toast** - Toast notifications
- **React Spinners** - Loading animations
- **React Swipeable** - Touch gestures

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - AI chat completions
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
ChatGPT-like-AI-chatbot/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Thread.js        # Chat thread schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── chat.js          # Chat API routes
│   ├── utils/
│   │   ├── authMiddleware.js # JWT authentication middleware
│   │   └── openai.js        # OpenAI API integration
│   ├── package.json
│   └── server.js            # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx      # Main app component
│   │   │   ├── Chat.jsx     # Chat interface
│   │   │   ├── ChatWindow.jsx # Chat window wrapper
│   │   │   ├── Login.jsx    # Login form
│   │   │   ├── Register.jsx # Registration form
│   │   │   ├── Sidebar.jsx  # Navigation sidebar
│   │   │   └── MyContext.jsx # React context
│   │   ├── assets/
│   │   └── index.css        # Global styles
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- OpenAI API key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rijughosh01/node-chatbot-ai
   cd ChatGPT-like-AI-chatbot/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret_key
   PORT=8080
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Deployment

### Backend Deployment (Render)

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure the service:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGODB_URI`
     - `OPENAI_API_KEY`
     - `JWT_SECRET`

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from frontend directory**
   ```bash
   cd frontend
   vercel
   ```

3. **Add environment variable in Vercel dashboard:**
   - `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Chat
- `GET /api/thread` - Get all user threads
- `GET /api/thread/:threadId` - Get specific thread messages
- `POST /api/chat` - Send message and get AI response
- `DELETE /api/thread/:threadId` - Delete thread

## 🎯 Key Features Explained

### 1. **Thread Management**
- Each conversation is organized into threads
- Users can create new chats, switch between threads, and delete old conversations
- Thread titles are automatically generated from the first message

### 2. **Real-time Chat**
- Messages are sent to OpenAI API in real-time
- Responses are streamed back with a typewriter effect
- Markdown formatting with syntax highlighting for code blocks

### 3. **Security**
- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- User-specific data isolation

### 4. **Responsive Design**
- Mobile-first approach
- Swipeable sidebar for mobile navigation
- Adaptive layouts for different screen sizes

## 🔒 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/chatbot
OPENAI_API_KEY=sk-your-openai-api-key
JWT_SECRET=your-super-secret-jwt-key
PORT=8080
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- React team for the amazing framework
- Vercel and Render for hosting services
- All the open-source libraries used in this project

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ by Pritam Ghosh** 