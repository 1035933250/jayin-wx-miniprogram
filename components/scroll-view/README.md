[TOC]

# 版本要求

由于该组件使用了scroll-view，所以使用的基础库需要在 1.0.0 以上



#  引用

将该文件夹至于components文件夹中，在需要使用的页面的配置json中的usingComponents添加

```
"j-scroll-view": "/components/scroll-view/index"
```

后面便可以通过 <j-scroll-view> 使用该选择器了



# 参数

定义选择器时，提供以下参数用于配置滚动视图

## refreshText

下拉加载时显示的文本

```
<j-scroll-view refresh-text="加载中" />
```

## useRefresherSlot

刷新显示内容是否使用插槽【toupper-refresh】，如果为true时，refreshText将失效

```
<j-scroll-view use-refresher-slot>
	<view slot="toupper-refresh">。。。</view>
</j-scroll-view>
```

## lowerLoadingText

底部加载显示文本，同refreshText

## useLowerLoadingSlot

刷新显示内容是否使用插槽【tolower-loading】，如果为true时，lowerLoadingText将失效

## showTopHoverButton

是否显示返回顶部悬浮按钮，需要使用插槽【top】实现图标按钮

## minShowTopHeight

显示修复按钮最小滚动高度

# 外部类

refresh-anim-class：刷新动画容器样式

refresh-prompt-class：刷新文本容器样式

lower-load-class：底部加载容器样式

lower-load-text-class：底部加载文本容器样式

to-top-class：返回顶部容器样式，注意，这里如果修改了按钮大小并且使用默认返回顶部按钮时，那么wxml中有个行间样式也记得修改

```
filter: drop-shadow(80rpx 0 {{topColor}});
```

-------

# 事件

## refresh

下拉刷新事件，触发后需要通过event.detail.that进行调用stopRefresh()方法取消加载状态

## lowerload

底部加载事件，触发后需要通过event.detail.that进行调用stopLoad()方法取消加载状态