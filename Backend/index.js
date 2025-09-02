import express from "express";
import cors from "cors";
import multer from "multer";
import pkg from "pg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const { Pool } = pkg;

// PostgreSQL pool (local pgAdmin)
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "expense tracker",
  password: "yonatan7525",
  port: 5432,
});

// Express app
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder for uploaded images
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ------------------- ROUTES -------------------

// Add new user
app.post("/users", upload.single("profile"), async (req, res) => {
  const { id, email, name } = req.body;          // text fields from FormData
  const profileImg = req.file ? `/uploads/${req.file.filename}` : null; // file path
  try {
    await pool.query(
      `INSERT INTO users (id, email, name, profile_img)
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (id) DO UPDATE
   SET email = EXCLUDED.email,
       name = EXCLUDED.name,
       profile_img = COALESCE(EXCLUDED.profile_img, users.profile_img)`,
      [id, email, name, profileImg]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert user" });
  }
});


// Add expense
app.post("/expenses", async (req, res) => {
  const { userId, amount, type, description } = req.body;
  try {
    await pool.query(
      "INSERT INTO expenses (user_id, amount, type, description) VALUES ($1, $2, $3, $4)",
      [userId, amount, type, description]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
    console.log("userInfo", result.rows[0].profile_img)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/income/:userId", async (req, res) => {
  const { userId } = req.params;
  const { source, amount, date, emoji } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO income (user_id, income_source, amount, date, emoji) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, source, amount, date, emoji]
    );
    res.json(result.rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add income" });
  }
});

app.get("/income/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM income WHERE user_id = $1", [userId]);
    res.json(result.rows); 
    console.log("list", result.rows);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add income" });
  }
});

// Get expenses
app.get("/expenses/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM expenses WHERE user_id = $1", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Get summary
app.get("/summary/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expense,
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END),0) as balance
       FROM expenses
       WHERE user_id = $1`,
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// Serve uploaded images
app.use("/uploads", express.static(uploadFolder));

app.listen(4000, () => console.log("✅ Backend running on http://localhost:4000"));
