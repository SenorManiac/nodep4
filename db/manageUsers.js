const { name } = require('ejs');
const pool = require('./pool');
const bcrypt = require('bcrypt');


const checkIfUserExists = async (username) => {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows.length > 0 ? result.rows[0] : null;
};
async function addNewUser(username, password) {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)', [username, password, 'standard']);
    } finally {
        client.release();
    }
}

const findById = async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

async function updateRole(username, role) {
    const client = await pool.connect();
    try {
        await client.query('UPDATE users SET role = $1 WHERE username = $2', [role, username]);
    } finally {
        client.release();
    }
}

async function addToClub(username) {
    const client = await pool.connect();
    try {
        await client.query('UPDATE users SET in_the_club  = true WHERE username = $1', [username]);
    } finally {
        client.release();
    }
}

async function removeFromClub(username) {
    const client = await pool.connect();
    try {
        await client.query('UPDATE users SET in_the_club  = false WHERE username = $1', [username]);
    } finally {
        client.release();
    }
}

async function verifyPassword(username, password) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT password_hash FROM users WHERE username = $1', [username]);
        return await bcrypt.compare(password, result.rows[0].password_hash);
    } finally {
        client.release();
    }
}

const getPosts = async () => {
    const result = await pool.query("SELECT * FROM posts JOIN users ON posts.user_id = users.id");
    return result.rows;
};

const getPostsbyID = async (id) => {
    const result = await pool.query("SELECT * FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1", [id]);
    return result.rows;
};

const addPost = async (title, body, user_id) => {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO posts (title, body, user_id) VALUES ($1, $2, $3)', [title, body, user_id]);
    } finally {
        client.release();
    }
};

const deletePost = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM posts WHERE id = $1', [id]);
    } finally {
        client.release();
    }
};

module.exports = {
    checkIfUserExists,
    addNewUser,
    updateRole,
    addToClub,
    removeFromClub,
    verifyPassword,
    findById,
    getPosts,
    addPost,
    getPostsbyID,
    deletePost
};