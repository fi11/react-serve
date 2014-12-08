var readFile = require('fs').readFileSync;
var vm = require('vm');
var path = require('path');

var format = require('util').format;

module.exports = function(root) {
    return function(dir, options) {
        options = options || {};
        var renderFilePath = path.join(root, dir, 'server-render.js');
        var bundleFilePath = path.join(root, dir, 'bundle.json');

        var src = readFile(renderFilePath);
        var bundle = JSON.parse(readFile(bundleFilePath));

        var RenderScript = vm.createScript(
            format('%s\n\n;%s(staticBundle, entryPointName, context, isJson);', src, options.renderName || 'Render'), renderFilePath);

        return function(entryPointName, context, isJson, sandbox) {
            sandbox = sandbox || {};

            sandbox.entryPointName = entryPointName;
            sandbox.context = context;
            sandbox.staticBundle = bundle;
            sandbox.isJson = isJson;

            return RenderScript.runInNewContext(sandbox, { timeout: options.timeout || 1000 });
        };
    }
};
