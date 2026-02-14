const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
// const sign = require("jsonwebtoken");

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await Users.create({ username, password: hash });
    res.json({ message: "User created successfully" });
});
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    } else {
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                return res
                    .status(400)
                    .json({ error: "Wrong username and password combination" });
            }
            const accessToken = jwt.sign(
                { username: user.username, id: user.id },
                "importantsecret",
            );

            res.json({ token: accessToken, username: username, id: user.id });
        });
    }
});
router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
