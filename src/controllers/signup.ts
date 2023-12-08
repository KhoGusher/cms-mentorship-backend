import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Password } from "../services/password";
import { catchAsync } from "../utils/catchAsync";
import { Email } from "../services/sendgrid";
import { AppError } from "../utils/appError";

import { Pool } from "pg";
import { PG_DB } from "../services/postgres-database";

const pool = new Pool({
  ...PG_DB,
  port: Number(PG_DB.port),
});

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, phoneNumber, email, password } = req.body;

      // hash our password before inserting to database
      const hashedPassword = await Password.toHash(password);

      const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        email,
      ]);

      if (rows.length != 0) {
        return next(new AppError("Account exists, please login", 409));
      }

      const q2 = await pool.query(
        `INSERT INTO users(first_name, last_name, phone_number, email, password)
               VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [firstName, lastName, phoneNumber, email, hashedPassword]
      );

      let user = q2.rows[0];

      // generate token to compare with when user confirms email
      const emailOtp = Math.floor(Math.random() * 90000) + 10000;

      await new Email(user, emailOtp.toString()).confirmEmail();

      res.status(200).json({
        status: "success",
        message: `Registration successfull, Token sent to ${email}`,
        data: {
          phone: phoneNumber,
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 422));
    }
  }
);

export { signUp };
