const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

//get post by id i.e comments for post 1 or post 2
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({ where: { PostId: postId } });
    // console.log(`GET /${postId} - found ${comments.length} comments`);
    // res.json({ postId, count: comments.length, comments });
    res.json(comments);
});

// verify token before allowing comment creation
// router.post("/", validateToken, async (req, res) => {
//     const comment = req.body;
//     await Comments.create(comment);
//     res.json(comment);
//     console.log("comment", comment);
// });
router.post("/", validateToken, async (req, res) => {
    const comment = req.body;
    const createdComment = await Comments.create(comment);
    res.json(createdComment); // ← Return the created record with ID
    console.log("comment", createdComment);
});
module.exports = router;
