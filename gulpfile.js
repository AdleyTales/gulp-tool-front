const gulp = require('gulp');
const babel = require('gulp-babel');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const pump = require('pump');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev'); // 对文件名加MD5后缀
const rev_html = require('gulp-rev-append'); //  给URL自动加上版本号
const revCollector=require('gulp-rev-collector');//路径替换
const clean=require('gulp-clean');//清理
const concat = require('gulp-concat'); // 合并

/**
 * 合并文件任务
 * 并没有实际作用 可以统计代码数
 */
gulp.task('concat', function (cb) {
    pump([
        gulp.src('src/js/*.js'),
        concat('all.js'),//合并后的文件名
        gulp.dest('dist/js')
    ], cb);
});

/**
 * css 处理任务
 * css 压缩
 * css md5 签名
 */
gulp.task('cssmin', function () {
    gulp.src('src/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css'));
});

/**
 * js 处理任务
 * 编译 es6+ => es5
 * js 压缩
 * js md5 签名
 */
gulp.task('jsmin', function () {
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'));
});

/**
 * 路径替换任务
 * css js签名过的文件 替换到html中
 */
 gulp.task('rev',function(){
     gulp.src(['./rev/*/*json','./src/*.html'])
         .pipe(revCollector())
         .pipe(gulp.dest('./dist'));
 });

/**
 * 图片处理任务
 * images 压缩图片
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
 * HTML处理任务
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

//给html中添加版本的概念
gulp.task('rev_html',function(){
    gulp.src('./src/*.html')
        .pipe(rev_html())
        .pipe(gulp.dest('./dist'));
});

/**
 * 清理文件任务
 */
 gulp.task('clean', function() {
     gulp.src(['./dist'], {read: false})
         .pipe(clean());
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
// gulp.task('default', ['jsmin', 'cssmin', 'imgmin', 'htmlmin', 'mvFile']);
gulp.task('default', ['clean', 'jsmin', 'cssmin', 'rev']);
