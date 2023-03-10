const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
// dotenv.config();

const dbService = require("./dbService");
const { response } = require("express");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// create
app.post("/insert", (req, res) => {
    const { name, description, dueDate, project, priority } = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewTask(
        name,
        description,
        dueDate,
        project,
        priority
    );

    result
        .then((data) => res.json({ data: data }))
        .catch((err) => console.log(err));
});

// read
app.get("/getAll", (req, res) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();

    result
        .then((data) => res.json({ data: data }))
        .catch((err) => console.log(err));
});

// update
app.patch("/update", (req, res) => {
    const { id, name, description, dueDate, project, priority } = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateTaskById(
        id,
        name,
        description,
        dueDate,
        project,
        priority
    );

    result
        .then((data) => res.json({ success: data }))
        .catch((err) => console.log(err));
});

// delete
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);

    result
        .then((data) => res.json({ success: data }))
        .catch((err) => console.log(err));
});

// search
app.get("/search/:name", (req, res) => {
    const { name } = req.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name);

    result
        .then((data) => res.json({ data: data }))
        .catch((err) => console.log(err));
});

app.listen(process.env.PORT, () => {
    console.log("Server is running");
});
