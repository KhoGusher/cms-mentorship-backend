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
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      console.log("sign up service")
      const { first_name, last_name, phone_number, email, password } = req.body;

      // hash our password before inserting to database
      const hashedPassword = await Password.toHash(password);

      console.log("password hasshed" + hashedPassword)

      const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        email,
      ]);
      console.log("rows : " + rows.length)


      if (rows.length != 0) {
        return res.status(409).json({
          status: "fail",
          message: "account exist, log in"
        })
        // return next(new AppError("Account exists, please login", 409));
      }

      console.log("about to insert")
      const q2 = await pool.query(
        `INSERT INTO users(first_name, last_name, phone_number, email, password)
               VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [first_name, last_name, phone_number, email, hashedPassword]
      );

      console.log("inserted")

      let user = q2.rows[0];

      // // generate token to compare with when user confirms email
      // const emailOtp = Math.floor(Math.random() * 90000) + 10000;

      // await new Email(user, emailOtp.toString()).confirmEmail();

      res.status(200).json({
        status: "success",
        message: `Registration successfull, Token sent to ${email}`,
        data: {
          phone: phone_number,
        },
      });
    } catch (err: any) {
      console.log("catch")
      console.log(err)
      return next(new AppError(err.message, 422));
    }
  }
);

export { signUp };
