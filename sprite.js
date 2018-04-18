const gulp = require('gulp');
const globby = require('globby');
const path = require('path');
const srpitesmith = require('gulp.spritesmith');

const getFolder = async() => {
  const paths = await globby(['src/slice/**/*.{jpg,png}', '!node_modules']);
  const tmp = {};
  paths.forEach((item) => {
    const tmpPath = path.dirname(item);
    const key = tmpPath.substring(tmpPath.lastIndexOf('/') + 1);
    if (!tmp[key]) {
      tmp[key] = tmpPath;
    }
  });
  return tmp;
}

(async() => {
  //  遍历 不同目录
  getFolder().then((foldersObj) => {
    Object.keys(foldersObj).forEach((item) => {
      const tmpPath = path.join(foldersObj[item], '/*.{jpg,png}');
      const nowPipe = gulp.src(tmpPath)
        .pipe(srpitesmith({
          imgPath: `../img/sprite-${item}.png`,
          padding: 10,
          imgName: `sprite-${item}.png`,
          cssName: `sprite-${item}.scss`,
          cssTemplate: (data) => {
            // data为对象，保存合成前小图和合成打大图的信息包括小图在大图之中的信息
            let arr = [],
              width = data.spritesheet.px.width,
              height = data.spritesheet.px.height,
              url = data.spritesheet.image
            // console.log(data)
            data.sprites.forEach(function (sprite) {
              arr.push(
                `
.icon-${sprite.name} {
  background: url('${url}') no-repeat ${sprite.px.offset_x} ${sprite.px.offset_y};
  width: ${sprite.px.width};
  height: ${sprite.px.height};
  display:inline-block;
}
                `
              )
            })
            // return "@fs:108rem;\n"+arr.join("")
            return arr.join("")
          }
        }));
      nowPipe.img.pipe(gulp.dest('./src/img/'));
      nowPipe.css.pipe(gulp.dest('./src/css/module/'));
    });
  });
})();