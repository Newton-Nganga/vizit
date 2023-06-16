const db = require("../db");
const { v4: uuidv4 } = require("uuid");
//  db.run('DROP TABLE IF EXISTS visitors')



const renderAddVisitors = async (req, res) => {
  const token = req.query.token;
  res.render("add-visitor", { message: { msg: "", status: "" }, token: token });
};

const addVisitors = async (req, res) => {
  const token = req.query.token;
  //destructure the body
  const userID = uuidv4();

  const {
    fName,
    lName,
    uName,
    phone,
    gender,
    status,
    address,
    email,
    visitorIcon,
  } = req.body;
  //make sure all the fields have value
  if (
    !fName ||
    !lName ||
    !uName ||
    !phone ||
    !gender ||
    !status ||
    !address ||
    !email ||
    !visitorIcon
  ) {
    return res.status(400).render("add-visitor", {
      message: {
        msg: "All the fields are required",
        status: "error",
      },
      token: token,
    });
  }
  //save to the db
  db.run(
    "INSERT INTO visitors (id,fName,lName,uName,visitorIcon,phone,gender,status,address,email) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      userID,
      fName,
      lName,
      uName,
      visitorIcon,
      phone,
      gender,
      status,
      address,
      email,
    ],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(400).json({
          message: { msg: "Couln't add the visitor", status: "error" },
          token: token,
        });
      }
      // console.log("inseted into the database")
       return res.status(200).json({
        message: { msg: "visitor added successfully", status: "success" },
        token: token,
      });
    }
  );
 
};

module.exports = { renderAddVisitors, addVisitors };
