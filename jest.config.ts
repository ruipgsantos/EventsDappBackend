import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  projects: [
    "./test/unit/unit.jest.config.json",
    "./test/integration/integration.jest.config.ts",
  ],
  transformIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/*.json"],
  moduleFileExtensions: ["js", "jsx", "json"],
  globals: {
    NODE_ENV: "test",
  },
};

export default config;
