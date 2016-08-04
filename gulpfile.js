(function() {

    'use strict';

    // Gulp dependencies
    var gulp       = require('gulp'),
        jshint     = require('gulp-jshint'),
        concat     = require('gulp-concat'),
        jscs       = require('gulp-jscs');

    // Linter
    // ------------------------------------------------------------------------------------------------------

    gulp.task('lint', function () {
        return gulp
            .src('src/js/**/*.js')
            .pipe(jscs())
            .pipe(jscs.reporter())
            .pipe(jscs.reporter('fail'))
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

    // Core
    // ------------------------------------------------------------------------------------------------------

    gulp.task('build_core', ['build_background_script']);

    gulp.task('build_background_script', function () {
        return gulp
            .src(['src/js/background.js'])
            .pipe(gulp.dest('dist/js'));
    });

    // Core
    // ------------------------------------------------------------------------------------------------------

    gulp.task('build_options', ['build_options_script', 'build_options_html']);

    gulp.task('build_options_script', function () {
        return gulp
            .src(['src/js/options/**/*.js'])
            .pipe(concat('options.js'))
            .pipe(gulp.dest('dist/js'));
    });

    gulp.task('build_options_html', function () {
        return gulp
            .src(['src/html/**/*.html'])
            .pipe(gulp.dest('dist/html'));
    });

    gulp.task('build', [
        'build_core',
        'build_options',
        'lint'
    ]);

    gulp.task('watch', function() {
        gulp.watch('src/**/*', ['build_core', 'build_options']);
    });

    // Default tasks (called when running `gulp` from cli)
    gulp.task('default', [
        'build_core',
        'build_options',
        'watch'
    ]);

}());
