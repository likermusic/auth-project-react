import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        {
          type: "app",
          pattern: "app",
        },
        {
          type: "pages",
          pattern: "pages/*",
          capture: ["page"],
        },
        {
          type: "widgets",
          pattern: "widgets/*",
          capture: ["widget"],
        },
        {
          type: "features",
          pattern: "features/*",
          capture: ["feature"],
        },
        {
          type: "entities",
          pattern: "entities/*",
          capture: ["entitiy"],
        },
        {
          type: "shared",
          pattern: "shared/*",
          capture: ["segment"],
        },
      ],
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-refresh/only-export-components": 0,
      "boundaries/entry-point": [
        2,
        {
          default: "disallow",
          rules: [
            {
              target: [
                [
                  "shared",
                  {
                    segment: "lib",
                  },
                ],
              ],
              allow: "*/index.ts",
            },
            {
              target: [
                [
                  "shared",
                  {
                    segment: "lib",
                  },
                ],
              ],
              allow: "*.(ts|tsx)",
            },
            {
              target: [
                [
                  "shared",
                  {
                    segment: "constants",
                  },
                ],
              ],
              allow: "index.ts",
            },
            {
              target: [
                [
                  "shared",
                  {
                    segment: "(ui|api)", // ("ui"|"constants")
                  },
                ],
              ],
              allow: "**",
            },
            {
              target: ["app", "pages", "widgets", "features", "entities"],
              allow: "index.(ts|tsx)",
            },
          ],
        },
      ],
      "boundaries/element-types": [
        2,
        {
          default: "allow",
          message: "${file.type} is not allowed to import (${dependency.type})",
          rules: [
            {
              from: ["shared"],
              disallow: ["app", "pages", "widgets", "features", "entities"],
              message:
                "Shared module must not import upper layers (${dependency.type})",
            },
            {
              from: ["shared"],
              disallow: [
                [
                  "shared",
                  {
                    segment: "!${segment}",
                  },
                ],
              ],
              message:
                "Shared module must not import other shared modules (${dependency.segment})",
            },
            {
              from: ["entities"],
              message:
                "Entity must not import upper layers (${dependency.type})",
              disallow: ["app", "pages", "widgets", "features"],
            },
            {
              from: ["entities"],
              message: "Entity must not import other entity",
              disallow: [
                [
                  "entities",
                  {
                    entity: "!${entity}",
                  },
                ],
              ],
            },
            {
              from: ["features"],
              message:
                "Feature must not import upper layers (${dependency.type})",
              disallow: ["app", "pages", "widgets"],
            },
            {
              from: ["features"],
              message: "Feature must not import other feature",
              disallow: [
                [
                  "features",
                  {
                    feature: "!${feature}",
                  },
                ],
              ],
            },
            {
              from: ["widgets"],
              message:
                "Feature must not import upper layers (${dependency.type})",
              disallow: ["app", "pages"],
            },
            {
              from: ["widgets"],
              message: "Widget must not import other widget",
              disallow: [
                [
                  "widgets",
                  {
                    widget: "!${widget}",
                  },
                ],
              ],
            },
            {
              from: ["pages"],
              message: "Page must not import upper layers (${dependency.type})",
              disallow: ["app"],
            },
            {
              from: ["pages"],
              message: "Page must not import other page",
              disallow: [
                [
                  "pages",
                  {
                    page: "!${page}",
                  },
                ],
              ],
            },
          ],
        },
      ],
    },
  }
);
