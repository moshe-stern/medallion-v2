import { AppError } from "attain-aba-shared";
import express, { Response, Request, NextFunction } from "express";
import dotenv from 'dotenv'
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
}
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 8080;
app.use(express.json());

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const errorMessage = err.isOperational
    ? err.message
    : "An unknown error occured";

  console.error("Error:", err);
  res.status(statusCode).json({
    error: {
      message: errorMessage,
    },
  });
});

app.listen(PORT, () => console.log(`app started on port ${PORT}`));