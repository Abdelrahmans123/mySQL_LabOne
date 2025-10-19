document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    const loadDatabases = () => {
        fetch("http://localhost:3000/api/getDatabases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Databases:", data);

                const tbody = document.querySelector("#databaseTable tbody");
                tbody.innerHTML = "";
                data.forEach((db, index) => {
                    const row = document.createElement("tr");

                    const indexCell = document.createElement("td");
                    indexCell.textContent = index + 1;

                    const nameCell = document.createElement("td");
                    nameCell.textContent = db.Database;

                    row.appendChild(indexCell);
                    row.appendChild(nameCell);

                    // --- Actions ---
                    const actionCell = document.createElement("td");

                    // Show Tables button
                    const showBtn = document.createElement("button");
                    showBtn.className = "btn btn-sm btn-primary me-2";
                    showBtn.innerHTML =
                        '<i class="fas fa-eye"></i> Show Tables';
                    showBtn.addEventListener("click", () => {
                        loadTables(db.Database);
                    });
                    actionCell.appendChild(showBtn);

                    // Create Table button
                    const createBtn = document.createElement("button");
                    createBtn.className = "btn btn-sm btn-success";
                    createBtn.innerHTML =
                        '<i class="fas fa-plus"></i> Create Table';
                    createBtn.addEventListener("click", () => {
                        openCreateTableModal(db.Database);
                    });
                    actionCell.appendChild(createBtn);

                    row.appendChild(actionCell);
                    tbody.appendChild(row);
                });

                const dbSelect = document.getElementById("assignDatabase");
                if (dbSelect) {
                    dbSelect.innerHTML =
                        "<option value=''>-- Select Database --</option>";
                    data.forEach((db) => {
                        const option = document.createElement("option");
                        option.value = db.Database;
                        option.textContent = db.Database;
                        dbSelect.appendChild(option);
                    });
                }
            })
            .catch((err) => {
                console.error("Error fetching databases:", err);
            });
    };

    const loadTables = (databaseName) => {
        fetch("http://localhost:3000/api/getTables", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, databaseName }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((tables) => {
                console.log("Tables received:", tables);

                const tablesList = document.getElementById("tablesList");
                tablesList.innerHTML = "";

                // Update header to show which database we're viewing
                const tablesHeader = document.querySelector(
                    ".card-modern .card-header-modern.secondary h5"
                );
                if (tablesHeader) {
                    tablesHeader.innerHTML = `<i class="fas fa-table"></i> Tables in <strong>${databaseName}</strong>`;
                }

                if (!tables || tables.length === 0) {
                    const li = document.createElement("li");
                    li.className = "list-group-item text-center text-muted";
                    li.innerHTML =
                        '<i class="fas fa-info-circle"></i> No tables found in this database';
                    tablesList.appendChild(li);
                    return;
                }

                tables.forEach((table) => {
                    const li = document.createElement("li");
                    li.className =
                        "list-group-item d-flex justify-content-between align-items-center";
                    li.innerHTML = `
                        <span><i class="fas fa-table text-info"></i> ${table.table_name}</span>
                        <span class="badge bg-info rounded-pill">${databaseName}</span>
                    `;
                    tablesList.appendChild(li);
                });
            })
            .catch((error) => {
                console.error("Error loading tables:", error);
                const tablesList = document.getElementById("tablesList");
                tablesList.innerHTML = "";
                const li = document.createElement("li");
                li.className = "list-group-item text-center text-danger";
                li.innerHTML =
                    '<i class="fas fa-exclamation-triangle"></i> Error loading tables: ' +
                    error.message;
                tablesList.appendChild(li);
            });
    };

    const loadUsers = () => {
        fetch("http://localhost:3000/getUsers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Users:", data);

                const tbody = document.querySelector("#userTable tbody");
                tbody.innerHTML = "";

                data.forEach((user, index) => {
                    const row = document.createElement("tr");

                    const indexCell = document.createElement("td");
                    indexCell.textContent = index + 1;

                    const userCell = document.createElement("td");
                    userCell.innerHTML = `<i class="fas fa-user text-success"></i> ${user.user}`;

                    const hostCell = document.createElement("td");
                    hostCell.innerHTML = `<span class="badge bg-secondary">${user.host}</span>`;

                    const actionCell = document.createElement("td");
                    const deleteBtn = document.createElement("button");
                    deleteBtn.className = "btn btn-sm btn-danger";
                    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
                    deleteBtn.addEventListener("click", () => {
                        if (
                            confirm(
                                `Are you sure you want to delete user '${user.user}'@'${user.host}'?`
                            )
                        ) {
                            deleteUser(user.user, user.host);
                        }
                    });
                    actionCell.appendChild(deleteBtn);

                    row.appendChild(indexCell);
                    row.appendChild(userCell);
                    row.appendChild(hostCell);
                    row.appendChild(actionCell);
                    tbody.appendChild(row);
                });
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
            });
    };

    const deleteUser = (user, host) => {
        fetch("http://localhost:3000/api/deleteUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                userToDelete: user,
                hostToDelete: host,
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                alert(`✅ ${data}`);
                loadUsers();
            })
            .catch((err) => {
                console.error("Error deleting user:", err);
                alert("❌ Failed to delete user");
            });
    };

    if (username && password) {
        loadDatabases();
        loadUsers();

        document
            .querySelector("#addDatabaseForm")
            .addEventListener("submit", (e) => {
                e.preventDefault();
                const databaseName =
                    document.getElementById("databaseName").value;

                fetch("http://localhost:3000/api/addDatabase", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        databaseName: databaseName,
                    }),
                })
                    .then((response) => response.text())
                    .then((data) => {
                        console.log(data);
                        const modalEl =
                            document.getElementById("addDatabaseModal");
                        const modal = bootstrap.Modal.getInstance(modalEl);
                        modal.hide();
                        alert(`✅ ${data}`);
                        loadDatabases();
                        document.getElementById("databaseName").value = "";
                    })
                    .catch((err) => {
                        console.error("Error adding database:", err);
                        alert("❌ Failed to create database");
                    });
            });

        document
            .querySelector("#addUserForm")
            .addEventListener("submit", (e) => {
                e.preventDefault();
                const databaseName =
                    document.getElementById("assignDatabase").value;
                const newUsername =
                    document.getElementById("newUsername").value;
                console.log("🚀 ~ newUsername:", newUsername);
                const newPassword =
                    document.getElementById("newPassword").value;
                const newHost = document.getElementById("newHost").value;

                fetch("http://localhost:3000/api/addUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        newUser: newUsername,
                        newPassword,
                        newHost,
                        databaseName,
                    }),
                })
                    .then((response) => response.text())
                    .then((data) => {
                        console.log(data);

                        const modalEl = document.getElementById("addUserModal");
                        const modal = bootstrap.Modal.getInstance(modalEl);
                        modal.hide();

                        alert(`✅ ${data}`);
                        loadUsers();

                        document.getElementById("newUsername").value = "";
                        document.getElementById("newPassword").value = "";
                        document.getElementById("newHost").value = "%";
                    })
                    .catch((err) => {
                        console.error("Error adding user:", err);
                        alert("❌ Failed to create user");
                    });
            });
    }

    function openCreateTableModal(databaseName) {
        document.getElementById("selectedDatabase").value = databaseName;
        document.getElementById("tableName").value = "";
        const columnsTableBody = document.querySelector("#columnsTable tbody");
        columnsTableBody.innerHTML = "";
        const modal = new bootstrap.Modal(
            document.getElementById("createTableModal")
        );
        modal.show();
    }

    const columnsTableBody = document.querySelector("#columnsTable tbody");
    const addColumnBtn = document.getElementById("addColumnBtn");

    addColumnBtn.addEventListener("click", () => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><input type="text" class="form-control column-name" required /></td>
        <td>
            <select class="form-select column-type">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="TEXT">TEXT</option>
                <option value="DATE">DATE</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="DECIMAL">DECIMAL</option>
                <option value="FLOAT">FLOAT</option>
                <option value="DATETIME">DATETIME</option>
            </select>
        </td>
        <td><input type="text" class="form-control column-length" placeholder="e.g. 255" /></td>
        <td>
            <select class="form-select column-extra">
                <option value="">None</option>
                <option value="PRIMARY KEY AUTO_INCREMENT">PRIMARY KEY AUTO_INCREMENT</option>
                <option value="NOT NULL">NOT NULL</option>
                <option value="UNIQUE">UNIQUE</option>
                <option value="DEFAULT">DEFAULT</option>
            </select>
        </td>
        <td><button type="button" class="btn btn-sm btn-danger remove-column">X</button></td>
    `;
        columnsTableBody.appendChild(row);

        row.querySelector(".remove-column").addEventListener("click", () => {
            row.remove();
        });
    });

    document
        .getElementById("createTableForm")
        .addEventListener("submit", (e) => {
            e.preventDefault();

            const dbName = document.getElementById("selectedDatabase").value;
            const tableName = document.getElementById("tableName").value;

            const columns = [];
            let hasPrimaryKey = false;

            columnsTableBody.querySelectorAll("tr").forEach((row) => {
                const name = row.querySelector(".column-name").value.trim();
                const type = row.querySelector(".column-type").value;
                const length = row.querySelector(".column-length").value.trim();
                const extra = row.querySelector(".column-extra").value;

                if (!name) return;

                let colSQL = `\`${name}\` ${type}`;

                if (length && (type === "VARCHAR" || type === "DECIMAL")) {
                    colSQL += `(${length})`;
                }

                if (extra) {
                    if (extra.includes("PRIMARY KEY")) {
                        hasPrimaryKey = true;
                    }
                    colSQL += ` ${extra}`;
                }

                columns.push(colSQL);
            });

            if (columns.length === 0) {
                alert(
                    "❌ Please add at least one column before creating the table."
                );
                return;
            }

            const columnsSQL = columns.join(", ");

            fetch("http://localhost:3000/api/createTable", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    databaseName: dbName,
                    tableName,
                    columns: columnsSQL,
                }),
            })
                .then((res) => res.text())
                .then((msg) => {
                    alert("✅ " + msg);
                    bootstrap.Modal.getInstance(
                        document.getElementById("createTableModal")
                    ).hide();
                    columnsTableBody.innerHTML = "";
                    document.getElementById("tableName").value = "";
                })
                .catch((err) => {
                    console.error("Error:", err);
                    alert("❌ Failed to create table: " + err);
                });
        });
});
