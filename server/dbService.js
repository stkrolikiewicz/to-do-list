const mysql = require("mysql");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("db " + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM tasks;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                // const query =
                //     "INSERT INTO tasks (name, description, dueDate, project, priority) VALUES (?,?,?,?,?);";
                const query = "INSERT INTO tasks (name) VALUES (?);";
                connection.query(
                    query,
                    // [name, description, dueDate, project, priority],
                    [name],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId);
                    }
                );
            });

            return {
                id: insertId,
                name: name,
            };
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;
