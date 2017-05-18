/**
 * Created by jifengdehao on 2017/5/18.
 */
var gulp=require("gulp");
var $=require("gulp-load-plugins")();
var open=require("open");
var pngquant = require('imagemin-pngquant');
var app={
    srcPath:"src/",
    devPath:"build/",
    prdPath:"dist/"
};
gulp.task("lib",function(){
    gulp.src("bower_components/**/*.*")
        .pipe(gulp.dest(app.srcPath+"vendor"))
        .pipe(gulp.dest(app.devPath+"vendor"))
        .pipe(gulp.dest(app.prdPath+"vendor"))
        .pipe($.connect.reload());
});
//JS合并压缩
gulp.task("js",function(){
    gulp.src(app.srcPath+"script/**/*.js")
        .pipe($.plumber())
        .pipe($.concat("main.js"))
        .pipe(gulp.dest(app.devPath+"js"))
        .pipe($.uglify())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(app.prdPath+"js"))
        .pipe($.connect.reload());
});

//json
gulp.task("json",function(){
    gulp.src(app.srcPath+"data/**/*.json")
        .pipe(gulp.dest(app.devPath+"data"))
        .pipe(gulp.dest(app.prdPath+"data"))
        .pipe($.connect.reload());
});
//压缩html
gulp.task("html",function(){
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(app.srcPath+"**/*.html")
        .pipe($.plumber())
        .pipe(gulp.dest(app.devPath))
        .pipe($.htmlmin(options))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
});
//less编译和css自动补全 css压缩
gulp.task("less",function(){
    gulp.src(app.srcPath+"style/index.less")
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest(app.devPath+"css"))
        .pipe($.cssmin({compatibility: 'ie8'}))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(app.prdPath+"css"))
        .pipe($.connect.reload());
});
//图片压缩
gulp.task("image",function(){
    gulp.src(app.srcPath+"image/**/*")
        .pipe($.imagemin({
            progressive: true,////类型：Boolean 默认：false 无损压缩jpg图片
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(app.devPath+"image"))
        .pipe(gulp.dest(app.prdPath+"image"))
        .pipe($.connect.reload());
});
gulp.task("clean",function(){
    gulp.src([app.devPath,app.prdPath])
        .pipe($.clean());
});
gulp.task("build",["lib","html","json","less","js","image"]);
//服务开启
gulp.task("serve",["build"],function() {
    $.connect.server({
        root: [app.devPath],
        livereload: true,
        port: 8100
    });
    open("http://localhost:8100");
    gulp.watch(app.srcPath+"**/*.html",["html"]);
    gulp.watch(app.srcPath+"data/**/*.json",["json"]);
    gulp.watch(app.srcPath+"style/**/*.less",["less"]);
    gulp.watch(app.srcPath+"script/**/*.js",["js"]);
    gulp.watch(app.srcPath+"image/**/*",["image"]);
});
gulp.task("default",["serve"]);