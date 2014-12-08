var fs = require('fs');
var path = require('path');

module.exports = function(rootPath, tmpDirName) {
    var tmpPath = path.join(rootPath, tmpDirName);

    return function(prefix) {
        return function() {
            this.plugin('done', function(stats) {
                var data = stats.toJson().assetsByChunkName;
                var result = {};

                Object.keys(data).forEach(function(name) {
                    data[name] = [].concat(data[name] || []).forEach(function(fileName) {
                        var splittedFile = fileName.split('.');
                        var hash = splittedFile[0];
                        var fileType = splittedFile[1];

                        (result[name] || (result[name] = {}))[fileType] = {
                            name: name,
                            path: prefix + fileName,
                            fileType: fileType,
                            params:  { version: hash, key:  name + '.' + fileType }
                        };
                    });
                });

                fs.writeFileSync(path.join(tmpPath, 'bundle.json'), JSON.stringify(result));
            });
        };
    };
};
