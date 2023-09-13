#!/usr/bin/env ts-node
import fs from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import { execSync, exec } from "node:child_process";
import minimist from "minimist";

const defaultCliArgs = {
  mode: "copy",
};
const cliArgs = Object.assign(
  {},
  defaultCliArgs,
  minimist(process.argv.slice(2))
);

console.log(`cliArgs`, cliArgs);

const needCopy = [
  ["../themes/", "../en/themes/"],
  ["../package.json", "../en/package.json"],
  ["../package-lock.json", "../en/package-lock.json"],
  ["../node_modules", "../en/node_modules"],
  ["../_config.maupassant.yml", "../en/_config.maupassant.yml"],
  ["../source/apple-touch-icon.png", "../en/source/apple-touch-icon.png"],
  ["../source/favicon.ico", "../en/source/favicon.ico"],
  ["../source/categories/", "../en/categories/"],
  ["../source/css/", "../en/css/"],
  ["../source/tags/", "../en/tags/"],
];

const functions = {
  async copy() {
    for (const [src, dest] of needCopy) {
      console.log(`copying... src:${src} dest:${dest}`);

      await fs.cp(resolve(__dirname, src), resolve(__dirname, dest), {
        recursive: true,
        force: true,
      });
    }
  },
  async clean() {
    exec("npx hexo clean");
    exec("cd ./en && npx hexo clean");
    for (const [src, dest] of needCopy) {
      console.log(`cleaning... ${dest}`);
      await fs.rm(resolve(__dirname, dest), {
        force: true,
        recursive: true,
      });
    }
  },
  g() {
    functions.generate();
  },
  async generate() {
    await functions.clean();
    await functions.copy();
    console.log(execSync("npx hexo g").toString());
    console.log(execSync("cd ./en && npx hexo g").toString());
  },
  serve() {
    execSync("npx hexo server");
  },
  s() {
    functions.serve();
  },
};

if (cliArgs.mode in functions) {
  functions[cliArgs.mode]();
}
