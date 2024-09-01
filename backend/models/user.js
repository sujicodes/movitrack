import db from "../config/db";

export const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const getExisitingUser = (authId, email) => {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM users WHERE auth_id = ? OR email = ?",
            [authId, email],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            },
        );
    });
};

export const createUser = (name, email, authId, authType) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (fullname, email, auth_id, auth_type) VALUES (?, ?, ?, ?)",
            [name, email, authId, authType],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            },
        );
    });
};
