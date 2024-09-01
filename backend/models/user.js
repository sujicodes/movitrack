import db from "../config/db.js";

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

export const loginUser = async (name, email, authId, authType) => {
    try {
        let user = await getExisitingUser(authId, email);
        if (user) {
            return { status: "exists", user };
        }
        const id = await createUser(name, email, authId, authType);
        user = await getUserById(lastID);
        return { status: "created", user };
    } catch (error) {
        throw error;
    }
};
