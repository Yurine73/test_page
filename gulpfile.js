'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	pug = require('gulp-pug'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'build/',
		pug: 'build/',
		js: 'build/',
		css: 'build/',
		img: 'build/',
		fonts: 'build/fonts/'
	},
	src: {
		html: 'src/**/*.html',
		pug: 'src/**/*.pug',
		js: 'src/**/main.js',
		style: 'src/**/main.scss',
		img: 'src/**/images/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		pug: 'src/**/*.pug',
		js: 'src/**/*.js',
		style: 'src/**/*.scss',
		img: 'src/**/images/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build'
};

var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "yurine_pref"
};

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('pug:build', function buildHTML() {
	gulp.src(path.src.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('style:build', function () {
	gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(sass({
			sourceMap: true,
			errLogToConsole: true
		}))
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));
});

// Images optimization and copy in /dist
gulp.task('image:build', function () {
	return gulp.src(path.src.img)
		.pipe(cache(imagemin([
			imagemin.gifsicle({
				interlaced: true
			}),
			imagemin.jpegtran({
				progressive: true
			}),
			imageminJpegRecompress({
				loops: 5,
				min: 65,
				max: 70,
				quality: 'medium'
			}),
			imagemin.svgo(),
			imagemin.optipng({
				optimizationLevel: 3
			}),
			pngquant({
				quality: '65-70',
				speed: 5
			})
			], {
			verbose: true
		})))
		.pipe(gulp.dest(path.build.img));
});

// Clearing the cache
gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

gulp.task('fonts:build', function () {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
	'pug:build',
	'js:build',
	'style:build',
	'fonts:build',
	'clear',
	'image:build'
]);


gulp.task('watch', function () {
	watch([path.watch.pug], function (event, cb) {
		gulp.start('pug:build');
	});
	watch([path.watch.style], function (event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function (event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function (event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function (event, cb) {
		gulp.start('fonts:build');
	});
});


gulp.task('default', ['build', 'webserver', 'watch']);