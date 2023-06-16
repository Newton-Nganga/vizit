//import db connection
const db = require('../db')

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { generateToken } = require('./userAuth');


//db.run(`ALTER TABLE users RENAME COLUMN name TO username`)


//create tables if not exist
db.run(
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT, email TEXT,password TEXT)",
    (err) => {
      if (err) {
        console.error(err.message);
       return res.status(500).send("Error creating users table");
      }
    }
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY AUTOINCREMENT,firstname TEXT, lastname TEXT,profileImage Text,phone NUMBER,profile_id INTEGER, FOREIGN KEY (profile_id) REFERENCES profile(id))",
    (err) => {
      if (err) {
        console.error(err.message);
       return res.status(500).send("Error creating profile table");
      }
    }
  );
//  db.run('DROP TABLE IF EXISTS profile')
//  db.run('DROP TABLE IF EXISTS users')
//  db.run('DROP TABLE IF EXISTS visitors')

const renderLogin = async(req,res)=>{res.status(200).render("login",{message:{msg:'Welcome back',status:"info"}});}
const renderSignup = async(req, res) => {res.status(200).render("signup",{message:{msg:'Almost there',status:"info"}});}

//user login
const handleLogin = async(req, res) => {
    //check if all fields are provided
    const { email, password } = req.body;
    //check if all fields have values
    if (!email || !password) {
      return res.render("login", {
        message: {
          msg: "All the fields are required",
          status: "error",
        },
      });
    }
    //check if the user exists
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).render("signup", {
          message: {
            msg: "There was an error checking if the email already exists",
            status: "error",
          },
        });
      }
      if (!row) {
        return res.status(404).render("login", {
          message: {
            msg: "Create an account please!",
            status: "error",
          },
        });
      }
      // console.log("row",row)
      //check if the fields match

      const isPasswordMatch = bcrypt.compareSync(password,row.password);

      
      if (row.email !== email || isPasswordMatch === false) {
        return res.status(400).render("login", {
          message: {
            msg: "Email or password incorrect",
            status: "error",
          },
        });
      }
       //create a jsonweb token
       const user = {
        id:row.id,
        email:row.email,
        username:row.username
       }
       const token = generateToken(user)

      //if fields match log in the user
      // setTimeout(() => {
      //   res.redirect("/visitors?token" + token);
      // }, 2000);
      return res.status(200).render("login", {
        message: { msg: "Logged in successfully", status: "success" ,token:token },
      });
    });
    
  }


const handleSignup = async(req, res) => {
    const { username, email, password } = req.body;
    //check if all fields have values
    if (!username || !email || !password) {
      return res.status(400).render("signup", {
        message: {
          msg: "All the fields are required",
          status: "error",
        },
      });
    }
    //check if email is used
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).render("signup", {
          message: {
            msg: "There was an error checking if the email already exists",
            status: "error",
          },
        });
      }
  
      if (row) {
        if(row.email === email){
          return res.status(400).render("signup", {
            message: {
              msg: "There is already a user with that email",
              status: "error",
            },
          });
        }
        if(row.username === username){
          return res.status(400).render("signup", {
            message: {
              msg: "There is already a user with that username",
              status: "error",
            },
          });
        }
        if(row.email === email && row.username === username){
          return res.status(200).render("signup", {
            message: {
              msg: "Email and username are taken",
              status: "error",
            },
          });
        }
      }
      //insert the new use
      //hash password n generate user id
     
      const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const userID = uuidv4();
      
      db.run(
        "INSERT INTO users (id,username, email,password) VALUES (?, ?, ? , ?)",
        [userID, username, email, hashPass],
        (err) => {
          if (err) {
            console.error(err.message);
            return res.status(500).render("signup", {
              message: { msg: "Couln't create account", status: "error" },
            });
            // return res.status(500).send("Error adding user to database");
          }
          db.run("INSERT INTO profile (profileImage,firstname,lastname,profile_id) VALUES (?,?,?,?)",["","","",userID],(err)=>{
            if (err) {
              console.error(err.message);
              return res.status(500).render("signup", {
                message: { msg: "Couln't create user profile", status: "error" },
              });
              // return res.status(500).send("Error adding user to database");
            }
          })
          return res.status(200).render("signup", {
            message: { msg: "Account created successfully", status: "success" },
          });
        }
      );
      
    });
  }


module.exports = {renderLogin,renderSignup,handleLogin,handleSignup}