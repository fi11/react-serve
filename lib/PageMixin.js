var React = require('react');
var dom = React.DOM;

module.exports = {
    generateScriptsComponent: function(scripts) {
        return [].concat(scripts || []).map(function(item, idx) {
            return dom.script({
                id: item.id ? item.id : undefined,
                dangerouslySetInnerHTML: { __html: item.src, key: idx }
            });
        });
    },

    generateBodyComponent: function(scripts) {
        var body = React.renderComponentToString(this.props.appComponent()) +
            [].concat(scripts || []).map(function(item, idx) {
                return React.renderComponentToStaticMarkup(
                    dom.script({
                        id: item.id ? item.id : undefined,
                        dangerouslySetInnerHTML: {__html: item.src, key: idx }
                    }));
            }).join('\n');


        return dom.body({ className: 'body', dangerouslySetInnerHTML: { __html: body } });
    }
};


