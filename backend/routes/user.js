const router = require("express").Router();

router.get("/profile", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  res.json(req.user);
});

module.exports = router;
