var React = require('react');
var bucket = require('bucketjs');
var bucketSrc = require('raw!bucketjs/dist/bucket.min.js');
var merge = require('./merge');

module.exports = function(components, bodyComponent, commonFileName) {
    function getHtmlResult(bundle, entryPointName, commonFileName, context) {
        var appComponent = components[entryPointName];

        var commons = bundle[commonFileName];
        var entryPoint = bundle[entryPointName];

        var requiredHeadScripts = [
            { src: bucketSrc },
            { src:  "window._sharedData = JSON.parse('" + JSON.stringify(context) +"');" },
            getRequireScriptSrc(commons.css, true),
            getRequireScriptSrc(entryPoint && entryPoint.css, true)
        ];

        var requiredBodyScripts = [
            getRequireScriptSrc(commons.js),
            getRequireScriptSrc(entryPoint.js, false, true)
        ];

        appComponent.mountStores && appComponent.mountStores(appComponent, context);

        return React.renderComponentToStaticMarkup(
            bodyComponent({
                headScripts: requiredHeadScripts,
                bodyScripts: requiredBodyScripts,
                appComponent: appComponent,
                entryPointName: entryPointName
            }));
    }

    function getJsonResult(bundle, entryPointName, context) {
        var result = {};

        [commonFileName, entryPointName].forEach(function(name) {
            var item = bundle[name];
            var bank = result[name] || (result[name] = []);

            if (item.css) {
                bank.push({ path: item.css.path, params: merge(item.css.params, {})});
            }

            if (item.js) {
                var params = item.js.params = merge(item.js.params, { waitFor: getDeps(name, item.css) });

                bank.push({ path: item.js.path, params: params });
            }
        });


        return {
            bundles: [].concat(result[entryPointName] || []),
            entryPointName: entryPointName,
            data: context
        };
    }

    function getDeps(name, css) {
        return [].concat(
            name !== commonFileName ? [commonFileName + '.js'] : [],
            css ? [name + '.css'] : []);
    }

    function getRequireScriptSrc(item, isCss, isEntryPoint) {
        var extraParams = isCss ? { sync: true } : { bottom: true };

        if (!isCss && isEntryPoint) extraParams.waitFor = [commonFileName + '.js'];

        return item ? { src: bucket.require(item.path, merge(item.params, extraParams)), id: item.params.key } : {};
    }

    return function(staticBundle, entryPointName, context, isJson) {
        return isJson ?
            getJsonResult(staticBundle, entryPointName, context) :
            getHtmlResult(staticBundle, entryPointName, commonFileName, context);
    };
};
