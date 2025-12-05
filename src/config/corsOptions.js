// config/corsOptions.js
const allowedOrigins = [
    'http://localhost:3000',  // React dev server
    'http://localhost:3001',  // Alternative port
    'http://127.0.0.1:3000', // Localhost with IP
    'http://localhost:5173', // Vite dev server
    // Add other origins as needed for production
];

export const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-HTTP-Method-Override'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};
