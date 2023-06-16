const express = require("express");
const router = express.Router();


//import controllers
const { renderLogin,renderSignup,handleLogin,handleSignup } = require('../controllers/users');
const { renderVisitors, renderUpdateVisitor, updateVisitor, deleteVisitors } = require('../controllers/visitors');
const { renderAddVisitors, addVisitors } = require("../controllers/addVisitors");
const { renderProfile, updateProfile, deleteProfile } = require("../controllers/profile");
const { verifyToken } = require("../controllers/userAuth");




router.get("/", (req, res) => {res.render("landing");});

//-------------------------------------
//signup routes
router.get("/signup", renderSignup);
router.post("/signup",handleSignup );

//--------------------------
//login routes
router.get("/login",renderLogin);
router.post("/login",handleLogin);


//--------------------------------------------
//A user can fetch,delete the visitors 
//visitors routes
router.get("/visitors", verifyToken,renderVisitors);
router.post("/visitors",verifyToken,)    //search the db
//--------------------------------------------
// visitors/add route
router.get("/visitors/add/",verifyToken,renderAddVisitors)  //renders the add-visitor template
router.post("/visitors/add/",verifyToken,addVisitors)
//---------------------------------------------
router.delete("/visitors/:id/",verifyToken,deleteVisitors)  //delete visitor
router.post("/visitors/:id/",verifyToken,updateVisitor)  //update visitor --use the/visitors/add/:id route
router.get("/visitors/:id/",verifyToken,renderUpdateVisitor)
//--------------------------------------------
//A user can fetch,update and delete the created profile
//Profile routes
router.get("/profile",verifyToken,renderProfile)
router.put('/profile',verifyToken,updateProfile)
router.delete('/profile',verifyToken,deleteProfile)






module.exports = router;
