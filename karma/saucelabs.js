module.exports = function(config) {

    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'Chrome',
            platform: 'OS X 10.9',
            version: '39'
        }
    };

    config.sauceLabs       = { testName: 'Pellucid Karma Tests' };
    config.customLaunchers = customLaunchers;
    config.browsers        = Object.keys(customLaunchers);
    config.reporters       = ['saucelabs', 'progress'];
    return config;

};