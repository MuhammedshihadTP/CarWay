const adminmodel = require("../models/adminmodel");
const bcrypt = require("bcrypt");
const adminsignup = require("../models/adminmodel");
const vehiclesmodel = require("../models/vehicles");
const { post } = require("../routers/adminRouter");
const { render } = require("ejs");

module.exports = {
  adminhome: async (req, res) => {
    try {
      const adminid = req.session.admin;
      const admin = await adminmodel.findOne({ _id: adminid });
      if (admin) {
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

  adminlogout: async (req, res) => {
    try {
      req.session.admin = null;
      res.redirect("/admin/login");
    } catch (error) {
      console.log(error);
    }
  },

  getdashbord: async (req, res) => {
    try {
      const adminid = req.session.admin;
      if (adminid) {
        res.render("admin/admindshbord");
      } else {
        res.redirect("/admin/login");
      }
    } catch (error) {}
  },

  getaddvehcles: async (req, res) => {
    const adminid = req.session.admin;
    console.log(adminid, "hl;ooo");
    const adminfind = await adminmodel.findOne({ _id: adminid });
    if (adminfind) {
      res.render("admin/addvehicles", { adminfind });
    } else {
      res.redirect("/admin/login");
    }
  },

  postaddvehicles: async (req, res) => {
    console.log(req.file);
    try {
      const addvehicles = new vehiclesmodel({
        name: req.body.name,
        Rcnumber: req.body.rcnumber,
        modelname: req.body.model,
        image: req.file.filename,
        location: req.body.location,
        price: req.body.price,
        moredetails: req.body.moredetealis,
      });

      console.log(addvehicles);
      addvehicles.save().then((result) => {
        console.log(result);
        res.redirect("/admin");
      });
    } catch (error) {
      console.log(error);
    }
  },

  viwevehcilelist: async (req, res) => {
    try {
      const adminid = req.session.admin;
      console.log(adminid, "hl;ooo");
      const adminfind = await adminmodel.findOne({ _id: adminid });
      await vehiclesmodel.find().then((result) => {
        if (adminfind) {
          res.render("admin/listvehicles", { adminfind, result });
        } else {
          res.redirect("/admin/login");
        }
      });
    } catch (error) {}
  },

  editvehcilelist: async (req, res) => {
    try {
      const id = req.params.id;
      const vehiclesData = await vehiclesmodel.findOne({ _id: id });
      if (vehiclesData) {
        res.render("admin/eaditvehicles ", { vehiclesData });
      } else {
        res.redirect("/admin/viewvehicles");
      }
    } catch (error) {
      console.log(error);
    }
  },

  posteditvehicles: async (req, res) => {
    try {
      const id = req.params.id;
      await vehiclesmodel
        .updateOne(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              Rcnumber: req.body.rcnumber,
              modelname: req.body.model,
              image: req.file.filename,
              location: req.body.location,
              price: req.body.price,
              moredetails: req.body.moredetealis,
            },
          }
        )
        .then((result) => {
          console.log(result);
          res.redirect("/admin/viewvehicles");
        });
    } catch (error) {
      console.log(error);
    }
  },

  deletevehicless:async(req,res)=>{
    try {
      const id=req.params.id;
      await vehiclesmodel.deleteOne({_id:id}).then(result=>{
        console.log(result);
        res.redirect('/admin');
      })
    } catch (error) {
      
    }

  }
};
