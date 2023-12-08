const PG_DB = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  URI: process.env.DB_URI,
  ssl: { rejectUnauthorized: false },
};

export { PG_DB };
