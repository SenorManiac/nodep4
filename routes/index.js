const express = require("express");
const router = express.Router();
const newUserController = require("../controllers/newUserController");
const passport = require("../controllers/passport");
const manageUsers = require("../db/manageUsers");
const { user } = require("../app");

router.get("/", (req, res) => {
    if (req.user) {
        return res.redirect("/home");
    }
    console.log("GET /");
    res.render("index");
});

router.get("/sign-up", (req, res) => {
    if (req.user) {
        return res.redirect("/home");
    }
    console.log("GET /sign-up");
    res.render("sign-up");
});

router.post("/sign-up", (req, res, next) => {
    console.log("POST /sign-up");
    newUserController.addNewUser(req, res, next);
});

router.get("/log-in", (req, res) => {
    if (req.user) {
        return res.redirect("/home");
    }
    console.log("GET /log-in");
    res.render("log-in");
});

router.post("/log-in", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/log-in",
    failureFlash: true,
}));

router.get("/home", (req, res) => {
    console.log("GET /home");
    if (!req.user) {
        return res.redirect("/log-in");
    } 
    manageUsers.getPosts().then((posts) => {
        res.render("home", { posts, user: req.user });
    }
    );
}
);

router.get("/newpost", (req, res) => {
    console.log("GET /new-post");
    if (!req.user) {
        return res.redirect("/log-in");
    }
    res.render("newpost");
});

router.post("/new-post", (req, res) => {
    console.log("POST /new-post");
    manageUsers.addPost(req.body.title, req.body.body, req.user.id).then(() => {
        res.redirect("/home");
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error adding post");
    });
});

router.get("/posts/:id", (req, res) => {
    console.log("GET /posts/:id");
    manageUsers.getPostsbyID(req.params.id).then((posts) => {
        if (posts.length === 0) {
            return res.status(404).send("Post not found");
        }
        const post = posts[0]; 
        const filteredPost = {
            id: post.id,
            title: post.title,
            body: post.body,
            created_at: post.created_at,
            updated_at: post.updated_at,
        };
        res.render("post", { post: filteredPost, user: req.user });
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error fetching post");
    });
});

router.get("/secret", (req, res) => {
    console.log("GET /secret");
    console.log(req.user);
    if (!req.user) {
        return res.redirect("/log-in");
    }
    res.render("secret");
}
);

router.post("/secret", (req, res) => {
    console.log("POST /secret");
    console.log(req.body);
    if (!req.user) {
        return res.redirect("/log-in");
    }
    else if (req.body.secret !== "x") {
        res.render("secret");}
    else {
      manageUsers.addToClub(req.user.username).then(() => {
        res.redirect("/home");
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error updating role");
    });}
});

router.post("/posts/:id", (req, res) => {
    if (req.query._method === 'DELETE') {
        console.log("POST /posts/:id?_method=DELETE");
        if (!req.user) {
            return res.redirect("/log-in");
        }
        manageUsers.deletePost(req.params.id).then(() => {
            res.redirect("/home");
        }).catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting post");
        });
    } else {
        res.status(400).send("Invalid method");
    }
});
module.exports = router;