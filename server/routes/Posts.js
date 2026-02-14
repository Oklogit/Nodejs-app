const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const postList = await Posts.findAll({ include: [Likes] });

    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
    res.json({ postList, likedPosts });
});

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    let post = await Posts.findByPk(id);
    res.json(post);
});

router.post("/", validateToken, async (req, res) => {
    try {
        const post = req.body;
        post.username = req.user.username; // Set the username from the validated token
        const newPost = await Posts.create(post);
        res.json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

module.exports = router;
