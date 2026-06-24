import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["backend/dist/**", "frontend/.next/**", "frontend/next-env.d.ts", "node_modules/**"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["backend/**/*.ts"],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ["frontend/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  prettier
);
