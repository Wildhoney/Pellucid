(function main() {

    var mainModule = 'module/Pellucid.js',
        vendorDest = 'example/vendor/pellucid',
        devDist    = 'pellucid.js',
        minDist    = 'pellucid.min.js';

    var gulp   = require('gulp'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        jshint = require('gulp-jshint');

    gulp.task('build', function gulpBuild() {

        return gulp.src(mainModule)
            .pipe(rename(devDist))
            .pipe(gulp.dest('dist'))
            .pipe(gulp.dest(vendorDest))
            .pipe(rename(minDist))
            .pipe(uglify())
            .pipe(gulp.dest('dist'));

    });

    gulp.task('hint', function gulpHint() {

        return gulp.src(mainModule)
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'));

    });

    gulp.task('test', ['hint']);
    gulp.task('default', ['test', 'build']);

})();