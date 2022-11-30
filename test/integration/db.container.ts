import { execSync } from "child_process";

export default class DbContainer {
  public static setup() {
    try {
      execSync("docker-compose -f ./test/integration/docker-compose.yml up -d");
      execSync(
        "psql -f ./data.sql postgresql://postgres:postgres@localhost:5555/postgres"
      );
    } catch (e) {
      console.error(e);
      this.stopContainer();
    }
  }
  public static teardown() {
    this.stopContainer();
  }

  private static stopContainer() {
    execSync("docker-compose -f ./test/integration/docker-compose.yml down");
  }
}
