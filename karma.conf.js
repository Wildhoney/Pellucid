module.exports = function(config) {

    // Determine which strategy to use based on the `SAUCE_ACCESS_KEY` env.
    //const KARMA_STRATEGY = process.env.SAUCE_ACCESS_KEY ? 'saucelabs' : 'localhost';
    var KARMA_STRATEGY = 'saucelabs';

    var options = {
        frameworks: ['jasmine'],
        files: [
            'module/Pellucid.js',
            'tests/spec.js'
        ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true
    };

    options = require('./karma/' + KARMA_STRATEGY + '.js')(options);
    config.set(options);

};