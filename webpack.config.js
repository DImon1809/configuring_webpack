const path = require("path");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

// *Библиотека для управления виртуальным окружением называется  "cross-env"
const isProd = process.env.NODE_ENV === "production";

console.log("isProd ", isProd);

const optimivation = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    // *Для минификации css
    config.minimizer = [
      new OptimizeCssAssetPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

module.exports = {
  // *Где находятся исходники проекта
  context: path.resolve(__dirname, "src"),
  //   mode: "development",
  mode: "production",
  // *Приложение стартует с данного файла
  entry: {
    // *Пример с чанками (чанк - сборник скриптов)
    // main: "./index.js",

    // *Для работы ассинхронных функций, необходимо подключить @babel/polyfill
    main: ["@babel/polyfill", "./index.jsx"],
    analitics: "./analitics.ts",
  },
  // *Куда следует складывать результаты работы webpack
  output: {
    // *При сборке всего js, мы получим bundle.js
    // filename: "bundle.js",
    // *Настройка паттернов для чанков
    // filename: "[name].bundle.js",
    // *Webpack сам будет задавать имена bundle
    filename: "[name].[contenthash].js",
    // *Положить все в паку dist
    path: path.resolve(__dirname, "dist"),
  },

  resolve: {
    // *Какие расширения нужно понимать поумолчанию
    // extensions: [".js", ".json", ".png", ".css", ".html", ".ttf"],

    // *alias для импортов
    alias: {
      "@models": path.resolve(__dirname, "src/models"),
    },
  },

  // *Оптимизация для библиотек.
  // optimization: {
  //   splitChunks: {
  //     // *Выносит общие импорты библиотек в один файл
  //     chunks: "all",
  //   },
  // },

  // Для минификации css
  optimization: optimivation(),

  // *Настройки размеров файлов в webpack
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  // *Настройка для webpack-dev-server
  devServer: {
    port: 4200,
    hot: isProd,
  },

  // *добавить исходные карты для удобства чтения кода
  devtool: isProd ? "source-map" : false,

  // *В плагины зависимости добавляются как экземпляры классов
  plugins: [
    // *Для переноса дефолтного html в dist
    new HTMLWebpackPlugin({
      //   title: "WebPack Title",
      // *Чтобы webpack основывался на корневом html
      template: "./index.html",
      // *Минифицировать html
      minify: {
        collapseWhitespace: isProd,
      },
    }),

    // *Для очистки webpack
    new CleanWebpackPlugin(),

    // Для копирования файлов в dist
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets"),
          to: path.resolve(__dirname, "dist", "assets"),
        },
      ],
    }),

    // *Минифицировать файл css
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],

  // *Loader позволяет работать webpack с другими не js формата файлами

  module: {
    rules: [
      {
        // *Если файл с данным типом то применить правило use
        test: /\.css$/,
        // *Соблюдать точный порядок
        // use: ["style-loader", "css-loader"],

        // *Для минификации css
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
        ],
      },

      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
          "less-loader",
        ],
      },

      {
        test: /\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
          "sass-loader",
        ],
      },

      // *В пятой версии webpack можно работать с файлами таким образом
      {
        test: /\.(png|jpg|svg|ttf|woff2|woff)$/,
        type: "asset/resource",
      },

      // *Для адаптации js под разные браузеры
      {
        test: /\.js$/,
        // *Не адаптировать js файлы, которые находятся в node_module
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },

      // *Для компиляции TS
      {
        test: /\.ts$/,
        // *Не адаптировать js файлы, которые находятся в node_module
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },

      // *Для компиляции React jsx
      {
        test: /\.jsx$/,
        // *Не адаптировать js файлы, которые находятся в node_module
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },

      // {
      //   test: /\.(png|jpg|svg|gif)$/,
      //   use: ["file-loader"],
      // },

      // {
      //   test: /\.(png|jpg|svg)$/,
      //   type: "assets",
      // },
    ],
  },
};
