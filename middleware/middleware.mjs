//logging
export const log = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusEmoji = status < 400 ? '✅' : status < 500 ? '⚠️' : '❌';
    console.log(`${statusEmoji} ${req.method} ${req.originalUrl} -> ${status} (${duration}ms)`);
  });
  next();
};

// 404 handler
export const notFound = (req, res) => {
  res.status(404).json({ 
    error: "Route not found", 
    path: req.originalUrl 
  });
};

// Global error handler
export const globalErr = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  if (err.name === "ValidationError") status = 400;
  if (err.name === "CastError") status = 400;
  if (err.code === 11000) status = 409; // Duplicate key
  
  if (status >= 500) {
    console.error(`❌ Server Error on ${req.method} ${req.originalUrl}:`, err);
  }
  
  res.status(status).json({ 
    error: err.message || "Internal server error" 
  });
};