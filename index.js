var loaderUtils = require('loader-utils'),
    stylecow    = require('stylecow-core'),
    plugins     = require('stylecow-plugins');

module.exports = function (source, map) {
    this.cacheable && this.cacheable();

    var file     = loaderUtils.getRemainingRequest(this),
        config   = this.options.stylecowLoader || {},
        callback = this.async(),
        tasks    = new stylecow.Tasks(),
        coder    = new stylecow.Coder('minify');

    if (config.support) {
        tasks.minSupport(config.support);
    }

    tasks.use(plugins(config.plugins));

    if (config.modules) {
        config.modules.forEach(function (module) {
            tasks.use(require(module));
        });
    }

    var css = stylecow.parse(source);

    tasks.run(css);

    var code = coder.run(css, file, map);

    callback(null, code.css, code.map ? JSON.parse(code.map) : {});
};
