import path from "path";
import dotenv from "dotenv";
import * as ChildProcess from "child_process";

const execSync = ChildProcess.execSync;

export default async function setup() {
  dotenv.config({ path: path.join(__dirname, "integration.env") });

  execSync("docker-compose -f ./test/integration/docker-compose.yml up -d");  
  execSync("npx prisma migrate dev --name init");
}
