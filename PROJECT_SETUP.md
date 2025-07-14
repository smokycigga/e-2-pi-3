# Test Generator Web Application Setup

## Project Overview
This is a full-stack AI-powered test generator web application that creates JEE-style mock tests from PDF study materials.

**Tech Stack:**
- **Frontend**: Next.js (React) with Tailwind CSS
- **Backend**: Flask (Python) with AI/ML capabilities
- **Database**: MongoDB
- **AI/ML**: Groq API (LLaMA-3), Sentence-BERT, FAISS

## Setup Status ✅
- ✅ Frontend dependencies installed (`npm install`)
- ✅ Backend dependencies installed (`pip install -r backend/requirements.txt`)
- ✅ Environment variables configured
- ✅ JavaScript errors fixed in dashboard
- ✅ Both servers running successfully

## Running the Application

### 1. Backend Server (Flask)
```bash
cd backend
python -c "import server; server.app.run(host='127.0.0.1', port=5000, debug=True)"
```
- **URL**: http://127.0.0.1:5000
- **Features**: PDF processing, question generation, test management

### 2. Frontend Server (Next.js)
```bash
npm run dev
```
- **URL**: http://localhost:3000
- **Features**: User interface, test taking, dashboard

## Environment Configuration

### Backend (.env file)
Located at: `backend/.env`
```env
MONGODB_URI=your_mongodb_connection_string_here
GROQ_API_KEY=your_groq_api_key_here
```

## Key Features Available
1. **PDF Upload**: Upload study material PDFs
2. **Question Generation**: AI-powered MCQ generation
3. **Test Taking**: Timed tests with auto-evaluation
4. **Dashboard**: Performance analytics and history
5. **User Authentication**: Firebase-based auth system

## Current Data
- **532 questions** extracted from existing PDFs
- **12 images** processed
- **59 associations** created between questions and images

## Next Steps
1. Access the application at http://localhost:3000
2. Register/login to create an account
3. Upload PDFs or use existing test data
4. Generate and take tests
5. View performance analytics on the dashboard

## Troubleshooting
- Ensure both servers are running simultaneously
- Check that MongoDB connection is working
- Verify Groq API key is valid
- Frontend communicates with backend on port 5000
