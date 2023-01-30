const usersignup = require("../models/UserModel");
const Usermodel = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = {
    home: (req, res) => {
        res.render("home");
    },

    getsignup: (req, res) => {
        res.render("signup");
    },

    postsignup: async (req, res) => {
        try {
            bcrypt.hash(req.body.password, 10).then(hashedPassword => {
                req.body.password = hashedPassword
                const newUser = new usersignup(req.body);
                console.log(newUser);

                newUser.save();
               

                res.redirect("/");
            })

        } catch (error) {
            console.log(error);
        }
    },
};
