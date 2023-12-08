import { Request, Response, NextFunction } from "express";
import { Email } from "../services/sendgrid";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";

import { Pool } from "pg";
import { PG_DB } from "../services/postgres-database";

const pool = new Pool({
  ...PG_DB,
  port: Number(PG_DB.port),
});

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    try {
      const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1;`, [
        email,
      ]);

      let user = rows[0];

      if (rows.length == 0) {
        return next(new AppError("No user found for this account", 409));
      }
      // generate token to compare with when user confirms email
      const forgotPasswordOtp = Math.floor(Math.random() * 90000) + 10000;

      // some update e.g redis

      await new Email(user, forgotPasswordOtp.toString()).sendPasswordReset();

      res.status(200).json({
        status: "success",
        message: "Token sent to your email!",
      });
    } catch (e: any) {
      return next(new AppError(e.message, 422));
    }
  }
);

export { forgotPassword };
