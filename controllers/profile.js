const db = require("../db");

//profile is created automatically on signUp

const renderProfile = async (req, res) => {
  const token = req.query.token;
  const id = req.user.userId;
  const user = {};

  db.get(
    "SELECT username,email FROM users WHERE id = ?",
    [id],
    (err, userRow) => {
      if (err) {
        return res.status(500).render("profile", {
          message: {
            msg: "Encountered an error while fetching the user from the db",
            status: "error",
          },
          token: token,
          user: user,
        });
      }
      user.username = userRow.username;
      user.email = userRow.email;

      db.get(
        "SELECT * FROM profile WHERE profile_id = ?",
        [id],
        (err, profileRow) => {
          if (err) {
            console.error(err.message);
            return res.status(500).render("profile", {
              message: {
                msg: "There was an error checking if the profile already exists",
                status: "error",
              },
              token: token,
              user: user,
            });
          }
          user.firstname = profileRow.firstname;
          user.lastname = profileRow.lastname;
          user.phone = profileRow.phone;
          user.profileImage = profileRow.profileImage;
          return res.status(200).render("profile", {
            message: { msg: "user profile fetched successfully" },
            token: token,
            user: user,
          });
        }
      );
    }
  );
};
const updateProfile = async (req, res) => {
  const token = req.query.token;
  const userId = req.user.userId;
  const username = req.user.username;

  const { fName, lName, uName, email, phone, profileImage } = req.body;
  const updateProfile = db.prepare(
    `UPDATE profile SET firstname = ?,lastname = ?,phone = ?,${profileImage ? "profileImage = ?":""}  WHERE profile_id = ?`
  );
  const updateUser = db.prepare(
    "UPDATE users set username =? ,email = ? WHERE id= ?"
  );
  const str = profileImage ? profileImage : ''
  // Execute the SQL statement with the provided values
  updateProfile.run(fName, lName, phone, str, userId, (err) => {
    if (err) {
      console.log("Error updating the profile:", err.message);
      return res.status(500).render("profile", {
        token: token,
        user: { username: req.user.username, email: req.user.email },
        msg: "Couldn't update your profile",
      });
    }
    updateUser.run(uName, email, userId, (err) => {
      if (err) {
        console.log("Error updating the user account info:", err.message);
        return res.status(500).render("profile", {
          token: token,
          user: { username: req.user.username, email: req.user.email },
          msg: "Couldn't update your profile",
        });
      }
      return res.status(200).render("profile", {
        token: token,
        user: {
          firstname: fName,
          lastname: lName,
          profileImage: profileImage,
          username: username,
          email: email,
          phone: phone,
        },
        msg: "Your profile was updated successfully",
      });
    });
  });
};

const deleteProfile = async (req, res) => {
  const token = req.query.token;
  const id = req.user.id;

  //db.run to delete the user and profile rows where userid && profile_id = id
  // Begin a transaction
  // Delete from first table
  const sql2 = `DELETE FROM profile WHERE profile_id = ?`;
  db.run(sql2, id, function (err) {
    if (err) {
      console.error("Error deleting from profile table:", err.message);
      // Handle error or perform any necessary actions
    }

    const sql1 = `DELETE FROM users WHERE id = ?`;
    db.run(sql1, id, function (err) {
      if (err) {
        console.error("Error deleting from users table:", err.message);
        // Handle error or perform any necessary actions
      }
    });
    return res.status(200).render("login", {
      msg: "Account deleted successfully",
      token: token,
      user: "",
    });
  });
};

module.exports = { renderProfile, updateProfile, deleteProfile };
