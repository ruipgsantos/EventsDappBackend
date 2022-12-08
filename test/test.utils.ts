import * as fs from "fs";
import path from "path";

const getRawTestData = (filename: string) => {
  return fs.readFileSync(path.resolve(__dirname, `./${filename}`));
};

export const loadEventsData = (): any[] => {
  return JSON.parse(getRawTestData("event-test-data.json").toString());
};

export const loadSpacesData = (): any[] => {
  return JSON.parse(getRawTestData("space-test-data.json").toString());
};
