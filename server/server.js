import express from 'express';
import mongoose from 'mongoose';
import Quote from './models/Quotes.js';
import dotenv from 'dotenv';
import axios from 'axios';

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

mongoose.connect('mongodb://localhost:27017/Quotes')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(express.json());
app.use(cors());


app.get("/api/quote", async (req, res) => {
    try {
        console.log("Fetching a random quote from API Ninjas...");


        console.log("Request Headers:", {
            "X-Api-Key": process.env.API_KEY,
        });

        const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
            headers: {
                "X-Api-Key": process.env.API_KEY, // Correct header name
            },
        });

        if (response.data && response.data.length > 0) {
            res.json(response.data[0]); // Send the first quote from the response
        } else {
            res.status(404).json({ error: "No quotes found" });
        }
    } catch (err) {
        console.error("Error fetching random quote:", err.message);
        res.status(500).json({ error: "Failed to fetch random quote" });
    }
});

app.post("/api/quotes", async (req, res) => {
    try {
        const { quote, author } = req.body;
        const newQuote = new Quote({ quote, author });
        await newQuote.save();
        res.status(201).json({ message: "Quote Saved successfully!" })
    }
    catch (err) {
        res.status(500).json({ error: "Failed to save quote" })
    }
})

app.get("/api/quotes", async (req, res) => {
    try {
        const savedQuotes = await Quote.find();
        res.json(savedQuotes);
    } catch (err) {
        res.status(500).json({ error: "failed to fetch quote" })
    }
})

console.log("API Key:", process.env.API_KEY)

app.listen(PORT, () => {
    console.log(`The server is running on PORT ${PORT}`)
});