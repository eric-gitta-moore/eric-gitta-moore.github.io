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

function genMap(path) {
  return [`../${path}`, `../en/${path}`];
}
const needCopy = [
  genMap("themes/"),
  genMap("package.json"),
  genMap("package-lock.json"),
  genMap("node_modules/"),
  genMap("_config.maupassant.yml"),
  genMap("source/apple-touch-icon.png"),
  genMap("source/favicon.ico"),
  genMap("source/categories/"),
  genMap("source/css/"),
  genMap("source/tags/"),
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
    execSync("npx hexo clean");
    execSync("cd ./en && npx hexo clean");
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
  async serve() {
    await functions.clean();
    await functions.copy();
    exec("npx hexo server --watch");
    console.log(`zh site: http://localhost:4000`);
    exec("cd ./en && npx hexo server --watch -p 4001");
    console.log(`en site: http://localhost:4001`);
  },
  s() {
    functions.serve();
  },
};

if (cliArgs.mode in functions) {
  functions[cliArgs.mode]();
}
