import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";
import { VueLoaderPlugin } from "vue-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

rules.push(
  {
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }],
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      // 将 CSS 提取到单独的文件中
      MiniCssExtractPlugin.loader,
      // 将 CSS 转化成 CommonJS 模块
      "css-loader",
      // 将 Sass 编译成 CSS
      "sass-loader",
    ],
  },
  {
    test: /\.vue$/,
    use: "vue-loader",
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: "asset/resource",
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
  }
);

plugins.push(new VueLoaderPlugin(), new MiniCssExtractPlugin());

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".vue"],
  },
};
