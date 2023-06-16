const sqlite3 = require("sqlite3").verbose();

//try to make a connection

const db = new sqlite3.Database("./database.sqlite", (err) => {
  console.log('     Trying to connect to the database ...    ')
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("     Success! You are Connected to the database.    ");
});



// export default db;
module.exports = db;
