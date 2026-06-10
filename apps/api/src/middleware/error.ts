import { NextFunction, Request, Response } from "express";

export function notFound(_request: Request, response: Response) {
  response.status(404).json({ message: "Route not found." });
}

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  const status = error.message === "Authentication required." ? 401 : 400;
  response.status(status).json({
    message: error.message || "Something went wrong."
  });
}
