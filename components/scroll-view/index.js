let scrollIsZero = false, // 是否滚动到顶部，控制只有顶部才可以触发刷新事件
    toZeroTimestamp = 0, timestampInterval = 500; // 是否处于
Component({
  options: {
    multipleSlots: true, // 多插槽
  },
  externalClasses: [
    'refresh-anim-class', // 刷新动画容器样式
    'refresh-prompt-class', // 刷新文本样式
    'lower-load-class', // 底部加载容器类
    'lower-load-text-class', // 底部加载文本内容
    'to-top-class', // 返回顶部样式
  ],
  properties: {
    refreshText: { type: String, value: "刷新中..." }, // 刷新时显示文本
    useRefresherSlot: {type: Boolean, value: false}, // 使用自定义的刷新动画
    lowerLoadingText: { type: String, value: "加载中..." }, // 加载中显示文本
    useLowerLoadingSlot: { type: Boolean, value: false }, // 使用自定义底部加载

    // 返回顶部按钮
    useTopSlot: { type: Boolean, value: false }, // 使用自定义返回顶部
    topColor: { type: String, value: 'inherit' }, // 返回顶部颜色
    showTopHoverButton: { type: Boolean, value: true }, // 是否显示悬浮按钮
    minShowTopHeight: { type: Number, value: 200 }, // 最小显示返回顶部按钮的高度
  },
  data: {
    isInit: false, // 是否首次加载完成
    refresherHeight: -1, // 刷新动画控件高度
    currentTop: 0, // 当前的top值

    refresherThreshold: 0.7, // 进入刷新状态阈值，top到达 阈值 * refresherHeight 时就触发刷新
    refresherTriggered: true, // 是否进入刷新状态
    lowerLoadTriggered: false, // 是否进入底部加载状态
    
    showTop: false, // 显示返回顶部
  },
  methods: {
    scrollToShowRefresh: function (event) {
      let scrollTop = event.detail.scrollTop, 
          showTopHeight = this.data.minShowTopHeight + this.data.refresherHeight, // 顶部高度需要加载动画元素高度
          toTopScrollHeight = this.data.refresherHeight; // 返回的高度
      // 是否显示返回顶部
      if (scrollTop < showTopHeight) this.setData({ showTop: false });
      else this.setData({ showTop: true })

      // 已经是刷新状态则始终至于顶部
      if (this.data.refresherTriggered) {
        this.startRefresh();
        return;
      } else if (scrollTop > toTopScrollHeight) {
        scrollIsZero = false;
        return; // 如果还未到达临界值直接退出
      } else if (!scrollIsZero) { // 如果存在定时器则清除
        if (this.scrollEndTimer) clearTimeout(this.scrollEndTimer);
      }
      
      /** 如果还未到0点并且不是刷新状态时设置0点状态并返回 或者 处于底部加载状态 */
      if (!scrollIsZero && !this.data.refresherTriggered || this.data.lowerLoadTriggered) {
        this.scrollToTop(event);
        return;
      }

      let cThreshold = this.data.refresherHeight - scrollTop; // 比较顶部距离时不需要添加缓冲值
      if (this.data.refresherThreshold * this.data.refresherHeight <= cThreshold) { // 触发加载状态
        // 触发刷新事件，并返回当前对象，可通过对象中的 stopRefresh 方法停止刷新
        this.startRefresh(true);
        return;
      }

      if (event.timeStamp - toZeroTimestamp < timestampInterval) return;
      // 记录并探测活动结束
      let _this =this;
      if (this.scrollEndTimer) {
          clearTimeout(this.scrollEndTimer);
          this.scrollEndTimer =null;
      }
      this.scrollEndTimer = setTimeout(function () {
        if (_this.data.refresherTriggered) return;
        _this.setData({currentTop: _this.data.refresherHeight});
      }, 100);
    },
    // 在未触发恢复位置
    resetPosition: function () {
      if (this.data.refresherTriggered) {
        this.stopRefresh();
      }
    },
    // 开始刷新状态
    startRefresh: function (trigger) {
      this.setData({ refresherTriggered: true, currentTop: 0 });
      if (trigger) this.triggerEvent("refresh", {that: this});
    },
    // 停止刷新状态
    stopRefresh: function () {
      this.setData({ currentTop: this.data.refresherHeight, refresherTriggered: false, isInit: true });
    },
    // 滚动至顶部
    scrollToTop: function (event) {
      this.setData({ currentTop: this.data.refresherHeight }, function () {
        toZeroTimestamp = event.timeStamp;
        scrollIsZero = true;
      })
    },
    lowerLoad: function (event) {
      if (this.data.lowerLoadTriggered) return;
      this.setData({
        lowerLoadTriggered: true
      }, () => this.triggerEvent("lowerload", {that: this}) // 触发底部加载
      )
    },
    stopLoad: function () {
      this.setData({ lowerLoadTriggered: false });
    }
  },
  lifetimes: {
    attached: function () {
      // 重置全局变量
      scrollIsZero = false, toZeroTimestamp = 0;
      // 获取刷新元素高度
      this.createSelectorQuery().select(".__refresh-anim-container").boundingClientRect(res => {
        this.setData({ refresherHeight: res.height }, function () {
          // 默认进来就会触发加载时间
          this.startRefresh(true);
        });
      }).exec();
    }
  }
})
