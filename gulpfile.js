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
var nodemon     = require('gulp-nodemon');
  

var paths = {
    dist: "dist/",
    css: "app/scss/app.scss",
    js: "app/js/app.js",
    img: "app/img/**/*",
    html: ["app/*.htm", "app/favicon.ico"],
    assets: "dist/public"
}

// Move server code to dist
gulp.task('server', function(){
        
    // nodemon({ 
    //     script: './dist/server.js', 
    //     ext: 'js', 
    //     ignore: ['ignored.js'] 
    // })
    // .on('change', function(){ 
    // })
    // .on('restart', function () {
    // });


    return gulp.src("app/server/**/*")
        .pipe(gulp.dest(paths.dist));
});

// load our node server and set up live reload
gulp.task('connect', ['server'], function(){
    var server = require('./dist/server.js'); 
    server.use(require('connect-livereload')()); 
    lr.listen(35729);
});

// watch html files and update server when they change
gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(plumber()) // handle errors
        .pipe(gulp.dest(paths.assets))
        .pipe(reload(lr));
});


// Compile Our Sass when a file changes
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
            transform: [handlebars],
            debug: true
        }))
        .pipe(gulp.dest(paths.assets + "/js/"))
        .pipe(reload(lr));
});

// image
gulp.task('img', function() {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.assets + "/img/"));
});


gulp.task('package.json', function(){
    return gulp.src("package.json")
        .pipe(gulp.dest(paths.dist));
})



// Watch files for changes
gulp.task('watch', function() {
    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/*.htm', ['html']);
    gulp.watch(['app/js/**/*.js', 'app/js/**/*/handlebars'], ['js']);
});

// Default Task (run when you run 'gulp')
gulp.task('default', ['connect', 'html', 'package.json', 'sass', 'js', 'img', 'watch']);


