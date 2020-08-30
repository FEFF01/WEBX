# WEBX

##主要规则
> * 支持 `html` 与 `js` 混合书写并根据 `\()` 和 `\{}` 描述的内容做动态数据绑定(基于语法分析的数据绑定)
> * `\()` 为绑定表达式，该表达式绑定内部使用到的任何作用域内变量，并响应其更改
> * `\{}` 为绑定块，类似`\()`
> * 绑定可以发生在html元素属性、innertext、cssrule、或者js变量初始化、js方法调用参数等等
> * 任何传达到顶级执行环境的`html`元素都将是最终渲染的元素（即使未被任何变量接收）

# [AST测试链接](https://feff01.github.io/WEBX/out/index.html)

# 只完成混合语言+数据绑定语法规则的AST解析，语法分析和其他附加部分待续

# 预想的例子：
```javascript
    let font_size=10,y=10,custom_value=10;
    <style>
        /*ss<a></a>*/
        .test{
            font-size:\(font_size.toFixed(1))px;
        }
        \(name) {
            position: relative;
            display: \(is_show?"block":"none");
            transform: translate(0, \(y)px);
            animation: test ease-in steps(5) 6s 3s;
            line-height: calc(100%-\(custom_value)px);
        }
    </style>
    let test="test";
    let is_show=false;
    setTimeout(()=>{
        is_show=true;
        font_size+=Math.random()*10;
        test="test1"
    },1000)
    let v1=1,v2=4;
    let v3 =\(
         v1 + v2
    );//使用了绑定初始化，v3会随着 V1 或者 V2更改而更改
    create_element(\(v3));//这个位置最终为 create_element 方法返回的元素
    let a = <a 
        style={
            zIndex:10,
            "font-size":font_size,
            display: is_show ? "block" : "none"
        } 
        data-test="test" 
        data-test2=test /*没有使用绑定描述，只使用初始值*/
        data-test3=\(test) /*响应test更改*/
        onclick = function(e){console.log(e)} 
        >
            <input 
                value=\(test) /*双向绑定*/
            />
            s
            \(v1 + v2) 
            <br/>
            \(show_more &&<span>more</span>)
            <br/>
            <b>
                \{
                    v1 += v2;
                    return v1>2*v2?v1:v2;
                }
                \{
                    if(show_more){
                        return <span>more</span>
                    }
                }
            </b>
            a
            <span>sdfds<!--sdf
            
            dsf-->a</span>
        </a>;
    function create_element(inner_html){
        return <b>\(inner_html)</b>;
    }

```


 