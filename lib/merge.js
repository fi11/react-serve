module.exports = function merge(obj, props) {
    var result = {};

    Object.keys(obj).forEach(function(key) {
        result[key] = obj[key];
    });

    Object.keys(props).forEach(function(key) {
        result[key] = props[key];
    });

    return result;
};
