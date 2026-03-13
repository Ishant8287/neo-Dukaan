export const errorHandler = (err, req, res, next) => {
  // 1.For Terminal error
  console.error(`🚨 Error: ${err.message}`.red || err.message);

  // If no status code then 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // 3. Mongoose CastError
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found. Invalid ID format.";
  }

  // 4. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered. Ye data already exist karta hai.";
  }

  // 5. Frontend ko clean JSON bhejna
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
