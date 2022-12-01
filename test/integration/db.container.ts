import { execSync } from "child_process";

export default class DbContainer {
  public static refreshDbData() {
    execSync(
      "psql -f ./test/integration/testdata.sql postgresql://postgres:postgres@localhost:5555/postgres"
    );
  }
}
