import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Password } from "../services/password";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";

import { Pool } from "pg";
import { PG_DB } from "../services/postgres-database";

const pool = new Pool({
  ...PG_DB,
  port: Number(PG_DB.port),
});

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, token, password } = req.body;

      const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1;`, [
        email,
      ]);

      if (rows.length == 0) {
        return next(new AppError("No user found for this account", 409));
      }

      if (rows[0].otp !== token) {
        return next(
          new AppError(
            "Something went wrong, please contact the administrator",
            401
          )
        );
      }

      // hash our password before updating to database
      const hashedPassword = await Password.toHash(password);

      // some redis update

      res.status(201).json({
        status: "success",
        message:
          "Password has been set successfully! you can login into your account",
      });
    } catch (e: any) {
      return next(new AppError(e.message, 422));
    }
  }
);

export { resetPassword };
