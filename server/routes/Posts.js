const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { where } = require("sequelize");

router.get("/", validateToken, async (req, res) => {
    try {
        const postList = await Posts.findAll({ include: [Likes] });
        const likedPosts = await Likes.findAll({
            where: { UserId: req.user.id },
        });
        res.json({ postList, likedPosts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            error: error.message || "Failed to fetch posts",
        });
    }
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;

    let post = await Posts.findByPk(id, { include: [Likes] });
    const likedByUser = post.Likes.some((like) => like.UserId === userId);

    res.json({
        ...post.toJSON(),
        likedByUser,
        likesCount: post.Likes.length,
    });
});
//to get all posts of a specific user by their userId, this will be used in the profile page to show all posts of the user whose profile is being viewed
router.get("/byuserId/:id", async (req, res) => {
    const id = req.params.id;
    let listofUserPosts = await Posts.findAll({
        where: { UserId: id },
        include: [Likes],
    });
    res.json(listofUserPosts);
});

router.post("/", validateToken, async (req, res) => {
    try {
        const post = req.body;
        post.username = req.user.username; // Set the username from the validated token
        post.UserId = req.user.id; // Set the UserId from the validated token
        const newPost = await Posts.create(post);
        res.json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

router.put("/title", validateToken, async (req, res) => {
    try {
        const { newTitle, id } = req.body; //destructure title from the request body
        await Posts.update({ title: newTitle }, { where: { id: id } });
        res.json(newTitle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update post" });
    }
});
router.put("/body", validateToken, async (req, res) => {
    try {
        const { newPostText, id } = req.body; //destructure postText from the request body
        await Posts.update({ postText: newPostText }, { where: { id: id } });
        res.json(newPostText);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update post" });
    }
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    await Posts.destroy({ where: { id: postId } });
    res.json("Post deleted");
});

module.exports = router;
