import express from 'express';
const router = express.Router();

// Gibt aktuellen Nutzer zurück
router.get('/me', (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user});
  } else {
    return res.json({ loggedIn: false });
  }
});

export default router;