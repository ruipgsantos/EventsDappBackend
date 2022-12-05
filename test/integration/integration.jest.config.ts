import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  displayName: "IntegrationTests",
  testMatch: ["<rootDir>/**/*.integration.test.ts"],
  testEnvironment: "<rootDir>/env.integration.js",
  globalSetup: "./globalSetup.ts",
  globalTeardown: "./globalTeardown.ts",
};

export default config;
