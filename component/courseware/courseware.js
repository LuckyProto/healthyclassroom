Component({
    properties: {
        // 这里定义了属性，属性值可以在组件使用时指定
        isLogin :{
            type: Boolean,
            value: false
        },
        isBuy : {
            type: Number,
            value: 0
        },
        courseWares: {
            type    : Object,
            value   : ''
        },
        courseWaresWiperWidth: {
            type    : Number,
            value   : ''
        },
        courseWareSrc: {
            type    : String,
            value   : ''
        },
        canMoveCount: {
            type    : Number,
            value   : 0
        }
    },
    data: {
        // 这里是一些组件内部数据
        //移动
        startX      : 0,     //移动初始位置
        endX        : 0,     //移动结束位置
        moveLeft    : 0,     //移动到的位置
        movedCount  : 0,     //已经移动的次数

        //图片缩放
        oldDistance : 0,
        diffDistance: 0,        //手指间距
        scale       : 1,        //原始缩放倍数
        oldScale    : 1,        //初始放大倍数
        newScale    : undefined, //缩放倍数
        baseWidth   : 686,      //图片初始尺寸
        baseHeight  : 514,
        scaleWidth  : 686,      //缩放尺寸
        scaleHeight : 514,
        //选中课件显示css
        isActive    : false,
        isShowCourseware: false,     //是否显示课件
        rotate: 0      //箭头初始角度
    },
    methods: {
        // 这里是一个自定义方法
        changeIsShowCourseware: function () {
            this.setData({
                isShowCourseware: !this.data.isShowCourseware,
                rotate: this.data.rotate == 0 ? -180 : 0
            })
        },
        showBigImage: function (event) {
            this.setData({
                courseWareSrc   : event.currentTarget.dataset.src,
                isActive        : true
            })
        },
        closeBigCourseWare: function () {
            this.setData({
                scaleWidth      : this.data.baseWidth,
                scaleHeight     : this.data.baseHeight,
                courseWareSrc   : '',
                isActive        : false
            })
        },
        /**
        *  滑动
        */
        tarchStart: function (event) {
            this.data.startX = event.touches[0].pageX;
        },
        tarchEnd: function (event) {
            console.log('end')
            if (this.data.canMoveCount > 0) {
                var self = this,
                    eachMoveX = 252,	    //每次移动距离	
                    moveX = 0,  		//移动距离
                    step = 63,	    //移动步长
                    during = 40,       //持续时间
                    eachMoveCounts = eachMoveX / step; //单次移动距离需要移动几小步
                this.data.endX = event.changedTouches[0].pageX;
                //左移
                if (this.data.endX < this.data.startX && Math.abs(this.data.movedCount) < this.data.canMoveCount) {
                    self.setData({
                        movedCount: self.data.movedCount - 1
                    })
                    var leftMovedSteps = 0;
                    var timer = setInterval(function () {
                        leftMovedSteps += 1;
                        if (leftMovedSteps >= eachMoveCounts) {
                            clearInterval(timer);
                            self.setData({
                                moveLeft: self.data.moveLeft - step
                            })
                        } else {
                            self.setData({
                                moveLeft: self.data.moveLeft - step
                            })
                        }
                    }, during)
                    //右移
                } else if (this.data.endX > this.data.startX && this.data.movedCount < 0) {
                    var rightMovedSteps = 0;
                    self.setData({
                        movedCount: self.data.movedCount + 1
                    })
                    var rightTimer = setInterval(function () {
                        rightMovedSteps += 1;
                        if (rightMovedSteps >= eachMoveCounts) {
                            clearInterval(rightTimer);
                            self.setData({
                                moveLeft: self.data.moveLeft + step
                            })
                        } else {
                            self.setData({
                                moveLeft: self.data.moveLeft + step
                            })
                        }
                    }, during)
                }
            }
        },
        //缩放
        touchstart: function(e){
            var xMove = e.touches[1].clientX - e.touches[0].clientX;
            var yMove = e.touches[1].clientY - e.touches[0].clientY;
            var distance = Math.sqrt(xMove * xMove + yMove * yMove);
            this.setData({
                oldDistance: distance
            })
        },
        touchmove: function(e){
            var xMove = e.touches[1].clientX - e.touches[0].clientX;
            var yMove = e.touches[1].clientY - e.touches[0].clientY;
            var distance = Math.sqrt(xMove * xMove + yMove * yMove);

            this.setData({
                diffDistance: distance - this.data.oldDistance,
                oldDistance: distance,
            })
            this.setData({
                scale: this.data.scale + 0.01 * this.data.diffDistance
            })
            this.setData({
                scaleWidth: this.data.baseWidth * this.data.scale,
                scaleHeight: this.data.baseHeight * this.data.scale
            })
            if(this.data.scaleWidth < 750){
                this.setData({
                    scaleWidth: this.data.baseWidth,
                    scaleHeight: this.data.baseHeight
                })
            }
        }
    }
})