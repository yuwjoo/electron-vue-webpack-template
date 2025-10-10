import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import type { Configuration } from "webpack";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins: Required<Configuration>["plugins"] = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
];
