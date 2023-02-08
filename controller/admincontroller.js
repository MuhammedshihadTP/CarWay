const adminmodel = require("../models/adminmodel");
const bcrypt = require("bcrypt");
const adminsignup = require("../models/adminmodel");
const vehiclesmodel = require("../models/vehicles");

module.exports = {
  adminhome: async (req, res) => {
    try {
      if (req.session.admin) {
        res.render("admin/admindshbord");
      } else {
        res.redirect("/admin/signup");
      }
    } catch (error) {}
  },
  getadminsignup: (req, res) => {
    res.render("admin/adminsignup");
  },

  postadminsignup: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const adminexist = await adminmodel.findOne({ email: email });
      if (adminexist) {
        return res.status(401).json({ msg: "email already exist" });
      } else {
        let password = req.body.password;
        await bcrypt.hash(password, 10).then((hashedPassword) => {
          password = hashedPassword;
          console.log(password, "hai");

          const newadmin = new adminmodel({ name, email, password });
          console.log(newadmin);
          newadmin.save();
          req.session.admin = newadmin;
          res.redirect("/admin/login");
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  getadminlogin: async (req, res) => {
    try {
      res.render("admin/adminlogin");
    } catch (error) {
      console.log(error);
    }
  },

  postadminlogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      const admin = await adminmodel.findOne({ email: email });

      if (!admin) {
        res.status(401).json({ msg: "user not founded" });
      }
      if (admin) {
        bcrypt.compare(password, admin.password).then((result) => {
          if (result) {
            // console.log(result);
            req.session.admin = admin;
            res.redirect("/admin");
          } else {
            res.redirect("/admin/login");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  getaddvehcles: async (req, res) => {
    const adminid = req.session.admin;
    console.log(adminid, "hl;ooo");
    const adminfind = await adminmodel.findOne({ _id: adminid });
    res.render("admin/addvehicles", { adminfind });
  },

  postaddvehicles: async (req, res) => {
    try {
      const addvehicles = new vehiclesmodel({
        name: req.body.name,
        Rcnumber: req.body.rcnumber,
        modelname: req.body.model,
        image: req.body.image,
        location: req.body.location,
        price: req.body.price,
        moredetails: req.body.moredetealis,
      })
    } catch (error) {
      console.log(error);
    }
  },
};
