const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const folderRoutes = require('./routes/folderRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userContentRoutes = require('./routes/userContentRoutes');
const chatbotController = require('./controllers/chatbotController.js');

const app = express();
app.set('views', path.join(__dirname, 'views'));

app.use('/styles', express.static(path.join(__dirname, 'public/styles'), { 
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));

app.use('/scripts', express.static(path.join(__dirname, 'public/scripts'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/javascript');
  }
}));

app.set('view engine', 'ejs');

app.use(cors({
  origin: 'https://frontend-final-one.vercel.app', // Updated: removed extra spaces
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(express.json());

// Chatbot routes
app.get('/chat/:formId', chatbotController.renderChatbot);
app.post('/api/submit-response', chatbotController.submitResponse);
app.get('/api/form/:formId', chatbotController.getFormData);
app.get('/api/generate-unique-id/:formId', chatbotController.generateUniqueId);

// Other routes
app.get('/api/uptime', (req, res) => {
  res.json({ message: 'Uptime not supported in serverless environments' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/serverison', (req, res) => {
  const formattedDate = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  res.send(`Server started: ${formattedDate}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/user', userContentRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
