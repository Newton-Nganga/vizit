//import db
const db = require("../db");
//create tables if not exist

db.run(
  "CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY, fName TEXT,lName TEXT,uName TEXT,visitorIcon TEXT,phone TEXT,gender TEXT,status TEXT,address TEXT,email TEXT)",
  (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error creating users table");
    }
  }
);

const renderVisitors = async (req, res) => {
  const token = req.query.token;
  db.all("SELECT * FROM visitors", (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error retrieving users from database");
    }
    //render users.ejs and provide the fetched users as users:results
    res.status(200).render("visitors", { visitors: results, token: token });
  });
};

const renderUpdateVisitor = async (req, res) => {
  const { id } = req.params;
  const token = req.query.token;
  db.get("SELECT * FROM visitors where id = ?", id, (err, visitor) => {
    if (err) {
      res.redirect(`/visitors?token=${token}`);
    }
    res.status(200).render("update-visitor", {
      msg: "user fetched successfully",
      token: token,
      visitor: visitor,
    });
  });
};

const updateVisitor = async (req, res) => {
  const { id } = req.params;
  const token = req.query.token;

  //only patch the fields that have value
  const { fName, lName, uName, visitorIcon, phone, gender, status, address } =
    req.body;
  const body = [
    fName,
    lName,
    uName,
    visitorIcon,
    phone,
    gender,
    status,
    address,
  ];
  body.forEach((field) => {
    if (field !== null || undefined) {
      console.log(field + "=?");
    }
  });
  //update the visitor row with the new field values
  const updateProfile = db.prepare(
    "UPDATE visitors SET fName = ?,lName =?,uName= ?,visitorIcon=?,phone=?,gender=?,status=?,address=?  WHERE id = ?"
  );

  updateProfile.run(
    fName,
    lName,
    uName,
    visitorIcon,
    phone,
    gender,
    status,
    address,
    id,
    (err) => {
      if (err) {
        console.log("Error updating the visitor:", err.message);
        return res.status(500).redirect(`/visitors/${id}/?token=${token}`, {
          token: token,
          visitor: visitor,
          msg: "Couldn't update visitor",
        });
      }
      res.redirect(`/visitors?token=${token}`);
    }
  );

  //render the visitors page after successfull login
};

const deleteVisitors = async (req, res) => {
  const { id } = req.params;
  const token = req.query.token;

   //extract the public_id from the string
  function extractPartOfString(url) {
    const startIndex = url.indexOf('vizit-cms');
    if (startIndex !== -1) {
      const extractedPart = url.substring(startIndex);
      const withoutFirstSlash = extractedPart.replace(/^\//, '');
      return withoutFirstSlash;
    }
    return '';
  }
  
  // Usage example
  const url = 'https://res.cloudinary.com/dv331j5da/image/upload/v1684932884/vizit-cms/h3nqbyy7inmlhclzkoe3.jpg';
  const extractedPart = extractPartOfString(url);
  //console.log(extractedPart);

  //delete the visitor whose id = id provided
  db.get(
    "SELECT visitorIcon FROM visitors WHERE id = ?",
    id,
    async (err, row) => {
      if (err) {
        return res.redirect(`/visitors?token=${token}`);
      }
      const response = await fetch(row, { method: "DELETE" });

      if (response.ok) {
        console.log("Image deleted successfully");
        db.run("DELETE from visitors WHERE id=?", id, (err) => {
          if (err) {
            return res.redirect(`/visitors?token=${token}`);
          }
          return res.redirect(`/visitors?token=${token}`);
        });
      } else {
        console.error(
          "Error deleting image:",
          response.status,
          response.statusText
        );
        return res.redirect(`/visitors?token=${token}`);
      }
    }
  );
};

const searchVisitors = async (req, res) => {
  const { str } = req.body;

  //use the str to query the database for matches using "firstname","lastname","username","gender"
};

module.exports = {
  renderVisitors,
  updateVisitor,
  deleteVisitors,
  searchVisitors,
  renderUpdateVisitor,
  deleteVisitors,
};
