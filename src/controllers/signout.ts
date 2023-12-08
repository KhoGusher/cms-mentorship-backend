import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";

const signout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.headers.jwt = "";
      res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now()),
        httpOnly: true,
        path: "/",
      });

      res.status(200).json({
        status: "success",
        message: "Logged out succesfully",
      });
    } catch (err: any) {
      return next(new AppError(err.message, 422));
    }
  }
);

export { signout };
