/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/nextjs"],
  parserOptions: {
    project: true,
  },
};
