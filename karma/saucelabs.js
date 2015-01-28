module.exports = function(config) {

    var customLaunchers = {
        sl_chrome_39: {
            base: 'SauceLabs',
            browserName: 'Chrome',
            platform: 'OS X 10.9',
            version: '39'
        },
        sl_chrome_38: {
            base: 'SauceLabs',
            browserName: 'Chrome',
            platform: 'OS X 10.9',
            version: '38'
        },
        sl_chrome_37: {
            base: 'SauceLabs',
            browserName: 'Chrome',
            platform: 'OS X 10.9',
            version: '37'
        }
    };

    config.sauceLabs       = { testName: 'Pellucid Karma Tests' };
    config.customLaunchers = customLaunchers;
    config.browsers        = Object.keys(customLaunchers);
    config.reporters       = ['saucelabs', 'progress'];
    return config;

};