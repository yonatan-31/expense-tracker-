import express from "express";
import cors from "cors";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const allowedOrigins = [
  "https://expense-tracker8.vercel.app",
  "http://localhost:5173"
];

const app = express();
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const upload = multer();

// ------------------- HELPER -------------------
function handleError(res, context, err) {
  console.error(`❌ ${context}:`, err.message || err);
  if (err.stack) console.error(err.stack);
  res.status(500).json({ error: `Failed to ${context}`, details: err.message || err });
}

// ------------------- ROUTES -------------------

// Add or update user
app.post("/users", upload.single("profile"), async (req, res) => {
  const { id, email, name } = req.body;
  let profileImg = null;

  try {
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `profiles/${id}-${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

      if (error) throw error;

      const { data, publicURL } = supabase.storage.from("avatars").getPublicUrl(fileName);
      profileImg = data?.publicUrl || publicURL || null;

      console.log("Saving profileImg:", profileImg);
    }

    const { error } = await supabase
      .from("users")
      .upsert({ id, email, name, profile_img: profileImg }, { onConflict: "id" });

    if (error) throw error;

    res.json({ success: true, profileImg });
  } catch (err) {
    handleError(res, "insert user", err);
  }
});

// Get user
app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "User not found" });

    res.json(data);
  } catch (err) {
    handleError(res, "fetch user", err);
  }
});

// Add expense
app.post("/expenses", async (req, res) => {
  const { userId, amount, type, description } = req.body;
  try {
    const { error } = await supabase
      .from("expenses")
      .insert([{ user_id: userId, amount, type, description }]);

    if (error) throw error;

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
    const { data, error } = await supabase
      .from("income")
      .insert([{ user_id: userId, income_source: source, amount, date, emoji }])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    handleError(res, "add income", err);
  }
});

// Update income
app.patch("/income/:userId/:itemId", async (req, res) => {
  const { userId, itemId } = req.params;
  const { source, amount, date, emoji } = req.body;
  try {
    const { data, error } = await supabase
      .from("income")
      .update({ income_source: source, amount, date, emoji })
      .eq("id", itemId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Income not found" });

    res.json(data);
  } catch (err) {
    handleError(res, "update income", err);
  }
});

// Update expense
app.patch("/expense/:userId/:itemId", async (req, res) => {
  const { userId, itemId } = req.params;
  const { source, amount, date, emoji } = req.body;
  try {
    const { data, error } = await supabase
      .from("expense")
      .update({ expense_category: source, amount, date, emoji })
      .eq("id", itemId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Expense not found" });

    res.json(data);
  } catch (err) {
    handleError(res, "update expense", err);
  }
});

// Delete income
app.delete("/income/:userId/:itemId", async (req, res) => {
  const { userId, itemId } = req.params;
  try {
    const { data, error } = await supabase
      .from("income")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Income not found" });

    res.json(data);
  } catch (err) {
    handleError(res, "delete income", err);
  }
});

// Delete expense
app.delete("/expense/:userId/:itemId", async (req, res) => {
  const { userId, itemId } = req.params;
  try {
    const { data, error } = await supabase
      .from("expense")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Expense not found" });

    res.json(data);
  } catch (err) {
    handleError(res, "delete expense", err);
  }
});

// Get summary
app.get("/summary/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: incomeData, error: incomeErr } = await supabase
      .from("income")
      .select("amount")
      .eq("user_id", userId);

    if (incomeErr) throw incomeErr;

    const { data: expenseData, error: expenseErr } = await supabase
      .from("expense")
      .select("amount")
      .eq("user_id", userId);

    if (expenseErr) throw expenseErr;

    const totalIncome = incomeData.reduce((acc, item) => acc + Number(item.amount), 0);
    const totalExpense = expenseData.reduce((acc, item) => acc + Number(item.amount), 0);

    res.json({ totalIncome, totalExpense, balance: totalIncome - totalExpense });
  } catch (err) {
    handleError(res, "fetch summary", err);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
