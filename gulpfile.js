// Include gulp and plugins
var gulp        = require('gulp');
var sass        = require('gulp-ruby-sass');
var plumber     = require('gulp-plumber');
var browserify  = require('gulp-browserify');
var handlebars  = require('browserify-handlebars');
var gulpConnect = require('gulp-connect');
var lr          = require('tiny-lr')();
var reload      = require('gulp-livereload');
var prefix      = require('gulp-autoprefixer');
  

var paths = {
    dist: "dist/",
    css: "app/scss/app.scss",
    js: "app/js/app.js",
    img: "app/img/**/*",
    html: ["app/*.htm", "app/favicon.ico"],
    assets: "dist/public"
}

gulp.task('server', function(){
    return gulp.src("app/server/**/*")
        .pipe(gulp.dest(paths.dist));
});

gulp.task('connect', ['server'], function(){
    var server = require('./dist/server.js');
    server.use(require('connect-livereload')());
    lr.listen(35729);
});

// watch html files and update server when they change
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src(paths.html)
        .pipe(plumber()) // handle errors
        .pipe(gulp.dest(paths.assets))
        .pipe(reload(lr));
});


// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(paths.css)
        .pipe(plumber()) // handle errors
        .pipe(sass({
            quiet: true, // https://github.com/thoughtbot/bourbon/issues/286
            style: "expanded",
            sourcemap: true
        }))
        .pipe(prefix(["last 1 version", "> 1%", "ie 8", "ie 7"], { cascade: true }))
        .pipe(gulp.dest(paths.assets + "/css/"))
        .pipe(reload(lr));
});

// browserify our javascript
gulp.task('js', function() {
    return gulp.src("app/js/app.js")
        .pipe(plumber()) // handle errors
        .pipe(browserify({
            transform: [handlebars]
        }))
        .pipe(gulp.dest(paths.assets + "/js/"))
        .pipe(reload(lr));
});

// image
gulp.task('img', function() {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.assets + "/img/"));
});




// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/*.htm', ['html']);
    gulp.watch(['app/js/**/*.js', 'app/js/**/*/handlebars'], ['js']);
});

// Default Task
gulp.task('default', ['connect', 'html', 'sass', 'js', 'img', 'watch']);


