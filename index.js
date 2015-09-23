var loaderUtils = require('loader-utils');
var stylecow = require('stylecow-core');

module.exports = function (source, map) {
    this.cacheable();

    var file   = loaderUtils.getRemainingRequest(this),
        config = this.options.stylecowLoader,
        cb     = this.async(),
        tasks  = new stylecow.Tasks(),
        coder  = new stylecow.Coder('minify');

    if (config.support) {
        tasks.minSupport(config.support);
    }

    if (config.plugins) {
        config.plugins.forEach(function (plugin) {
            tasks.use(require('stylecow-plugin-' + plugin));
        });
    }

    if (config.modules) {
        config.modules.forEach(function (module) {
            tasks.use(require(module));
        });
    }

    var css = stylecow.parse(source);

    tasks.run(css);

    var code = coder.run(css, file, undefined, map);

    cb(null, code.css, code.map ? JSON.parse(code.map) : {});
};
