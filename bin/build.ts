#!/usr/bin/env ts-node
import * as fs from "node:fs/promises";
import { resolve } from "node:path";
import { argv } from "node:process";
import minimist from "minimist";

const defaultCliArgs = {
    mode: "copy", // copy | clean
};
const cliArgs = Object.assign({}, defaultCliArgs, minimist(argv.slice(2)));

const needCopy = [
    ["../themes/", "../en/themes/"],
    ["../source/apple-touch-icon.png", "../en/source/apple-touch-icon.png"],
    ["../source/favicon.ico", "../en/source/favicon.ico"],
    ["../source/categories/", "../en/categories/"],
    ["../source/css/", "../en/css/"],
    ["../source/tags/", "../en/tags/"],
]

if (cliArgs.mode === 'copy') {
    for (const [src, dest,] of needCopy) {
        fs.cp(resolve(__dirname, src), resolve(__dirname, dest), {
            recursive: true,
        });
    }
} else if (cliArgs.mode === 'clean') {
    for (const [src, dest,] of needCopy) {
        fs.rm(resolve(__dirname, dest), {
            force: true,
            recursive: true
        });
    }
}
