require("dotenv").config({ path: __dirname + "/.env" });
const execSync = require("child_process").execSync;

execSync(`psql -f ./data.sql ${process.env.DATABASE_URL}`);
console.log("Inserted data");
