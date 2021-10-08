const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * `GET /notes` should return the `notes.html` file.
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// * `GET *` should return the `index.html` file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteHistory = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let notelength = (noteHistory.length).toString();
    newNote.id = notelength;
    noteHistory.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(noteHistory));
    res.json(noteHistory);
});

app.delete("/api/notes/:id", (req, res) => {
    let noteHistory = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();
    noteHistory = noteHistory.filter(selected =>{
        return selected.id != noteId;
    })
    fs.writeFileSync("./db/db.json", JSON.stringify(noteHistory));
    res.json(noteHistory);
});

app.listen(PORT, () => console.log("Server listening on port " + PORT));

