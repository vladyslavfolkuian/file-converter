const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.post('/convert', multer({dest: 'uploads/'}).single('file'), (req, res) => {
    try {
        const rawData = fs.readFileSync(req.file.path, 'utf8');
        const regex = /:\s*([^\s,]+)/g;
        const matches = rawData.match(regex);

        if (!matches || matches.length % 5 !== 0) {
            throw new Error('Невірний формат даних у файлі.');
        }

        const frames = [];

        for (let i = 0; i < matches.length; i += 5) {
            const [filename, x, y, w, h] = matches.slice(i, i + 5).map(match => match.split(":")[1].trim());

            if (!filename || !x || !y || !w || !h) {
                throw new Error('Немає необхідних значень.');
            }

            frames.push({
                "filename": filename,
                "frame": {"x": Number(x), "y": Number(y), "w": Number(w), "h": Number(h)},
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": {"x": 0, "y": 0, "w": Number(w), "h": Number(h)},
                "sourceSize": {"w": Number(w), "h": Number(h)},
                "pivot": {"x": 0.5, "y": 0.5}
            });
        }

        const data = {
            "frames": frames,
            "meta": {
                "app": "",
                "version": "1.0",
                "image": ".webp",
                "format": "RGBA8888",
                "size": {"w": 2000, "h": 2000},
                "scale": "1",
                "smartupdate": ""
            }
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
