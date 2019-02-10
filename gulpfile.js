const gulp 			= require("gulp");
const del 			= require("del");
const sass 			= require("gulp-sass");
const mmq 			= require('gulp-merge-media-queries');
const minify 		= require("gulp-minify-css");
const imagemin 		= require('gulp-imagemin');
const autoprefixer 	= require('gulp-autoprefixer');
const server 		= require("browser-sync").create();
const path = {
	style: [
		"src/sass/**/*.sass",
		"src/scss/**/*.scss"
	],
	fonts: [
		"src/fonts/**/*.woff",
		"src/fonts/**/*.woff2",
		"src/fonts/**/*.ttf"
	],
	images: [
		"src/img/**/*.png",
		"src/img/**/*.jpg",
		"src/img/**/*.svg"
	],
	html: "src/**/*.html",
	scripts: "src/js/**/*.js"
};

sass.compiler = require("node-sass");



/**
 * Compile SASS/SCSS
 */

gulp.task("stylize:build", function() {
	console.log();
	return gulp
		.src(path["style"])
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		  }))
		.pipe(mmq())
		.pipe(minify())
		.pipe(gulp.dest("build/css/"));
});

gulp.task("stylize:dev", function() {
	return gulp
		.src(path["style"])
		.pipe(sass())
		.pipe(gulp.dest("build/css/"))
		.pipe(server.stream());
});



/**
 * Copying HTML
 */

gulp.task("html", function() {
	return gulp
		.src(path["html"], { base: "src/" })
		.pipe(gulp.dest("build/"));
});



/**
 * Copying scripts
 */

gulp.task("scripts", function() {
	return gulp
		.src(path["scripts"], {base: 'src/'})
		.pipe(gulp.dest("build/"));
});



/**
 * Optimize images
 */

gulp.task("images:build", function() {
	return gulp
		.src(path["images"], {base: 'src/'})
		.pipe(imagemin())
		.pipe(gulp.dest("build/"));
});

gulp.task("images:dev", function() {
	return gulp
		.src(path["images"], {base: 'src/'})
		.pipe(gulp.dest("build/"));
});



/**
 * Copying fonts
 */

gulp.task("fonts", function() {
	return gulp
		.src(path["fonts"], {base: 'src/'})
		.pipe(gulp.dest("build/"));
});



/**
 * Remove old build
 */

gulp.task("clean", function() {
	return del(["build/"]);
});



/**
 * Run browsercync server
 */

gulp.task("serve:dev", function(done) {
	server.init({
		server: "build/"
	});
	done();
});

gulp.task("reload:dev", function(done) {
	server.reload();
	done();
});



/**
 * File watchers
 */

gulp.task("watch:dev", function(done) {
	gulp.watch(path['style'], gulp.parallel("stylize:dev"));
	gulp.watch(path["html"], gulp.series("html", "reload:dev"));
	gulp.watch(path["scripts"], gulp.series("scripts"));
	gulp.watch(path["images"], gulp.parallel("images:dev"));
	gulp.watch(path["fonts"], gulp.parallel("fonts"));
	done();
});




gulp.task(
	"dev",
	gulp.series(
		"clean",
		"html",
		"scripts",
		"fonts",
		"stylize:dev",
		"images:dev",
		"watch:dev",
		"serve:dev"
	)
);

gulp.task(
	"build",
	gulp.series(
		"clean",
		"html",
		"scripts",
		"fonts",
		"stylize:build",
		"images:build"
	)
);
