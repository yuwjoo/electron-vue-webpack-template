import { DefinePlugin, type Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";
import { VueLoaderPlugin } from "vue-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import AutoImport from "unplugin-auto-import/webpack";
import Components from "unplugin-vue-components/webpack";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/webpack";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

export const rendererConfig: Configuration = {
  module: {
    rules: [
      ...rules,
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
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    ...plugins,
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [{ from: "public", to: "static" }],
    }),
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver(), IconsResolver()],
      dts: "./src/common/types/autoImports.d.ts",
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "i",
          enabledCollections: ["ep", "tabler"],
          customCollections: ["icons"],
        }),
      ],
      dts: "./src/common/types/components.d.ts",
    }),
    Icons({
      customCollections: {
        icons: FileSystemIconLoader("./src/renderer/assets/icons", (svg) =>
          svg.replace(
            /^<svg /,
            '<svg fill="currentColor" width="1em" height="1em" '
          )
        ),
      },
      iconCustomizer(_collection, _icon, props) {
        props.width = "1em";
        props.height = "1em";
      },
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".vue"],
  },
};
