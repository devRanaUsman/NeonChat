# NeonChat Deployment Guide (Vercel)

I've configured the project for deployment on Vercel. For the best experience, you should create **two separate projects** on the Vercel dashboard.

## 1. Backend Deployment (Server)
Deploy this project FIRST to get your backend URL.

- **Vercel Project Name**: `neonchat-server`
- **Root Directory**: `server`
- **Framework Preset**: Other (it will use the `vercel.json` automatically)
- **Environment Variables**:
    - `MONGO_URI`: Your MongoDB connection string
    - `JWT_ACCESS_SECRET`: A random string
    - `JWT_REFRESH_SECRET`: Another random string
    - `CLOUDINARY_CLOUD_NAME`: From Cloudinary
    - `CLOUDINARY_API_KEY`: From Cloudinary
    - `CLOUDINARY_API_SECRET`: From Cloudinary
    - `CLIENT_URL`: Your Frontend URL (update this *after* deploying the frontend)

## 2. Frontend Deployment (Client)
Deploy this project SECOND.

- **Vercel Project Name**: `neonchat-client`
- **Root Directory**: `client`
- **Framework Preset**: Vite
- **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://neonchat-server.vercel.app`)

## Important: Socket.io Limitations
> [!WARNING]
> Because Vercel uses Serverless Functions, **Socket.io (real-time updates) will not work perfectly**. Messages will still be sent and saved to the database, but you might need to refresh the page to see new messages from others. 
> 
> If you need full real-time support, consider hosting the `server` folder on **Railway.app** or **Render.com** instead of Vercel.

## How to upload
1. **GitHub**: Push your entire `neonchat` folder to a new GitHub repository.
2. **Vercel Dashboard**:
    - Click "Add New" -> "Project"
    - Select your Repo.
    - For the Backend: Set "Root Directory" to `server`.
    - For the Frontend: Set "Root Directory" to `client`.
