//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    itemList: [{
      id: 1,
      image: '1.png',//图片地址
      top: 100,//初始图片的位置 
      left: 100,
      x: 155, //初始圆心位置，可再downImg之后又宽高和初始的图片位置得出
      y: 155,
      scale: 1,//缩放比例 1为不缩放
      angle: 0,//旋转角度
      active: false //判定点击状态
    }, {
        id: 2,
        image: '2.png',
        top: 50,
        left: 50,
        x: 155,
        y: 155,
        scale: 1,
        angle: 0,
        active: false
  }],
  
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
    WraptouchStart: function (e) {
      for (let i = 0; i < items.length; i++) { //旋转数据找到点击的
        items[i].active = false;
        if (e.currentTarget.dataset.id == items[i].id) {
          index = i;  //记录下标
          items[index].active = true; //开启点击属性
        }
      }

      items[index].lx = e.touches[0].clientX; // 记录点击时的坐标值
      items[index].ly = e.touches[0].clientY;
      this.setData({  //赋值 
        itemList: items
      })
    }
    , WraptouchMove: function (e) {
      //移动时的坐标值也写图片的属性里
      items[index]._lx = e.touches[0].clientX;
      items[index]._ly = e.touches[0].clientY;

      //追加改动值
      items[index].left += items[index]._lx - items[index].lx; // x方向
      items[index].top += items[index]._ly - items[index].ly;  // y方向
      items[index].x += items[index]._lx - items[index].lx;
      items[index].y += items[index]._ly - items[index].ly;

      //把新的值赋给老的值
      items[index].lx = e.touches[0].clientX;
      items[index].ly = e.touches[0].clientY;
      this.setData({//赋值就移动了
        itemList: items
      })
    },

    touchStart: function (e) {
      //找到点击的那个图片对象，并记录
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;

        if (e.currentTarget.dataset.id == items[i].id) {
          console.log('e.currentTarget.dataset.id', e.currentTarget.dataset.id)
          index = i;
          console.log(items[index])
          items[index].active = true;
        }
      }
      //获取作为移动前角度的坐标
      items[index].tx = e.touches[0].clientX;
      items[index].ty = e.touches[0].clientY;
      //移动前的角度
      items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
      //获取图片半径
      items[index].r = this.getDistancs(items[index].x, items[index].y, items[index].left, items[index].top)
    },
    // 触摸移动事件 
    touchMove: function (e) {
      //记录移动后的位置
      items[index]._tx = e.touches[0].clientX;
      items[index]._ty = e.touches[0].clientY;
      //移动的点到圆心的距离 * 因为圆心的坐标是相对与父元素定位的 ，所有要减去父元素的OffsetLeft和OffsetTop来计算移动的点到圆心的距离
      items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx - this.sysData.windowWidth * 0.125, items[index]._ty - 10)

      items[index].scale = items[index].disPtoO / items[index].r; //手指滑动的点到圆心的距离与半径的比值作为图片的放大比例
      items[index].oScale = 1 / items[index].scale;//图片放大响应的右下角按钮同比缩小

      //移动后位置的角度
      items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)
      //角度差
      items[index].new_rotate = items[index].angleNext - items[index].anglePre;

      //叠加的角度差
      items[index].rotate += items[index].new_rotate;
      items[index].angle = items[index].rotate; //赋值

      //用过移动后的坐标赋值为移动前坐标
      items[index].tx = e.touches[0].clientX;
      items[index].ty = e.touches[0].clientY;
      items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)

      //赋值setData渲染
      this.setData({
        itemList: items
      })
    },

    countDeg: function (cx, cy, pointer_x, pointer_y) {
      var ox = pointer_x - cx;
      var oy = pointer_y - cy;
      var to = Math.abs(ox / oy);
      var angle = Math.atan(to) / (2 * Math.PI) * 360;//鼠标相对于旋转中心的角度
      console.log("ox.oy:", ox, oy)
      if (ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系 
      {
        angle = -angle;
      } else if (ox <= 0 && oy >= 0)//左下角,3象限 
      {
        angle = -(180 - angle)
      } else if (ox > 0 && oy < 0)//右上角，1象限 
      {
        angle = angle;
      } else if (ox > 0 && oy > 0)//右下角，2象限 
      {
        angle = 180 - angle;
      }

      return angle;
    },

    getDistancs(cx, cy, pointer_x, pointer_y) {
      var ox = pointer_x - cx;
      var oy = pointer_y - cy;
      return Math.sqrt(
        ox * ox + oy * oy
      );
    },

    tpDownload: function (data, isDownload) { //data为组件的参数，isDownload判断是否为https网络图片来判断是否需要下载
      if (yy < 0) { //改变生成图片时的位置
        speed = -speed
      }
      if (yy > 300) {
        speed = -speed
      }
      yy += speed;
      let _this = this;
      let newTpdata = {};
      newTpdata.id = data.id;
      newTpdata.itemid = data.itemid;
      newTpdata.top = 100 + yy;
      newTpdata.left = 100;
      newTpdata.width = _this.sysData.windowWidth / 4;
      newTpdata.scale = 1;
      newTpdata.angle = 0;
      newTpdata.rotate = 0;
      newTpdata.active = true;
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;
      }
      if (isDownload) {
        wx.downloadFile({
          url: data.image,
          success: res => {
            newTpdata.image = res.tempFilePath;
            items.push(newTpdata);
            _this.setData({
              itemList: items
            })
            wx.hideLoading();
          }
        })
      } else {
        newTpdata.image = data.image;
        items.push(newTpdata);
        _this.setData({
          itemList: items
        })
        wx.hideLoading();
      }
    },

    save: function () {
      this.setData({
        showCanvas: true,
        canvasHeight: this.sysData.windowHeight * 0.85
      })
      let obj = this.data.item;
      /*
      canvasWidth值为canvas宽度；
      this.data.canvasPre是占屏幕宽度的百分比（80）
      */
      let canvasWidth = this.sysData.windowWidth * this.data.canvasPre / 100; //
      /*
      num为canvas内背景图占canvas的百分比，若全背景num =1
      this.sysData.windowWidth * 0.75为可移动区的宽度
      prop值为canvas内背景的宽度与可移动区域的宽度的比，如一致，则prop =1;
      */
      let prop = (canvasWidth * num) / (this.sysData.windowWidth * 0.75);
      maskCanvas.save();
      maskCanvas.beginPath();
      //一张白图
      maskCanvas.setFillStyle('#fff');
      maskCanvas.fillRect(0, 0, this.sysData.windowWidth, this.data.canvasHeight)
      maskCanvas.closePath();
      maskCanvas.stroke();
      //图头像
      let image = {
        w: canvasWidth * num * 0.287,
        h: canvasWidth * num * 0.287,
        r: canvasWidth * num * 0.287 / 2
      };
      //画背景 hCw 为 1.7781 背景图的高宽比
      maskCanvas.drawImage(obj.bgImg, canvasWidth * (1 - num) / 2, 10, canvasWidth * num, canvasWidth * num * hCw)
      //画底图
      maskCanvas.drawImage('https://octopus-master.oss-cn-shenzhen.aliyuncs.com/sys/0fec4b1864b8341bb84d9216b2cc42df.png', canvasWidth * (1 - num) / 2, canvasWidth * num * hCw + 15, canvasWidth * num, this.data.canvasHeight * 0.15)
      //画原
      maskCanvas.save();
      maskCanvas.beginPath();
      maskCanvas.arc(canvasWidth / 2, canvasWidth * num * hCw * obj.userTop / 100 + 10 + image.w / 2, image.r, 0, Math.PI * 2, false);
      // maskCanvas.stroke()
      maskCanvas.clip(); //截取
      //画头像
      maskCanvas.drawImage(obj.avatarUrl, (canvasWidth - image.w) / 2, canvasWidth * num * hCw * obj.userTop / 100 + 10, image.w, image.h)
      maskCanvas.closePath();
      maskCanvas.restore();
      //绘制文字
      maskCanvas.save();
      maskCanvas.beginPath();
      let fontSize = this.sysData.screenWidth / 375 * 15;
      let textColor = obj.color || '#000';
      maskCanvas.setFontSize(parseInt(fontSize) * prop)
      maskCanvas.setFillStyle(textColor)
      maskCanvas.setTextAlign('center')
      maskCanvas.fillText(obj.nickName, canvasWidth / 2, obj.titleTop / 100 * canvasWidth * num * hCw + 10 * 0.9 * prop + fontSize * prop);
      maskCanvas.closePath();
      maskCanvas.stroke();
      /** 
       * x
       * y
       * scale
       * prop
       * width
       * height
       * 
       */
      //画组件
      items.forEach((currentValue, index) => {
        maskCanvas.save();
        maskCanvas.translate(canvasWidth * (1 - num) / 2, 10);
        maskCanvas.beginPath();
        maskCanvas.translate(currentValue.x * prop, currentValue.y * prop); //圆心坐标
        maskCanvas.rotate(currentValue.angle * Math.PI / 180); // 旋转值
        maskCanvas.translate(-(currentValue.width * currentValue.scale * prop / 2), -(currentValue.height * currentValue.scale * prop / 2))
        maskCanvas.drawImage(currentValue.image, 0, 0, currentValue.width * currentValue.scale * prop, currentValue.height * currentValue.scale * prop);
        maskCanvas.restore();
      })
      maskCanvas.draw(false, (e) => {
        wx.canvasToTempFilePath({
          canvasId: 'maskCanvas',
          success: res => {
            this.setData({
              canvasTemImg: res.tempFilePath
            })
          }
        }, this)
      })
    }
}
})
