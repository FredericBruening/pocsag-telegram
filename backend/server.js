const sqlite3 = require('sqlite3');
const express = require("express");
const app = express();
app.use(express.json());

app.use(express.static('client'))


app.get("/", (req, res) => {
    res.render('index.html');
});

const HTTP_PORT = 8000

if (!process.env.DB) process.env.DB = './database.db'

const db = new sqlite3.Database(process.env.DB, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        db.run('CREATE TABLE receivers ( \
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            name NVARCHAR(50) NOT NULL,\
            ric INTEGER,\
            CHECK(name <> "")\
        )', (err) => {
            if (err) {
                // console.log("Table already exists.");
            }
        });
    }
});

app.get("/receivers/:id", (req, res, next) => {
    let params = [req.params.id]
    db.get("SELECT * FROM receivers where id = ?", [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json(row);
    });
});

app.get("/receivers", (req, res, next) => {
    db.all("SELECT * FROM receivers", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json(rows);
    });
});

app.post("/receivers", (req, res) => {
    db.run("INSERT INTO receivers (name, ric) VALUES (?,?)",
        [req.body.name, req.body.ric],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }
            res.status(201).json({
                "id": this.lastID
            })
        });
});

app.patch("/receivers", (req, res, next) => {
    let reqBody = req.body;
    db.run(`UPDATE receivers set name = ?, ric = ? WHERE id = ?`,
        [reqBody.name, reqBody.ric, reqBody.id],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message})
                return;
            }
            res.status(200).json({updated: this.changes});
        });
});

app.delete("/receivers/:id", (req, res, next) => {
    db.run(`DELETE FROM receivers WHERE id = ?`,
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message})
                return;
            }
            res.status(200).json({deleted: this.changes})
        });
});

app.post("/send-telegram", (req, res, next) => {
    // delegate to rptix driver implementation
    const {exec} = require('child_process');

    for (let receiver of req.body.receivers) {
        exec(`echo "${receiver}: ${req.body.message}"`, (error, stdout, stderr) => {
            // exec(`echo -e "${receiver}: ${this.message}" | pocsag -f 173236000 -r 512 -t 1`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    }

    res.status(200).json({sent: true})
})

const server = app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

module.exports = {server, db}


