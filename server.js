const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/typingGame', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define score schema
const scoreSchema = new mongoose.Schema({
    username: String,
    time: Number,
    date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

app.use(cors());
app.use(express.json());

// Get top 10 scores
app.get('/scores', async (req, res) => {
    try {
        const scores = await Score.find()
            .sort({ time: 1 })
            .limit(10);
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

// Add new score
app.post('/scores', async (req, res) => {
    try {
        const { username, time } = req.body;
        const score = new Score({ username, time });
        await score.save();
        res.json(score);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save score' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});