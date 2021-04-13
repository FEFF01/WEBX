# WEBX

> * 支持 `View` `Model` 混合书写
> * 支持字面上声明模型绑定
> * 其实这是个响应式的 `JS` ,只是额外支持了 `HTML` 的字面表达
> * 和一般的 `MV*` 框架实现方式不太一样，`WEBX` 通过编译时语义分析转化将更改的响应最小化（不需要在运行时执行庞大的 `VDOM` 比对），更新效率大概是 `VUE` 的 5 倍以上，不过现阶段生成耗时也是 `VUE` 的 1.5 倍

### 测试
> * [在线代码编辑器](https://feff01.github.io/WEBX/dist/editor.html)
> * [40000 递归组件生成 & 更新测试](https://feff01.github.io/WEBX/dist/performance-webx.html)

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
> * 声明仅在初始化时取值不做绑定：
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


> 更多 @action @autorun 等的高级用法可以参考 [editor.html](https://feff01.github.io/WEBX/dist/editor.html)







 
