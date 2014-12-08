var path = require('path');
var fs = require('fs');
var format = require('util').format;

module.exports = function(rootPath, tmpDirName) {
    var tmpPath = path.join(rootPath, tmpDirName);

    return function(entrypoints, options) {
        options = options || {};

        var commonFileName = options.commonFileName || 'commons';
        var componentsRootPath = path.join(rootPath, options.componentsPath || 'components');

        var entrypoins = {};
        var components = {};

        if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath);

        entrypoints.forEach(function(name) {
            var componentPath = path.join(componentsRootPath, name);
            var filePath = entrypoins[name] = path.join(tmpPath, format('entrypoints-%s.js', name));

            fs.writeFileSync(filePath, getBody(componentPath));
            components[name] = componentPath;
        });

        fs.writeFileSync(path.join(tmpPath, 'components-index.js'), getExportComponentFileBody(components));
        fs.writeFileSync(path.join(tmpPath, 'main.js'), getMainFileBody(componentsRootPath, commonFileName));

        return entrypoins;
    };
};

function getBody(componentPath) {
    return format("var Component = require('%s');\nComponent.init(Component, window._sharedData);", componentPath);
}

function getExportComponentFileBody(components) {
    var result = 'module.exports = {';

    var stack = Object.keys(components);
    var len = stack.length;

    stack.forEach(function(name, idx) {
        result += format("\n    '%s': require('%s')%s", name, components[name], (idx < len - 1 ? ', ' : ''));
    });

    result += '\n};';

    return result;
}

function getMainFileBody(componentsRootPath, commonFileName) {
    var pageComponentPath = path.join(componentsRootPath, 'page');

    return format([

        "var Page = require('%s');",
        "var components = require('./components-index.js');",
        "",
        "module.exports = require('react-serve/lib/serverBundle')(components, Page, '%s');"

    ].join('\n'), pageComponentPath, commonFileName);
}
