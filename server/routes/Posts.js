const express = require("express");
const router = express.Router();
const { Posts } = require("../models");

router.get("/", async (req, res) => {
    const postList = await Posts.findAll();
    res.json(postList);
});

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    let post = await Posts.findByPk(id);
    res.json(post);
});

router.post("/", async (req, res) => {
    try {
        const post = req.body;
        const newPost = await Posts.create(post);
        res.json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

module.exports = router;
