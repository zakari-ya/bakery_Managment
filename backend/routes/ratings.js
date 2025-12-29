const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/ratings
// Body: { bakeryId, score }
router.post("/", authMiddleware, async (req, res) => {
  const { supabase } = req;
  const { bakeryId, score } = req.body;
  const userId = req.user.id;

  if (!bakeryId || !score || score < 1 || score > 5) {
    return res.status(400).json({ success: false, message: "Invalid rating" });
  }

  try {
    // 1. Upsert Rating (Insert or Update if exists)
    const { error: upsertError } = await supabase
      .from("ratings")
      .upsert(
        { user_id: userId, bakery_id: bakeryId, score },
        { onConflict: "user_id, bakery_id" }
      );

    if (upsertError) throw upsertError;

    // 2. Calculate New Average
    const { data: ratings, error: fetchError } = await supabase
      .from("ratings")
      .select("score")
      .eq("bakery_id", bakeryId);

    if (fetchError) throw fetchError;

    console.log(
      `Debug Rating: Found ${ratings.length} ratings for bakery ${bakeryId}`
    );

    const totalScore = ratings.reduce((acc, r) => acc + r.score, 0);
    const avgRating = (totalScore / ratings.length).toFixed(1); // 1 decimal

    // 3. Update Bakery Table
    const { error: updateError } = await supabase
      .from("bakeries")
      .update({ rating: avgRating })
      .eq("id", bakeryId);

    if (updateError) throw updateError;

    res.json({ success: true, newRating: avgRating });
  } catch (err) {
    console.error("Rating Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit rating" });
  }
});

// GET /api/ratings/my-rating/:bakeryId
router.get("/my-rating/:bakeryId", authMiddleware, async (req, res) => {
  const { supabase } = req;
  const { bakeryId } = req.params;
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("score")
      .eq("user_id", userId)
      .eq("bakery_id", bakeryId)
      .single();

    // It's okay if no data found, just return null
    if (error && error.code !== "PGRST116") throw error;

    res.json({ success: true, score: data ? data.score : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
