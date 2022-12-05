import * as ChildProcess from "child_process";
const execSync = ChildProcess.execSync;

export function resetDatabaseData() {
  execSync(
    `psql -f ${__dirname}/testdata.sql postgresql://postgres:postgres@localhost:5555/postgres`
  );
}
