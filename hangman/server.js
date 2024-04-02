const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.static("public"));

async function fetchNewWord() {
    const apiUrl = "https://random-word-api.herokuapp.com/word?lang=en";
    try {
        const response = await axios.get(apiUrl);
        return response.data[0];
    } catch (error) {
        console.error("Error:", error);
        return null; // Return null or handle the error differently
    }
}

app.get("/fetchWord", async (req, res) => {
    try {
        const word = await fetchNewWord();
        res.json({ word });
    } catch (error) {
        console.error("Error fetching word", error);
        res.status(500).send("Error Fetching Word.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
