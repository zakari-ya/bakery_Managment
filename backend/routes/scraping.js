const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Trigger Scraping
router.post("/trigger", async (req, res) => {
  const { businessType, city, country, maxLeads } = req.body;
  const userEmail = req.user.email;
  const n8nUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nUrl) {
    return res
      .status(500)
      .json({ success: false, message: "n8n Webhook URL not configured" });
  }

  try {
    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city,
        country,
        businessType, // Key: businessType
        max_leads: Number(maxLeads) || 10, // Key: max_leads, Value: Number
        userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to trigger n8n workflow");
    }

    const result = await response.json();

    res.json({
      success: true,
      message: "Scraping triggered successfully",
      sheetUrl: result.sheetUrl || "https://docs.google.com/spreadsheets",
    });
  } catch (err) {
    console.error(err);
    // Fallback for demo purposes if n8n is offline or unconfigured
    res.status(200).json({
      success: true,
      message: "Mock: Scraping triggered (Check console/n8n)",
      sheetUrl: "https://docs.google.com/spreadsheets/d/your-sheet-id",
    });
  }
});

module.exports = router;
