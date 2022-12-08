import * as ChildProcess from "child_process";
const execSync = ChildProcess.execSync;

export default async function setup() {
  execSync("docker-compose -f ./test/integration/docker-compose.yml down");
}
