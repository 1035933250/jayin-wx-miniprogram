let maskSelect = ".__selector-mask__",
    containerSelect = ".__selector-container__";
/**
 * 该组件提供了三种事件
 * change：改变，只有多选点击确定或多选点击非选中项时触发
 * close：关闭时间，注意，在取消和选中确认时都会触发（在动画结束后）
 * show：show，显示事件，动画开始前触发
 */
Component({
  properties: {
    /** 是否显示 */
    show: {type: Boolean, value: false,
      observer: function (newV, oldV) {
        if (newV == oldV) return;
        if (!this.data.animate) {
          this.setData({_show: newV});
        }
        this.showOrCloseAnimate(newV);
      }
    },
    /** 关闭和打开是否动画 */
    animate: {type: Boolean, value: true},
    /** 动画持续时间，毫秒 */
    duration: {type: Number, value: 300}, 
    /** 标题 */
    title: { type: String, value: "" },

    /** 遮罩颜色 */
    maskBackground: { type: String, value: "rgba(0, 0, 0, 0.5)" },

    /** 是否多选，如果是才会显示取消和确认 */
    multiple: {type: Boolean, value: false },
    /** 取消文本 */
    cancelText: { type: String, value: "取消" },
    /** 确认文本 */
    sureText: { type: String, value: "确认"},

    /** 选项键 */
    key: { type: String, value: "text" },
    /** 选项值 */
    value: { type: String, value: "value"},
    /** 选项值 */
    optionsData: {type: Array, value: [{text: "请选择", value: ""}]},
    /** 选中的对象 */
    selectValue: {type: [String, Array], value: null,
      observer: function (newV) { // 保持临时选中值与外部选中值更新同步
        this.setData({
          _selectValue: this.transSelectValueToArray(newV)
        })
      }
    },  
    /** 页面最大选项数，超过这个数将滚动 */
    maxItem: {type: Number, value: 5},

    /* 行间样式 */
    /** 容器样式 */
    containerStyle: {type: String, value: ""},
    /** 标题 */
    selectorTitleStyle: {type: String, value: ""},
    /** 取消按钮 */
    cancelBtnStyle: {type: String, value: ""},
    /** 确认按钮 */
    sureBtnStyle: {type: String, value: ""},
    /** 选择项 */
    optionStyle: {type: String, value: ""},
    /** 已选项 */
    selectOptionStyle: {type: String, value: ""},
  },
  data: {
    _selectValue: [], // 组件保存的选中值
    _show: false, // 显示和关闭缓冲属性
    _show_sync: false, // 动画结束后show属性改变同步
    _close_type: "", // 关闭类型，分为 cancel 和 sure
  },
  observers: {
    /** 监听_show值控制调用onshow和onclose */
    "_show": function (show) {
      if (show) {
        this.triggerEvent("show");
      } else {
        this.triggerEvent("close", {type: this.data._close_type});
      }
    }
  },
  methods: {
    /** 将传入的选中值转成有效的数组选中项 */
    transSelectValueToArray: function (selectValue) {
      let v = null;
      if (selectValue instanceof Array) { 
        selectValue = selectValue.map((item) => {return item;}); // 拷贝数组
        if (ths.data.multiple) { // 多选数据全保存
          v = selectValue; 
        } else { // 单选仅保存第一个
          selectValue.splice(1);
          v = selectValue;
        }
      } else { // 如果是单个选择值则直接保存
        v = [];
        selectValue == null ? "" : v.push(selectValue);
      }
      return v;
    },
    /** 点击选择项 */
    selectOption: function(event) {
      let _selectValue = this.data._selectValue, 
          valueName = this.data.value,
          selectIndex = event.target.dataset.index,
          selectOption = this.data.optionsData[selectIndex],
          optionValue = optionField(selectOption, valueName, "value"),
          multiple = this.data.multiple;

      // 选择项数据处理
      let repeatIndex = _selectValue.findIndex((v) => { return v == optionValue; });
      if (repeatIndex >= 0) {
        if (multiple) { // 如果是多选则移除重复的值
          _selectValue.splice(repeatIndex, 1);  
        } else { // 单选的则不操作
          return; 
        }
      } else {
        if (!multiple) _selectValue.splice(0);
        _selectValue.push(optionValue)
      }
      
      this.setData({
        _selectValue: _selectValue
      }, function () {
        if (!multiple) { // 如果是单选则完成选择
          this.changeSelect();
        }
      })
    },
    /** 通过value找到所在选择项位置 */
    findOptionIndexByValue: function (value) {
      if (this.data.optionsData == null) return -1;
      return this.data.optionsData.findIndex((v) => { 
        let _v = optionField(v, this.data.value, "value");
        return _v == value; 
      })
    },
    /**
     * 关闭选择器
     * @param {*} closeType 关闭类型，分为取消和确认选择
     */
    closeSelector: function (closeType) {
      this.setData({
        show: false,
        _close_type: closeType ? closeType : "cancel",
        _selectValue: this.transSelectValueToArray(this.data.selectValue) // 恢复选择内容
      })
    },
    /** 完成数据修改，点击确认按钮或单选选中 */
    changeSelect: function () {
      let _selectValue = this.data._selectValue;
      let index = [];
      for (let i in _selectValue) {
        index.push(this.findOptionIndexByValue(_selectValue[i]));
      }
      // 回调改变事件
      this.triggerEvent("change", {value: _selectValue, index: index});
      this.closeSelector("sure");
    },
    /** 查找指定value在 */
    findOptionIndexByValue: function (value) {
      return this.data.optionsData.findIndex((v) => { 
        return optionField(v, this.data.value, "value") == value; 
      })
    },
    /** 显示和关闭动画控制 */
    showOrCloseAnimate: function (newV) {
      if (newV) {
        this.setData({_show: true}); // 如果是显示需要先将_show设为true，才有动画效果
      }
      wx.createSelectorQuery().in(this).select(containerSelect).fields({size: true}).exec((res) => {
        let height = res[0].height, duration = this.data.duration,
            beginBottom, endBottom, 
            beginOpacity, endOpacity;
        if (newV) {
          beginBottom = -height, endBottom = 0,
          beginOpacity = 0, endOpacity = 1;
        } else {
          beginBottom = 0, endBottom = -height, 
          beginOpacity = 1, endOpacity = 0;
        }
        
        // 创建动画
        this.animate(containerSelect, [{bottom: beginBottom + "px"}, {bottom: endBottom + "px"}], duration, () => {
          changeShow.bind(this)(newV);
        })
        this.animate(maskSelect, [{opacity: beginOpacity}, {opacity: endOpacity}], duration, () => {
          changeShow.bind(this)(newV);
        })
        
        function changeShow(newV) {
          if (newV) return;
          if (this.data._show_sync) this.setData({_show: false, _show_sync: false});
          else this.setData({_show_sync: true});
        }
      });
    },
  }
})

/** 从指定的选项中根据设置的属性值获取属性 */
function optionField(option, field, defaultField) {
  if (option == null) return "";
  if (typeof option != 'object') return option;
  var v = field == null ? option[defaultField] : option[field];
  return v == null ? "" : v;
}