Page({
  data: {
    pp: 40,
  },  
  refreshPage: function (event) {
    console.log(event);
    let that = this, svThat = event.detail.that;
    setTimeout(() => {
      that.setData({pp: 40});
      svThat.stopRefresh();
    }, 1000);
  },
  loadNextPage: function (event) {
    console.log(event);
    let that = this, svThat = event.detail.that;
    setTimeout(() => {
      that.setData({pp: this.data.pp + 40});
      svThat.stopLoad();
    }, 1000);
  },
})