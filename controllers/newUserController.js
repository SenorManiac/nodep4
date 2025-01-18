const manageUsers = require("../db/manageUsers");
const bcrypt = require('bcrypt');

const addNewUser = async (req, res, next) => {
    try {
        console.log("addNewUser called");
        console.log(req.body);
        if (await manageUsers.checkIfUserExists(req.body.username)) {
            res.render("sign-up", { errorMessage: "User already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await manageUsers.addNewUser(req.body.username, hashedPassword);
            res.redirect("/log-in"); // Redirect to a different page after successful submission
        }
    } catch (error) {
        res.render("sign-up", { errorMessage: error.message });
    }
};

module.exports = {
    addNewUser
};