const NodeEnvironment = require("jest-environment-node").TestEnvironment;
const execSync = require("child_process").execSync;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    console.info("Setting up integration tests environment...");
    await super.setup();
    return new Promise((success, reject) => {
      try {
        execSync(
          "docker-compose -f ./test/integration/docker-compose.yml up -d"
        );
        execSync("npx prisma migrate reset --force");
        // execSync(
        //   "psql -f ./data.sql postgresql://postgres:postgres@localhost:5555/postgres"
        // );
        console.info("Containers initialized...");
        success();
      } catch (err) {
        this.stopContainers();
        reject(err);
      }
    });
  }

  async teardown() {
    console.warn("Tearing down test environment...");
    await super.teardown();
    return new Promise((success, reject) => {
      try {
        this.stopContainers();
        success();
      } catch (err) {
        reject(err);
      }
    });
  }

  stopContainers() {
    execSync("docker-compose -f ./test/integration/docker-compose.yml down");
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
