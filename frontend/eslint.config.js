import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            ...pluginQuery.configs["flat/recommended"],
            ...pluginRouter.configs["flat/recommended"],
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            react,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            // Limit file length to 300 lines
            "max-lines": [
                "error",
                { max: 300, skipBlankLines: true, skipComments: true },
            ],
            // Enforce one React component per file
            "react/no-multi-comp": ["error", { ignoreStateless: false }],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { prefer: "type-imports", fixStyle: "separate-type-imports" },
            ],
            "@typescript-eslint/no-misused-promises": [
                2,
                { checksVoidReturn: { attributes: false } },
            ],
            "@typescript-eslint/no-unnecessary-condition": [
                "error",
                {
                    allowConstantLoopConditions: true,
                },
            ],
            "@typescript-eslint/no-non-null-assertion": "error",
        },
    },
]);
