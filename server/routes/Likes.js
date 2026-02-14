const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id; // Extract user ID from the validated token

    const found = await Likes.findOne({
        where: { PostId: PostId, UserId: UserId },
    });
    if (!found) {
        res.json({ liked: true });
        await Likes.create({ PostId: PostId, UserId: UserId });
    } else {
        await Likes.destroy({ where: { PostId: PostId, UserId: UserId } });
        res.json({ liked: false });
    }
});

module.exports = router;
