var React = require('react');

module.exports = {
    statics: {
        init: function(self, data) {
            self.mountStores(self, data);
            React.renderComponent(self(), document.body);
        },

        mountStores: function(self, data) {
            self.storesWillMount && self.storesWillMount(data);
        }
    }
};
