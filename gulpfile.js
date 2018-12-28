const gulp = require('gulp');
const babel = require('gulp-babel');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const pump = require('pump');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

/**
 * 压缩css
 */
gulp.task('cssmin', function () {
    gulp.src('src/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

/**
 * 编译js
 * 压缩js
 */
gulp.task('jsmin', function () {
    gulp.src('src/scripts/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
});

/**
 * 压缩图片
 */
gulp.task('imgmin', function () {
    gulp.src('src/images/*.{png,jpg,gif,ico,jpeg}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images'));
});

/**
 * 压缩html
 */
gulp.task('htmlmin', function () {
    gulp.src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        }))
        .pipe(gulp.dest('dist/'));
});

/**
 * 移动lib
 */
gulp.task('mvFile', function () {
    gulp.src('src/js/**')
        .pipe(gulp.dest('dist/js'));
});

/**
 * exec
 */
gulp.task('default', ['jsmin', 'cssmin', 'imgmin', 'htmlmin', 'mvFile']);