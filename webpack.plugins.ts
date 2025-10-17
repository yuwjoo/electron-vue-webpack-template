import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import type { Configuration } from "webpack";

import Dotenv from "dotenv-webpack";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins: Required<Configuration>["plugins"] = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new Dotenv({
    path: `./.env.${process.env.NODE_ENV}`,
    defaults: "./.env",
  }),
];
