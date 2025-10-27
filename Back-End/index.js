import express from "express";
import cors from "cors";
import multer from "multer";
import pkg from "pg";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const { Pool } = pkg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const allowedOrigins = [
    "https://expense-tracker8.vercel.app",
    "http://localhost:5173"
];

const app = express();
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);
app.use(express.json());

const upload = multer();

// ------------------- HELPER -------------------
function handleError(res, context, err) {
    console.error(`❌ ${context}:`, err.message || err);
    if (err.stack) console.error(err.stack);
    res.status(500).json({ error: `Failed to ${context}`, details: err.message || err });
}

// ------------------- ROUTES -------------------

// Add new user
app.post("/users", upload.single("profile"), async (req, res) => {
    const { id, email, name } = req.body;
    let profileImg = null;

    try {
        if (req.file) {
            const fileExt = req.file.originalname.split(".").pop();
            const fileName = `profiles/${id}-${Date.now()}.${fileExt}`;

            const { error } = await supabase.storage
                .from("avatars")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });

            if (error) throw error;

            const { data, publicURL } = supabase.storage.from("avatars").getPublicUrl(fileName);
            profileImg = data?.publicUrl || publicURL || null;

            console.log("Saving profileImg:", profileImg);
        }

        await pool.query(
            `INSERT INTO users (id, email, name, profile_img)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) DO UPDATE
             SET email = EXCLUDED.email,
                 name = EXCLUDED.name,
                 profile_img = COALESCE(EXCLUDED.profile_img, users.profile_img)`,
            [id, email, name, profileImg]
        );

        res.json({ success: true, profileImg });
    } catch (err) {
        handleError(res, "insert user", err);
    }
});

// Get user
app.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(result.rows[0]);
    } catch (err) {
        handleError(res, "fetch user", err);
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
        handleError(res, "add expense", err);
    }
});

// Add income
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
        handleError(res, "add income", err);
    }
});

// Update income
app.patch("/income/:userId/:itemId", async (req, res) => {
    const { userId, itemId } = req.params;
    const { source, amount, date, emoji } = req.body;
    try {
        const result = await pool.query(
            `UPDATE income 
             SET income_source=$1, amount=$2, date=$3, emoji=$4 
             WHERE id=$5 AND user_id=$6 RETURNING *`,
            [source, amount, date, emoji, itemId, userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Income not found" });
        res.json(result.rows[0]);
    } catch (err) {
        handleError(res, "update income", err);
    }
});

// Similarly, update expense
app.patch("/expense/:userId/:itemId", async (req, res) => {
    const { userId, itemId } = req.params;
    const { source, amount, date, emoji } = req.body;
    try {
        const result = await pool.query(
            `UPDATE expense 
             SET expense_category=$1, amount=$2, date=$3, emoji=$4
             WHERE id=$5 AND user_id=$6 RETURNING *`,
            [source, amount, date, emoji, itemId, userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Expense not found" });
        res.json(result.rows[0]);
    } catch (err) {
        handleError(res, "update expense", err);
    }
});

// Delete income
app.delete("/income/:userId/:itemId", async (req, res) => {
    const { userId, itemId } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM income WHERE user_id=$1 AND id=$2 RETURNING *",
            [userId, itemId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Income not found" });
        res.json(result.rows[0]);
    } catch (err) {
        handleError(res, "delete income", err);
    }
});

// Delete expense
app.delete("/expense/:userId/:itemId", async (req, res) => {
    const { userId, itemId } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM expense WHERE user_id=$1 AND id=$2 RETURNING *",
            [userId, itemId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Expense not found" });
        res.json(result.rows[0]);
    } catch (err) {
        handleError(res, "delete expense", err);
    }
});

// Other GET routes (recent transactions, summary, etc.) can use handleError the same way
// Example:
app.get("/summary/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const incomeResult = await pool.query(
            "SELECT COALESCE(SUM(amount),0) AS total_income FROM income WHERE user_id=$1",
            [userId]
        );
        const expenseResult = await pool.query(
            "SELECT COALESCE(SUM(amount),0) AS total_expense FROM expense WHERE user_id=$1",
            [userId]
        );

        const totalIncome = parseFloat(incomeResult.rows[0].total_income);
        const totalExpense = parseFloat(expenseResult.rows[0].total_expense);
        const balance = totalIncome - totalExpense;

        res.json({ totalIncome, totalExpense, balance });
    } catch (err) {
        handleError(res, "fetch summary", err);
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
