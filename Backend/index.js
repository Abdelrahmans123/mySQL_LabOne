import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: username,
            password: password,
        });
        await connection.end();
        res.send(`<h2>✅ Login successful as ${username}</h2>`);
    } catch (err) {
        res.send(`<h2>❌ Login failed: ${err.message}</h2>`);
    }
});
app.post("/api/getDatabases", async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: username,
            password: password,
        });
        const [databases] = await connection.query("SHOW DATABASES");
        await connection.end();
        res.json(databases);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.post("/getUsers", async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: username,
            password: password,
        });

        // ✅ alias column names for consistency
        const [rows] = await connection.query(
            "SELECT User AS user, Host AS host FROM mysql.user"
        );
        await connection.end();

        res.json(rows);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/addDatabase", async (req, res) => {
    const { username, password, databaseName } = req.body;

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: username,
            password: password,
        });
        await connection.query(`CREATE DATABASE \`${databaseName}\``);
        await connection.end();
        res.send(`Database ${databaseName} created successfully.`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.post("/api/addUser", async (req, res) => {
    const { username, password, newUser, newHost, newPassword, databaseName } =
        req.body;

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: username,
            password: password,
        });
        await connection.query(
            `CREATE USER IF NOT EXISTS '${newUser}'@'${newHost}' IDENTIFIED BY '${newPassword}'`
        );

        // 2. Grant ALL privileges ONLY on the given database
        await connection.query(
            `GRANT ALL PRIVILEGES ON \`${databaseName}\`.* TO '${newUser}'@'${newHost}'`
        );

        // 3. Apply privileges
        await connection.query(`FLUSH PRIVILEGES`);

        await connection.end();

        res.send(
            `✅ User '${newUser}'@'${newHost}' created and assigned to database '${databaseName}'.`
        );
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).send(err.message);
    }
});
app.post("/api/createTable", async (req, res) => {
    const { username, password, databaseName, tableName, columns } = req.body;

    if (!columns || !columns.trim()) {
        return res.status(400).send("❌ No columns defined for the table.");
    }

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: username,
            password: password,
            database: databaseName,
        });
        const columnDefs = columns.split(",").map((col) => col.trim());
        let finalCols = [];
        let primaryKeys = [];
        columnDefs.forEach((col) => {
            let parts = col.split(" ").filter(Boolean);
            let colName = parts[0]; // ex: `id`
            let colType = (parts[1] || "").toUpperCase();
            let extra = parts.slice(2).join(" ");
            if (colType === "VARCHAR" && !/\(.*\)/.test(col)) {
                colType = "VARCHAR(255)";
            }
            if (/VARCHAR\(\d+\)/i.test(parts[1])) {
                colType = parts[1];
            }
            let colSQL = `${colName} ${colType}`;
            if (extra) {
                if (extra.toUpperCase().includes("PRIMARY KEY")) {
                    primaryKeys.push(colName);
                } else {
                    colSQL += " " + extra;
                }
            }
            finalCols.push(colSQL);
        });
        if (primaryKeys.length > 0) {
            finalCols.push(`PRIMARY KEY (${primaryKeys.join(", ")})`);
        }
        const sql = `CREATE TABLE \`${tableName}\` (${finalCols.join(", ")})`;
        await connection.query(sql);
        await connection.end();
        res.send(`Table ${tableName} created successfully in ${databaseName}.`);
    } catch (err) {
        console.error("Error creating table:", err);
        res.status(500).send(err.message);
    }
});
app.post("/api/getTables", async (req, res) => {
    const { username, password, databaseName } = req.body;

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: username,
            password: password,
            database: databaseName,
        });

        const [tables] = await connection.query("SHOW TABLES");
        await connection.end();

        // Format the response to have a consistent structure
        const formattedTables = tables.map((table) => {
            // The key is dynamic: Tables_in_<databaseName>
            const key = `Tables_in_${databaseName}`;
            const tableName = table[key];
            return { table_name: tableName };
        });

        console.log("Tables fetched:", formattedTables);
        res.json(formattedTables);
    } catch (err) {
        console.error("Error fetching tables:", err);
        res.status(500).json({ error: err.message, tables: [] });
    }
});
app.post("/api/deleteUser", async (req, res) => {
    const { username, password, userToDelete, hostToDelete } = req.body;

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: username,
            password: password,
        });

        // Drop the user
        await connection.query(
            `DROP USER IF EXISTS '${userToDelete}'@'${hostToDelete}'`
        );

        await connection.end();

        res.send(
            `✅ User '${userToDelete}'@'${hostToDelete}' deleted successfully.`
        );
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send(err.message);
    }
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
