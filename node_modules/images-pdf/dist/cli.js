#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var commander_1 = __importDefault(require("commander"));
var index_1 = require("./index");
var package_json_1 = __importDefault(require("./package.json"));
var error = function (message) {
    console.log(chalk_1.default.red(message));
};
commander_1.default
    .version(package_json_1.default.version)
    .option('-f, --folder <path>', 'the folder that contains the images.')
    .option('-o, --output <path>', 'the PDF file to generate.')
    .parse(process.argv);
var args = commander_1.default;
if (!args.folder) {
    error('Please enter the folder contains the images.');
}
else if (!args.output) {
    error('Please enter thie PDF file to generate.');
}
new index_1.ImagesToPDF().convertFolderToPDF(args.folder, args.output);
