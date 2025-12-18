import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/gql/schema.graphql",
  generates: {
    "src/gql/generated/graphql.ts": {
      plugins: [
        {
          typescript: {
            enumsAsConst: true,
          },
        },
        {
          "typescript-resolvers": {
            useTypeImports: true,
            enumsAsTypes: false,
          },
        },
      ],
    },
  },
};

export default config;
