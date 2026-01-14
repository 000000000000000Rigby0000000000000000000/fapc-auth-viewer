/*
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); 
const OpenAI = require("openai");
const { getAuthorizationUrl, getUserProfile } = require('../controllers/auth.js');
const { authCallbackMiddleware, authRefreshMiddleware } = require('../middlewares/auth.js');
const { OPENAI_API_KEY } = require('../../config.js'); 

let router = express.Router();

const openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY
});

async function getAISummary(prompt) {
    const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
    });
    
    return response.choices[0].message.content.trim();
}


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
        const { category, item, propertiesText } = req.body;
        let prompt = '';

        if (propertiesText) {
            
            if (!OPENAI_API_KEY) {
                console.warn("OPENAI_API_KEY is missing. Cannot generate summary.");
                return res.status(500).json({ error: "OpenAI API Key is missing." });
            }
            
            prompt = `
You are an expert BIM engineer.
Analyze the following element properties from a 3D model:
say hello.
---
${propertiesText}
---

Write a clean, technical 4–6 line summary of this element.
Focus only on: functional purpose, materials, structural behavior, and where it is typically used, based *only* on the provided data.
If critical information (like material or size) is missing, mention it briefly.

No introductions, no disclaimers, no lists, no markdown. Just plain text.
`;
        } else if (category && item) {
            
            prompt = `
You are an expert BIM engineer.
Write a clean, technical 4–6 line summary of a construction model element.
Focus only on: functional purpose, materials, structural behavior, and where it is typically used.

Category: ${category}
Item: ${item}

No introductions, no disclaimers, no lists, no markdown. Just plain text.
`;
        } else {
            return res.status(400).json({ error: "Missing category/item or element properties" });
        }

        const summary = await getAISummary(prompt);
        res.json({ summary });

    } catch (err) {
        console.error("AI SUMMARY ERROR:", err);
        res.status(500).json({ error: "AI summary failed" });
    }
});


module.exports = router;
*/

const express = require('express');
const path = require('path');
const fs = require('fs'); // Módulo para ler o ficheiro JSON
const fetch = require('node-fetch'); 
const OpenAI = require("openai");
const { getAuthorizationUrl, getUserProfile } = require('../controllers/auth.js');
const { authCallbackMiddleware, authRefreshMiddleware } = require('../middlewares/auth.js');
const { OPENAI_API_KEY } = require('../../config.js'); 

let router = express.Router();

const openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY
});

async function getAISummary(prompt) {
    const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300 // Aumentado ligeiramente para caber a recomendação
    });
    
    return response.choices[0].message.content.trim();
}


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
        const { category, item, propertiesText } = req.body;
        
        // --- NOVA VARIÁVEL: Lendo o conteúdo do seu .json ---
        // Ajusta o caminho "../../data.json" para o local real do teu ficheiro
        const jsonPath = path.join(__dirname, "../../items.json");
        let catalogData = "";
        try {
            catalogData = fs.readFileSync(jsonPath, 'utf8');
        } catch (err) {
            console.warn("Aviso: Ficheiro .json não encontrado no caminho especificado.");
            catalogData = "No additional items available.";
        }

        let prompt = '';

        if (propertiesText) {
            
            if (!OPENAI_API_KEY) {
                console.warn("OPENAI_API_KEY is missing. Cannot generate summary.");
                return res.status(500).json({ error: "OpenAI API Key is missing." });
            }
            
            prompt = `
You are an expert BIM engineer.
Analyze the following element properties from a 3D model:
---
${propertiesText}
---

Write a clean, technical 4–6 line summary of this element.
Focus only on: functional purpose, materials, structural behavior, and where it is typically used.

NEW PARAGRAPH:
Create a section called "RECOMENDATION:" and, based on the following catalog data, recommend the item that makes the most sense to be used or associated with this element:
${catalogData}

No introductions, no disclaimers, no lists, no markdown. Just plain text.
`;
        } else if (category && item) {
            
            prompt = `
You are an expert BIM engineer.
Write a clean, technical 4–6 line summary of a construction model element.
Focus only on: functional purpose, materials, structural behavior, and where it is typically used.

Category: ${category}
Item: ${item}

NEW PARAGRAPH:
Create a section called "RECOMENDATION:" and, based on the following catalog data, recommend the item that makes the most sense to be used or associated with this element based on category and item:
${catalogData}

No introductions, no disclaimers, no lists, no markdown. Just plain text.
`;
        } else {
            return res.status(400).json({ error: "Missing category/item or element properties" });
        }

        const summary = await getAISummary(prompt);
        res.json({ summary });

    } catch (err) {
        console.error("AI SUMMARY ERROR:", err);
        res.status(500).json({ error: "AI summary failed" });
    }
});


module.exports = router;