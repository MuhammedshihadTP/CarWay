const adminmodel = require("../models/adminmodel");
const bcrypt = require("bcrypt");
const adminsignup = require("../models/adminmodel");
const vehiclesmodel = require("../models/vehicles");
const { post } = require("../routers/adminRouter");
const { render } = require("ejs");
const coupenmodel = require("../models/coupenmodel.js");
const usermodel = require("../models/UserModel");


const { modelName } = require("../models/UserModel");

module.exports = {
  adminhome: async (req, res) => {
    try {
      const adminid = req.session.admin;
      const allusers = await usermodel.count();
    
      const vehiclecount = await vehiclesmodel.count();
      const admin = await adminmodel.findOne({ _id: adminid });
      if (admin) {
        res.render("admin/admindshbord", {
       
          vehiclecount,
          allusers,
        });
      } else {
        res.redirect("/admin/signup");
      }
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
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
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  getadminlogin: async (req, res) => {
    try {
      res.render("admin/adminlogin");
    } catch (error) {
      res.redirect("/admin/404");
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
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  adminlogout: async (req, res) => {
    try {
      req.session.admin = null;
      res.redirect("/admin/login");
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  getdashbord: async (req, res) => {
    try {
      const allusers = await usermodel.count();
      const bookingcount = await bookingModel.count();
      const vehiclecount = await vehiclesmodel.count();
      const adminid = req.session.admin;
      if (adminid) {
        res.render("admin/admindshbord", {
          bookingcount,
          vehiclecount,
          allusers,
        });
      } else {
        res.redirect("/admin/login");
      }
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
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
        res.redirect("/admin/viewvehicles");
      });
    } catch (error) {
      res.redirect("/admin/404");
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
    } catch (error) {
      res.redirect("/admin/404");
    }
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
      res.redirect("/admin/404");
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
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  deletevehicless: async (req, res) => {
    try {
      const id = req.params.id;
      await vehiclesmodel.deleteOne({ _id: id }).then((result) => {
        console.log(result);
        res.redirect("/admin/viewvehicles");
      });
    } catch (error) {
      res.redirect("/admin/404");
    }
  },

  getCoupens: async (req, res) => {
    const adminid = req.session.admin;
    await coupenmodel.find().then((result) => {
      if (adminid) {
        res.render("admin/coupen", { result });
      } else {
        res.redirect("/admin/login");
      }
    });
  },

  getaddcoupen: async (req, res) => {
    try {

      res.render("admin/addcoupen", { admin: true });
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  postcoupen: async (req, res) => {
    try {
      const coupen = new coupenmodel(req.body);
      coupen.save().then((result) => {
        res.redirect("/admin/coupen");
        console.log("coupen added");
      });
    } catch (error) {
      res.redirect("admin/404");
      console.log(error);
    }
  },

  geteditcoupen: async (req, res) => {
    try {
      const id = req.params.id;
      await coupenmodel.findOne({ _id: id }).then((result) => {
        res.render("admin/editcoupen", { result });
      });
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  postupdatecoupen: async (req, res) => {
    try {
      const id = req.params.id;
      await coupenmodel
        .updateOne(
          { _id: id },
          {
            $set: {
              code: req.body.code,
              Available: req.body.Available,
              Status: req.body.Status,
              amount: req.body.amount,
              expireAfter: req.body.expireAfter,
              usageLimit: req.body.usageLimit,
              minCartAmount: req.body.minCartAmount,
              // maxDiscountAmount: req.body.maxDiscountAmount,
            },
          }
        )
        .then((result) => {
          res.redirect("/admin/coupen");
        });
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  delcoupen: async (req, res) => {
    try {
      const id = req.params.id;
      await coupenmodel.deleteOne({ _id: id }).then((result) => {
        res.redirect("/admin/coupen");
        // res.redirect('/admin/404')
      });
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  getuser: async (req, res) => {
    try {
      if (req.session.admin) {
        await usermodel.find().then((result) => {
          res.render("admin/useroverview", { result });
        });
      }
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  blockuser: async (req, res) => {
    try {
      const id1 = req.params.id;
      console.log(id1);
      await usermodel.findByIdAndUpdate(id1, { block: false });
      res.redirect("/admin/users");
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  unblockuser: async (req, res) => {
    try {
      const id2 = req.params.id;
      await usermodel.findByIdAndUpdate(id2, { block: true });
      res.redirect("/admin/users");
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  bookingdetail: async (req, res) => {
    try {
      if (req.session.admin) {
        await bookingModel.find().then((result) => {
          res.render("admin/bookingdetails", { result });
        });
      }
    } catch (error) {
      res.redirect("/admin/404");
      console.log(error);
    }
  },

  fornotfor: async (req, res) => {
    try {
      res.render("admin/404");
    } catch (error) {
      console.log(error);
    }
  },
};