const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
var assetRev = require('gulp-asset-rev');
//es6转es5
var babel = require("gulp-babel");
var del = require('del');
//合并 压缩 重命名
var concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

//html替换
var htmlreplace = require('gulp-html-replace');

//给文件加指纹
var md5 = require("gulp-md5-plus");

var runSequence = require('gulp-sequence');

const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const through2 = require('through2')
const gulpif = require('gulp-if')
//转换文件编码
var convertEncoding = require('gulp-convert-encoding');

function replaceSuffix() {
    const pattern = /-[0-9a-f]{8,10}-?\.[^"]*/gmi; //匹配出-7ef5d9ee29.css，用于后面做文章
    return through2.obj(function (file, encoding, done) {
        let content = String(file.contents).replace(pattern, function (match, pos, origin) {
            const pat = /[0-9a-f]{8,10}-?/g;  //匹配出7ef5d9ee29，用于后面拼接
            if (pat.test(match)) {
                return RegExp["$'"].concat("?v=", RegExp["$&"]);//如果$'和$&这句话看不懂，红宝书第五章正则表达式部分该复习了；
            } else {
                return match;
            }
        });
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
}

//输出目录
var exportDir = 'dist2';
var NODE_ENV = process.env.NODE_ENV
//为了区分生产环境和开发环境
//生产环境下对js进行压缩混淆处理
var production = (NODE_ENV.toString().trim() === 'dev' ? false : true);

gulp.task('clean:' + exportDir, function (cb) {
    return del([
        exportDir + '/**/*.*',
    ], cb);
});

gulp.task('default', ['bus']);

gulp.task('bus', function (cb) {
    console.log(1);
    runSequence('clean:' + exportDir, 'copy','css', 'js', 'js-html',
        'filemd5', 'filemd52')();
});

/*复制并粘贴基础公共代码 */
gulp.task('copy', function () {
    return gulp.src(['map/js/vue.min.js'], { base: '.' })
        .pipe(gulp.dest(exportDir))
});

gulp.task('css', () =>
    gulp.src('./map/css/*.css')
        // .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '>1%'],
            cascade: false
        }))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist2/map/css'))
);


/*业务代码 */
gulp.task('js', () =>
    gulp.src(['./map/js/map.js','./map/js/data.js','./map/js/industrys.js'])
        //转换成 ES5
        .pipe(babel())
        //合并所有js到main.jsmain.js到文件夹
        //.pipe(concat('main.js'))    
        //rename压缩后的文件名
        // .pipe(rename({ suffix: '.min' }))
        //压缩
        .pipe(gulpif(production, uglify()))
        //输出
        .pipe(gulp.dest(exportDir + '/map/js'))
);

/*替换html */
gulp.task('js-html', () =>
    gulp.src(['./map.html'])
        //转换成 ES5
        // .pipe(htmlreplace())
        //输出
        .pipe(convertEncoding({to: 'utf8'}))
        .pipe(gulp.dest(exportDir + '/'))
);

gulp.task('filemd5', () =>
    gulp.src([exportDir + '/map/js/map.js',exportDir + '/map/js/data.js',exportDir + '/map/js/industrys.js'])
        // .pipe(rev())
        // .pipe(gulp.dest(exportDir + '/student/js/business'))
        // .pipe(rev.manifest())
        .pipe(rev())
        .pipe(rev.manifest({ merge: true }))
        .pipe(replaceSuffix())  //利用上面写的方法替换得到类似index.css?v=7ef5d9ee29的样式      
        .pipe(gulp.dest(exportDir))
);

gulp.task('filemd52', () =>
    gulp.src([exportDir + '/rev-manifest.json', exportDir + '/map.html'])
        .pipe(revCollector({
            revSuffix: '\\?v=[0-9a-f]{8,10}-?'  //利用revCollector的可配置，去满足我们需要的模式；
        }))
        .pipe(gulp.dest(exportDir + '/'))
);

gulp.task('es6', () =>
    //转换成 ES5
    gulp.src('./student/business/mutualReview.js')
        .pipe(babel())
        .pipe(gulp.dest(exportDir + '/student/business'))
);

// gulp.task('img', () => {
//     gulp.src('./res/img/*.png')
//         .pipe(gulp.dest('dist/res/img'))
//     gulp.src('./res/zsjm/*.*')
//         .pipe(gulp.dest('dist/res/zsjm'))
// }

// );


// gulp.task('css', () =>
//     gulp.src('./res/*.css')
//         // .pipe(sourcemaps.init())
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions', '>1%'],
//             cascade: false
//         }))
//         // .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('dist/res'))
// );

// gulp.task('revCss', function () {
//     gulp.src('./res/*.css')
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions', '>1%'],
//             cascade: false
//         }))
//         // .pipe(assetRev())
//         .pipe(gulp.dest('dist/res'))
// });