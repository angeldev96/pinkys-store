const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

module.exports = [
  { ignores: [".next", "dist", "node_modules", "next-env.d.ts"] },
  ...nextCoreWebVitals,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
