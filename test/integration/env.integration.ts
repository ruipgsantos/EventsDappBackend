import NodeEnvironment from "jest-environment-node";
// import {JestEnvironmentConfig, EnvironmentContext} from "jest"
import { execSync } from "child_process";

class IntegrationEnvironment extends NodeEnvironment {
  // constructor(config, context) {
  //   super(config, context);
  // }

  public async setup(): Promise<void> {
    console.warn("SETUP!");
    await super.setup();
    return new Promise((success, reject) => {
      try {
        execSync(
          "docker-compose -f ./test/integration/docker-compose.yml up -d"
        );
        success();
      } catch (err) {
        reject(err);
      }
    });
  }
  public async teardown(): Promise<void> {
    console.warn("TEARDOWN!");
    await super.teardown();
    return new Promise((success, reject) => {
      try {
        execSync(
          "docker-compose -f ./test/integration/docker-compose.yml down"
        );
        success();
      } catch (err) {
        reject(err);
      }
    });
  }
  public getVmContext() {
    return super.context;
  }
}

module.exports = IntegrationEnvironment;
