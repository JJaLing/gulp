var less = require('gulp-less');
var gulp = require('gulp');
var smushit = require('gulp-smushit'); //png杀手
var path = require('path');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin') //压缩效果比较一般
var concat = require('gulp-concat'); //合并
var uglify = require('gulp-uglify'); //js压缩
var sourcemaps = require('gulp-sourcemaps'); //
var browsersync = require('browser-sync').create();
var reload = browsersync.reload;

var del = require('del');
gulp.task('clean', function(cb) {
    return del(['dist/*'], cb);
})

gulp.task('less', function() {
    return gulp.src('./style/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(sourcemaps.init()) //sourcemap
        .pipe(concat('style.css')) //合并
        .pipe(sourcemaps.write())
        .pipe(cssnano()) //压缩
        .pipe(gulp.dest('./dist/public/css')) //输出
        .pipe(reload({ stream: true })); //
});
gulp.task('less-watch', ['less'], browsersync.reload);

gulp.task('html-copy', function() {
    gulp.src('./html/index.html')
        .pipe(gulp.dest('dist/'));
});
gulp.task('html-watch', ['html-copy'], browsersync.reload);

gulp.task('minimages', function() {
    gulp.src('./assets/img/*.png')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(gulp.dest('dist/public/img'))
})

gulp.task('images', function() {
    gulp.src('./assets/img/*.png')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/public/img'))
})

gulp.task('javac', function() {
    gulp.src('./js/**/*')
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
})

gulp.task

gulp.task('assets-copy', function() {
    gulp.src(['./assets/**/*', '!./assets/img/*.png'])
        .pipe(gulp.dest('dist/public/'));
});
gulp.task('assets-watch', ['assets-copy'], browsersync.reload);

gulp.task('serve', ['clean'], function() {
    gulp.start('html-copy');
    gulp.start('images');
    gulp.start('assets-copy');
    gulp.start('less');
    browsersync.init({
        port: 3000,
        server: {
            baseDir: ['dist']
        }
    });
    gulp.watch('./style/**/*.*', ['less-watch']);
    gulp.watch('./assets/image/*.png' ['images']);
    gulp.watch('./html/*.html', ['html-watch']);
    gulp.watch('./assets/**/*.*', ['assets-watch']);
});

gulp.task('default', ['serve']);