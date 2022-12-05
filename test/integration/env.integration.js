const NodeEnvironment = require("jest-environment-node").TestEnvironment;
const execSync = require("child_process").execSync;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "integration.env") });

class CustomEnvironment extends NodeEnvironment {
  _retryLimit = 10;
  _connectionRetries = 0;
  _connected = false;

  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    console.info("Setting up integration tests environment...");
    console.info(
      `Current env file: ${path.join(__dirname, "integration.env")}`
    );

    return new Promise((success, reject) => {
      try {
        execSync(
          "docker-compose -f ./test/integration/docker-compose.yml start"
        );
        console.info("Containers initialized...");

        while (
          this._connectionRetries <= this._retryLimit &&
          !this._connected
        ) {
          try {
            execSync("npx prisma migrate dev --name init");
            this._connected = true;
            success();
          } catch (e) {
            this._connectionRetries++;
            console.info(
              `Retrying connection... ${this._connectionRetries} time`
            );
          }
        }
        reject();
      } catch (err) {
        this.stopContainers();
        reject(err);
      }
    });
  }
}

module.exports = CustomEnvironment;
