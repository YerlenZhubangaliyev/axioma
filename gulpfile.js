'use strict';

var
    args          = require('yargs')
        .usage('Usage: $0 --env [env]')
        .default('env', 'production')
        .argv,
    env           = args.env.toLowerCase(),
    isProduction  = (env === 'production'),
    fs            = require('fs-extra'),
    gulp          = require('gulp'),
    gulpIf        = require('gulp-if'),
    pug           = require('gulp-pug'),
    webpack       = require('webpack-stream'),
    sass          = require('gulp-sass'),
    plumber       = require('gulp-plumber'),
    svgSprite     = require('gulp-svg-sprite'),
    runSequence   = require('run-sequence'),
    cssNano       = require('gulp-cssnano'),
    config        = {
        src:     {
            templateFiles:        'src/templates/*.pug',
            templateFilesToWatch: 'src/templates/**/*.pug',
            javascriptMainFile:   'src/scripts/main.js',
            javascriptFiles:      'src/scripts/**/*.js',
            styleFiles:           'src/**/*.scss',
            svgFiles:             'src/**/*.svg',
            defaultHtml:          'public/index.html'
        },
        dist:    {
            staticFiles:      'public/',
            template:         'public/',
            spriteScssOutput: 'src/styles/'
        },
        webpack: {},
        sprite:  {
            mode: {
                css:         {
                    spacing: {
                        padding: 0,
                        box:     'content'
                    },
                    layout:  "diagonal",
                    bust:    false,
                    render:  {
                        scss: {
                            dest:     './_sprite.scss',
                            template: 'src/styles/_spriteTemplate.tpl'
                        }
                    },
                    sprite:  '../../public/images/sprite.svg',
                    dest:    './'
                },
                svg:         {
                    xmlDeclaration:      true,
                    doctypeDeclaration:  true,
                    namespaceIDs:        true,
                    dimensionAttributes: true
                },
                "transform": ["svgo"]
            }
        }
    }
    ;

process.env.NODE_ENV = args.env;

config.webpack = require('./config/webpack-' + process.env.NODE_ENV + '.js');

/**
 * Jade (pug) templates
 */
gulp.task('templates', function () {
    return gulp.src(config.src.templateFiles)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(config.dist.template))
        ;
});

/**
 * Compiling scripts
 */
gulp.task('scripts', function () {
    return gulp.src(config.src.javascriptMainFile)
        .pipe(plumber())
        .pipe(webpack(config.webpack))
        .pipe(gulp.dest(config.dist.staticFiles))
        ;
});

/**
 * Compiling styles
 */
gulp.task('styles', function () {
    return gulp.src(config.src.styleFiles)
        .pipe(sass())
        .pipe(gulpIf(isProduction, cssNano({
            discardComments: {
                removeAll: true
            }
        })))
        .pipe(gulp.dest(config.dist.staticFiles))
        ;
});

/**
 * Compiling sprite
 */
gulp.task('sprite', function () {
    return gulp.src([config.src.svgFiles])
        .pipe(plumber())
        .pipe(svgSprite(config.sprite))
        .pipe(gulp.dest(config.dist.spriteScssOutput));
});

/**
 * Webfonts
 */
gulp.task('fonts', function () {
    fs.copy('./src/fonts/', './public/fonts/', function (error) {
        if (error) {
            return console.error(error);
        }
    });
});

/**
 * Watching
 */
gulp.task('watch', function () {
    gulp.watch(config.src.templateFilesToWatch, ['templates']);
    gulp.watch(config.src.javascriptFiles, ['scripts']);
    gulp.watch(config.src.styleFiles, ['styles']);
    gulp.watch(config.src.svgFiles, ['sprite', 'styles']);
});

/**
 * Default task
 */
gulp.task('default', function () {
    runSequence('sprite', 'styles', 'scripts', 'templates');
});
