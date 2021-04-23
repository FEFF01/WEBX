# WEBX

> * 支持 `View` `Model` 混合书写
> * 支持字面上声明模型绑定
> * 其实这是个响应式的 `JS` ,只是额外支持了 `HTML` 的字面表达
> * 和一般的 `MV*` 框架实现方式不太一样，`WEBX` 通过编译时语义分析转化将更改的响应最小化（不需要在运行时执行庞大的 `VDOM` 比对），更新效率大概是 `VUE` 的 5 倍以上，不过现阶段生成耗时也是 `VUE` 的 1.5 倍

![image](https://feff01.github.io/static/img/webx_1.gifp)

### 测试
> * [在线代码编辑器](https://feff01.github.io/WEBX/dist/editor.html)
> * [40000 递归组件生成 & 更新测试](https://feff01.github.io/WEBX/dist/performance-webx.html)

### 使用

> * 安装
```bash
yarn add webx-loader --dev
```
> * 配置 webpack loader （ webpack.config -> module -> rules -> ）
```javascript
    {
        test: /\.webx$/,
        loader: "webx-loader"
    }
```
> * 任意 `webpack` 架子配置 `webx-loader` 后就能和使用普通 `.js` 文件一样使用 `.webx` 文件，[.webx demo](./test/)

### 主要规则

> 在 `JS` 环境中字面上的标签为 Element 表达式

> * 例如： `document.head.appendChild(<style>...</style>)`

> `Element` 内部为 `HTML` 环境，可为 `HTML` 环境插入各种单向或双向绑定的要素，或者插入 `JS` 环境用于根据条件产生各种子元素或其他；例如：

> * 事件监听：
```xml
    <button onclick=function(e){}></button>

    <button onclick=function add(){} /> 

    <button onclick=e=>{}/> 

    function add(){}
    <button onclick=add/> 

    /**
     * 如果 add 可能会被从新定义，可以用 @() 做绑定的声明
     * 后续 add 变量有任何变更 onclick 监听方法都会得到更新
     */
    let add=function(){}
    <button onclick=@(add)/> 
```
> * 声明非绑定值：
```xml
<span title=name>((name))<span>
<span title=`name : ${name}`>((name))<span> // 这里的 `` 只是 es6 的模板表达式，属性 = 右边可以是几乎所有的表达式
```
> * 声明单向绑定：
```xml 
<span title=@(name)>@{`name : ${name}`}<span>  
// 其实 title=@{name} 也是允许的，@{} 会根据当前语境做相应的转化
// 不过 {} 更多的是块级语句或模板的意思 () 和表达式比较接近，这里用 @() 比较合适一点
```

> * 存在内部变更的属性可声明双向绑定：
```xml
    <input value=@(name)/>
    <input type="radio" checked=@(checked)/>
    <select value=@(selected)></select>

    // 也可以仅初始化取值，方法参考上文
```


> * 使用自定义组件
```xml
    let list=[
        {name:"aaa"},
        {name:"bbb",nodes:[{name:"ccc"}]}
    ]
    document.body.appendChild(
        <MyComponent list=@(list)>
            <li>
                @{
                    let name="";
                    <input value=@(name) placeholder="name"/>
                    <button onclick=function(){
                        list.unshift({name});
                        name="";
                    }>add</button>
                }
            </li>
        </MyComponent>
    )
    function MyComponent({list,children}){
        return <ul>
            @:children
            @:for(let item of list){
                <li>
                    @{item.name}
                    @:if(item.nodes && item.nodes.length){
                        <MyComponent list=@(item.nodes)/>
                    }
                </li>
            }
        </ul>
    }

```

> * `HTML` 环境内插入 `JS`  
```xml
    /**
     * "@:" 后面可以接着一条 JS 语句
     * 如果 "@:" 后接着的是一条表达式语句，
     * 则该表达式的结果会作为父级元素的子元素
     * 如果 "@:" 后接着的是声明语句，
     * 则该声明成立的同时将每个声明结果的值作为父级元素的子元素
     * 
     * "@{}" 大括号内是绑定的 JS 语句块  
     * 如果 "@{}" 语句块内仅包含一条语句且为表达式语句，
     * 则该表达式的结果会作为父级元素的子元素
     * 
     * 如果语句块内包含多条语句，
     * 则仅包含单独的 Identifier Literal Element 的语句都视为父级元素的子元素
     * 
     * 通过这些方式声明的 for 或  if 语句中使用 return continue break 会有限制，不过影响不大后续取消限制或列出
     */
    let list = [
        {show:true,disabled:true,title:"test",message:"aaa"}
    ];
    let view = <ul>
        @{
            let title="";
            let message="";
            <li>
                <input value=@(title) placeholder="title"/>
                <input value=@(message)  placeholder="message"/>
                <button onclick=function(){
                    list.unshift({
                        show:true,
                        disabled:false,
                        title,message
                    });
                    title="";
                    message="";
                }>add</button>
            </li>
        }
        @:for(let item of list){
            let {show,disabled,title,message}=item;
            if(show){
                <li 
                    class=@(`item ${disabled?"disable":""}`)
                    onclick=function (){
                        item.disabled^=true;
                    }
                >
                    <cite>@{title}</cite>
                    <span>@{message}</span>
                </li>
            }
        }
    </ul>
    document.body.appendChild(view);
```

>  使用路由

> * 在 .webx 文件中如果使用到 `<Router/>` 或 `<RouterLink/>` 组件则会自动引入 Router 相关支持
> * Router 或者 RouterLink 相关所有字段都可以使用 @() 做绑定声明

> * Router 可以存在于组件中，子组件中的 Router 将会接着上级具有相同 mode 的 Router 匹配剩余部分做响应式匹配
> * Router 支持 path mode component 等属性，如果指定了 component 则 Router 会将接收到的属性传递至 component
> * 不同 mode 的 Router 可以混搭共存
> * path 可以为字符串或者为字符串数组,可指定模式与 to 字段相同和 cd 命令差别不大，当 path 属性指定为相对路径时，为相对于当前具有相同 mode 的上级 Router （如果不存在则为根）的路径

> * RouterLink 支持 to mode action tag 等属性，其他额外属性会传递至 tag 指定的元素
> * RouterLink 如果 to 属性指定为相对路径时，为相对于当前具有相同 mode 的当前 Router （如果不存在则为根）的路径
> * to 可以指定 'xx' '/xx' './xxx' '../xx' 等模式 ，其中 'xx' './xxx' '../xx' 为相对路径，'/xx' 表示根路径
> * tag 默认为 a ，如果 tag 为 a 且没有指定 href 属性，则会自动根据当前情况生成 href
> * action 默认为 append , 可以指定 append replace back 三种选项

> * mode 默认为上级 Router 元素的 mode 属性如果不存在则为 hash ，可以指定 hash history 两种选项

```xml
document.body.appendChild(
    <div>
        <RouterLink to="/test" mode="hash">to test</RouterLink>
        <Router path="/test" mode="hash">
            test
            <br/>
            <RouterLink to="./one" action="replace">01</RouterLink>
            <RouterLink to="./two" action="replace">02</RouterLink>
            <br/>
            <RouterLink to="../" action="back">back</RouterLink>
            <RouterLink to="/" action="back">back</RouterLink>
            <br/>
            <Router 
                path=["/:bar","../:bar/:foo"]
                component=function({children,match:{bar,foo}}){
                    return <span>
                        @:children;
                        <br/>
                        @:"bar : " + bar;
                        <br/>
                        @:"foo : " + foo;
                        <br/>
                    </span>
                }
            > test 00 </Router>
            <Router path="one"> test 01 </Router>
            <Router path="./two"> test 02 </Router>
        </Router>
    </div>
)
```


> 更多 @action @autorun 等的高级用法可以参考 [editor.html](https://feff01.github.io/WEBX/dist/editor.html)







 
