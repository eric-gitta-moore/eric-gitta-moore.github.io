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

const languages = ["cn", "en"];

function genMap(path, lan) {
  return [`../${path}`, `../${lan}/${path}`];
}
const needCopy = [
  ...Array.from(languages)
    .map((lan) => [
      ["../common/", `../${lan}/`],
      genMap("package.json", lan),
      genMap("package-lock.json", lan),
    ])
    .flat(),
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
    languages.map((e) => execSync(`cd ./${e} && npx hexo clean`));
  },
  g() {
    functions.generate();
  },
  async generate() {
    await functions.clean();
    await functions.copy();
    languages.map((e) =>
      console.log(execSync(`cd ./${e} && npm i && npx hexo g`).toString())
    );
  },
  async serve() {
    await functions.clean();
    await functions.copy();
    const portStart = 4000;
    languages.map((e, i) => {
      console.log(`${e} site: http://localhost:${portStart + i}`);
      exec(`cd ./${e} && npm i && npx hexo server --watch -p ${portStart + i}`);
    });
  },
  s() {
    functions.serve();
  },
};

if (cliArgs.mode in functions) {
  functions[cliArgs.mode]();
}
