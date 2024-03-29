const project_folder = "dist";
const source_folder = "src";
const gulp = require("gulp");
const del = require("del");
const sass = require('gulp-sass');
const browsersync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const autoPrefixer = require("gulp-autoprefixer");
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const groupQueries = require("gulp-group-css-media-queries");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const imagemin = require("gulp-imagemin");
const { src, dest } = require("gulp");

const path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: source_folder + "/html/*.html",
        scss: source_folder + "/scss/style.scss",
        style: source_folder + "/style/**/*.css",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.{ttf,woff,woff2}",
    },
    watch: {
        html: source_folder + "/html/**/*.html",
        scss: source_folder + "/scss/**/*.scss",
        style: source_folder + "/style/**/*.css",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + project_folder + "/"
}

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    });
}

function html() {
    return src(path.src.html)
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function style(done) {
    src(path.src.style)
        .pipe(dest(path.build.css));
    browsersync.reload();
    done();
}

function scss(done) {
    src(path.src.scss)
        .pipe(plumber())
        .pipe(
            sass({
                outputStyle: "expanded",
            })
        )
        .pipe(
            autoPrefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(groupQueries())
        .pipe(dest(path.build.css))
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(cleanCSS())
        .pipe(dest(path.build.css));
    browsersync.reload();
    done();
}

function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

function clean() {
    return del(path.clean);
}

function watchFiles(cb) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.scss], scss);
    gulp.watch([path.watch.style], style);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.js], js);
}

const build = gulp.series(clean, gulp.parallel(scss, style, html, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.js = js;
exports.fonts = fonts;
exports.images = images;
exports.scss = scss;
exports.style = style;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;