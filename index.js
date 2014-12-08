var path = require('path');
var rootPath = path.dirname(module.parent.filename);
var tmpDirName = '.react';

exports.mount = require('./lib/mount')(rootPath, tmpDirName);
exports.webpackPlugin = require('./lib/webpack-plugin')(rootPath, tmpDirName);
exports.render = require('./lib/render')(rootPath, tmpDirName);
