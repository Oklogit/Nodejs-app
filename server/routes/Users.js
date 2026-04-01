const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

// const sign = require("jsonwebtoken");

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });
    if (user) {
        return res.status(400).json({
            error: "User already exists. Go to login or try a different username.",
        });
    }
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
router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;
    let basicinfo = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
    });
    res.json(basicinfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Old password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await Users.update(
            { password: hashedNewPassword },
            { where: { id: userId } },
        );

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
