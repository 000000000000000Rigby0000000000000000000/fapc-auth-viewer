const express = require('express');
const path = require('path');
const OpenAI = require("openai");
const { getAuthorizationUrl, getUserProfile } = require('../controllers/auth.js');
const { authCallbackMiddleware, authRefreshMiddleware } = require('../middlewares/auth.js');
const { OPENAI_API_KEY } = require('../../config.js');

let router = express.Router();


router.get('/api/auth/login', (req, res) => {
    res.redirect(getAuthorizationUrl());
});

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/home.html"));
});

router.get("/home/:category/:item", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/item.html"));
});

router.get('/api/auth/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

router.get('/api/auth/callback', authCallbackMiddleware, (req, res) => {
    res.redirect('/home');
});

router.get('/api/auth/token', authRefreshMiddleware, (req, res) => {
    res.json(req.publicOAuthToken);
});

router.get('/api/auth/profile', authRefreshMiddleware, async (req, res, next) => {
    try {
        const profile = await getUserProfile(req.internalOAuthToken.access_token);
        res.json({ name: profile.name });
    } catch (err) {
        next(err);
    }
});


router.post("/api/summary", async (req, res) => {
    try {
        const { category, item } = req.body;

        if (!category || !item) {
            return res.status(400).json({ error: "Missing category or item" });
        }

        const client = new OpenAI({
            apiKey: OPENAI_API_KEY
        });

        const prompt = `
You are an expert BIM engineer.

Write a clean, technical 4–6 line summary of a construction model element.
Focus only on:
- functional purpose
- materials
- structural behavior
- where it is typically used

Category: ${category}
Item: ${item}

No introductions, no disclaimers, no lists, no markdown. Just plain text.
`;

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt,
            max_output_tokens: 150
        });

        const summary = response.output[0].content[0].text;

        res.json({ summary });

    } catch (err) {
        console.error("AI SUMMARY ERROR:", err);
        res.status(500).json({ error: "AI summary failed" });
    }
});

module.exports = router;
