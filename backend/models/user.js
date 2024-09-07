import db from "../config/db.js";

export const getUserById = (id) => {
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

export const createUser = (name, email, authId, picture, authType) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (fullname, email, auth_id, auth_type, picture) VALUES (?, ?, ?, ?, ?)",
            [name, email, authId, authType, picture],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            },
        );
    });
};

export const loginUser = async (name, email, authId, picture, authType) => {
    try {
        let user = await getExisitingUser(authId, email);
        if (user) {
            return { status: "exists", user };
        }
        const id = await createUser(name, email, authId, picture, authType);
        user = await getUserById(id);
        return { status: "created", user };
    } catch (error) {
        throw error;
    }
};
