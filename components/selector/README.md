[TOC]



# 版本要求

由于该组件使用了关键帧动画，所以使用的基础库需要在 2.9.0 以上



#  引用

将该文件夹至于components文件夹中，在需要使用的页面的配置json中的usingComponents添加

```
"selector": "/components/selector/selector"
```

后面便可以通过 <selector> 使用该选择器了



# 参数

定义选择器时，提供以下参数由于配置选择器选择项、样式等

## show

该选择器是否显示，类型为Boolean，默认为false。

如默认就显示选择器

```
<selector show />
```

通常与配合属性渲染使用

```
<selector show="{{selectShow}}" />
```

## animate

是否启用动画，类型为Booleam，默认为false。

如果为truw时，在选择器需要显示时选择面板将从下往上划出，背景淡出，关闭与此相反。

如果为false则无任何动画效果

```
<selector animate />
<selector animate="{{false}}" />
```

## duration

动画持续时长，类型为Number，默认为300，单位为毫秒，仅在animate为true时有效

```
<selector duration="500"
```

## title

选择器显示文本，类型为String，默认为空

```
<selector title="请选择类型" />
```

## multiple

是否是多选，类型为Boolean，默认为false

```
<selector multiple />
```

## cancel-text

取消按钮文本，类型为String，默认为“取消”，仅在multiple为true时显示

```
<selector multiple cancelText="关闭" />
```

## sure-text

确认按钮文本，类型为String，默认为“确认”，仅在multiple为true时显示

```
<selector multiple sureText="完成" />
```

## options-data

可选列表，类型为Array，默认空

如果列表元素为对象时，则会通过value和key获取对应的值和文本，如果非对象时则值和文本都为该值

```
// js
data: {
    genders: ["男", "女"]
}
// wxml
<selector options-data="{{genders}}" />
```

### key

选择器显示文本参数名，类型为String，默认“text”

## value

选择器选中值参数名，类型为String，默认为“value”

```
// js
data: {
    account: [{id: 1, name: "jayin"}, {id: 2, name: "jade"}]
}
// wxml
<selector options-data="{{account}}" key="name" value="id" />
```

## select-value

选中的值，类型为String或Array，默认为null

如果String，该组件会内部将其转成Array

当optionsData元素非对象时则直接比较元素是否相等并进行选中，如果是对象时则获取元素中value指定参数名的值比较

如果是Array，并且当前非多选，则只会取第一个元素作为选中值

```
// 选中 jade 项
<selector ... select-value="2" />
```

## max-item

选择器中最多展示的选择项个数，类型为Numer，默认为5

当optionsData元素个数大于该值时将会变成“滚动条”

## container-style

选择器背景颜色，类型为String，默认为空

建议仅修改其background值，否则可能会出现样式错乱

```
<selector container-style="background: white;border-radius: 15px" />
```

## mask-background

遮罩背景颜色，类型为String，默认为rgba(0, 0, 0, 0.5)

```
<selector mask-background="black" />
```

## selector-title-style

选择器标题样式，类型为String，默认空

## cancel-btn-style

取消按钮样式，类型为String，默认空

## sure-btn-style

确认按钮样式，类型为String，默认空

## option-style

选择项样式，类型为String，默认空

## select-option-style

当前选中项样式，类型为String，默认空



# 事件

## show

显示事件，当 show 属性为true时触发该事件，事件无特殊值

## change

在多选点击确认或多选点击非选中项触发，而不是点击选中项时就触发。

事件值（event.detail）

1. value：选中的value值
2. index：选择目标在optionsData中的下标

## close

关闭事件，在 show 为false触发

注意，如果开启了animate时，则需要等到动画结束后触发。

事件值（event.detail）

1. type：关闭类型，有"sure"确认关闭和"cancel"取消关闭