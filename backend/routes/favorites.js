const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Add Favorite
router.post("/:itemId", async (req, res) => {
  const { supabase } = req;
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: userId, bakery_id: itemId }]);

    if (error) {
      if (error.code === "23505") {
        // Unique violation
        return res
          .status(400)
          .json({ success: false, message: "Already a favorite" });
      }
      throw error;
    }

    res.json({ success: true, message: "Added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Remove Favorite
router.delete("/:itemId", async (req, res) => {
  const { supabase } = req;
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("bakery_id", itemId);

    if (error) throw error;

    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get My Favorites
router.get("/my-favorites", async (req, res) => {
  const { supabase } = req;
  const userId = req.user.id;

  try {
    // Join with bakeries
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
                bakery_id,
                bakeries:bakery_id (*)
            `
      )
      .eq("user_id", userId);

    if (error) throw error;

    // Flatten structure
    const favorites = data.map((f) => f.bakeries);

    res.json({ success: true, data: favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
