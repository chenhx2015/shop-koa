##  一：NodeJs
    优点：
    1. 高并发（最重要的优点）
    2. 适合I/O密集型应用
    适用场景
    （1）RESTful API
     这是NodeJS最理想的应用场景，可以处理数万条连接，本身没有太多的逻辑，只需要请求API，组织数据进行返回即可。它本质上只是从某个数据库中查找一些值并将它们组成一个响应。由于响应是少量文本，入站请求也是少量的文本，因此流量不高，一台机器甚至也可以处理最繁忙的公司的API需求。

    （2） 统一Web应用的UI层
     目前MVC的架构，在某种意义上来说，Web开发有两个UI层，一个是在浏览器里面我们最终看到的，另一个在server端，负责生成和拼接页面。
     不讨论这种架构是好是坏，但是有另外一种实践，面向服务的架构，更好的做前后端的依赖分离。如果所有的关键业务逻辑都封装成REST调用，就意味着在上层只需要考虑如何用这些REST接口构建具体的应用。那些后端程序员们根本不操心具体数据是如何从一个页面传递到另一个页面的，他们也不用管用户数据更新是通过Ajax异步获取的还是通过刷新页面。

    （3）大量Ajax请求的应用
     例如个性化应用，每个用户看到的页面都不一样，缓存失效，需要在页面加载的时候发起Ajax请求，NodeJS能响应大量的并发请求。　　总而言之，NodeJS适合运用在高并发、I/O密集、少量业务逻辑的场景。

    缺点：
    1. 不适合CPU密集型应用；CPU密集型应用给Node带来的挑战主要是：由于JavaScript单线程的原因，如果有长时间运行的计算（比如大循环），将会导致CPU时间片不能释放，使得后续I/O无法发起；
    解决方案：分解大型运算任务为多个小任务，使得运算能够适时释放，不阻塞I/O调用的发起；

    2. 只支持单核CPU，不能充分利用CPU
    原因：单进程，单线程
    解决方案：
    （1）Nnigx反向代理，负载均衡，开多个进程，绑定多个端口；
    （2）开多个进程监听同一个端口，使用cluster模块；
             
## 二：为什么选择koa, 对比和 express 的好处
    node目前最常用的 web 框架就是 express 和 koa,我们选择 koa 是因为：
    1.框架自身并没集成太多功能，大部分功能需要第三方中间件去解决，本身代码简洁，高内聚低耦合，利于维护。
    2.以前的版本基于co组件，实现ES6 generator特性，现在新版本使用 async await 实现异步，避免了回调地狱

    一切学习都是从 Hello Word 开始的！先举个简单的例子：
    (1) 安装 npm install koa
    (2) 例子：

        const Koa = require('koa');
        const app = new Koa();

        app.use(async (ctx, next) => {
            console.log('start 1');
            await next();
            console.log('end 1');
            ctx.body = 'Hello Koa';
        })
        app.use(async (ctx, next) => {
            console.log('start 2');
            await next();
            console.log('end 2');
        })
        app.use(ctx => {
            console.log('finally')
        })

        app.listen(3000)
        
        // start 1
        // start 2
        // finally
        // end 2
        // end 1

三：原理 -- 源码
    koa的源码也很精巧，lib目录下总的包含了四个文件：application.js, context.js, request.js, response.js. 
    具体的解析请看源码解析的截图（sourceImg 文件）

四：常用的中间件及其原理 (常用几大中间件)
    1.koa-bodyparser（不支持 form-data 的请求体,也可以使用 koa-body）
    （一）用途和原理
        前置知识点：
        HTTP请求报文主要包括：报文首部 + 空行 + 报文主体，而 koa-bodyparser 主要针对报文主体的处理。

        服务端获得报文主体的流程：
        HTTP底层采用TCP提供可靠的字节流服务，简单而言就是报文主体部分会被转化为二进制数据在网络中传输，所以服务器端首先需要拿到二进制流数据。
        谈到网络传输，会涉及到传输速度的优化，网络传输中对内容进行压缩编码常用的压缩编码方式有：gzip， compress， deflate， identity。
        服务器端会根据报文头部信息中的Content-Encoding确认采用何种解压编码。
        接下来就需要将二进制数据转换为相应的字符，而字符也有不同的字符编码方式，例如对于中文字符处理差异巨大的UTF-8和GBK，UTF-8编码汉字通常需要三个字节，而GBK只需要两个字节。所以还需要在请求报文的头部信息中设置Content-Type使用的字符编码信息（默认情况下采用的是UTF-8），这样服务器端就可以利用相应的字符规则进行解码，得到正确的字符串。
        拿到字符串之后，服务器端又要问了：客户端，你这一段字符串是啥意思啊？
        根据不同的应用场景，客户端会对字符串采用不同的编码方式，常见的编码方式有：
        URL编码方式: a=1&b=2
        JSON编码方式: {a:1,b:2}
        客户端会将采用的字符串编码方式设置在请求报文头部信息的 Content-Type 属性中，这样服务器端根据相应的字符串编码规则进行解码，就能够明白客户端所传递的信息了。
    
        分析 koa-bodyParser 是如何处理这些操作来得到报文主体内容的：
        1.先定义了三个检查类型的辅助函数，分别为：
          formatOptions： 标准化参数，用来统一参数格式的
          extendType：扩展类型
          checkEnable：传入types, type两个参数，检查第二个参数类型是否在第一个参数类型里面
          还引入了相关的两个模块：co-body， copy-to

        2.（重点）把请求里面对应的 content-type 类型经过一一对应的解码处理之后（使用 co-body 模块的 parse.json(), parse.form(), parse.text() 方法来解码），挂载到上下文 ctx.request 中。


    （二）使用例子
        npm install koa-bodyparser@2 --save
      
        var Koa = require('koa');
        var bodyParser = require('koa-bodyParser');

        var app = new Koa();
        app.use(bodyParser());

        app.use(async ctx => {
            ctx.body = ctx.request.body;
        })

        // 注意，还有一些可选项，具体参考 https://www.npmjs.com/package/koa-bodyparser

    2.koa-router
    （一）用途
        koa为了保持自身的精简，没有像 express 那样自带路由功能，koa-router 提供了全面的路由功能，比如类似Express的app.get/post/put的写法，URL命名参数、路由命名、支持加载多个中间件、嵌套路由等。
        针对不同的请求做出 response 响应。

    （二）使用
        npm install koa-router

        var Koa = require('koa');
        var Router = require('koa-router');

        ver app = new Koa();
        var router = new Router(); 

        router.get('/', (ctx, next) => {
            ctx.body = 'Hello Word';
        })

        app.use(router.routes())

    3.koa-session
    （一）用途和原理
        http 协议是无状态的，因此需要保存用户的信息，来鉴定用户的真实性。
        session 和 cookie 的区别：
        session要求服务端存储信息，并且根据id能够检索，而token不需要。在大规模系统中，对每个请求都检索会话信息可能是一个复杂和耗时的过程。但另外一方面服务端要通过token来解析用户身份也需要定义好相应的协议。

        koa-session 是采用 cookie 来实现 session，默认情况下只使用一个 cookie 字段来存储 session 信息。
        服务端通过set-cookie的方式把信息返回给客户端，客户端下次请求的时候会自动带上符合条件的cookie，服务端再解析cookie就能够获取到session信息了。

    （二）使用
        const session = require('koa-session');
        const Koa = require('koa');
        const app = new Koa();

        app.keys = ['some secret hurr'];
        const CONFIG = {
            key: 'koa:sess',
            maxAge: 86400000,
            autoCommit: true,
            overwrite: true, 
            httpOnly: true, 
            signed: true, 
            rolling: false,
            renew: false,
        }

        app.use(session(CONFIG, app));
        app.use(ctx => {
            let n = ctx.session.views || 0;
            ctx.session.views = ++n;
            ctx.body = n + ' views';
        });

    4.koa-jwt
    （一）用途和原理
        主要提供路有权限控制的功能，它会对需要限制的资源请求进行检查
    （二）使用
        npm install koa-jwt

        var Koa = require('koa');
        var jwt = require('koa-jwt');
        
        var app = new Koa();
        
        // Custom 401 handling if you don't want to expose koa-jwt errors to users
        app.use(function(ctx, next){
        return next().catch((err) => {
            if (401 == err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
            } else {
            throw err;
            }
        });
        });

        app.use(jwt({ secret: 'shared-secret' }));
 
        // Protected middleware
        app.use(function(ctx){
        if (ctx.url.match(/^\/api/)) {
            ctx.body = 'protected\n';
        }
        });
 
        app.listen(3000);
        
    5.koa-helmet
    （一）用途和原理
        用来处理请求头部安全
    （二）使用：
        npm install koa-helmet --save

        const Koa = require("koa");
        const helmet = require("koa-helmet");
        const app = new Koa();
        
        app.use(helmet());
        
        app.use((ctx) => {
        ctx.body = "Hello World"
        });
        
        app.listen(4000);

    6.koa-cors
    （一）用途和原理
        由于浏览器同源策略（仅针对浏览器）会造成跨域问题，同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。koa-cors 就是用来解决跨域问题的
        原理及源码解析：
        1.set default: koa-cors 会先检查一遍传入的参数，如果传参没有设置 origin 和 methods, 参数对象 options 就会使用默认设置的的 origin:true, methods: get, post, put, head, detele.
        2.set expose: 传参 expose 字段如果是数组，转为字符串
        3.set maxAge: 传参 maxAge 如果是数字，转为字符串
        4.set methods: 传参 methods 如果有值，把值转为字符串形式
        5.set headers: 传参如果有 headers 字段，改为字符串形式
        
        6.返回一个 generator 函数 cors: 
          设置响应头部：(会根据origin 的类型先为 origin赋值)如果 origin 的值不为 false， 设置 Access-Control-Allow-Origin 为 origin 
          设置响应头部：expose 存在则设置 Access-Control-Expose-Headers 为 expose
          设置响应头部：maxAge 存在则设置 Access-Control-Max-Age 为 maxAge
          credentials 为 true 则设置 Access-Control-Allow-Credentials 为 true, 表示允许客户端携带验证信息
          Access-Control-Allow-Methods 设置为 methods
          按优先级依次获取 参数字段 headers 或者  access-control-request-headers 设置里面的值，如存在，则设置 Access-Control-Allow-Headers 为这个值

    （二）使用
        npm install koa-cors

        const Koa = require('koa');
        const app = new Koa();
        const route = require('koa-route);
        const cors = require('koa-cors);

        app.use(route.get('/', (ctx, next) => {
            this.body = { msg: 'Hello word'};
        }));

        app.listen(3000);

五：实践 -- shop 项目
    api 文件 index.js, goods.js 文件处理商城首页响应（仅作为一个例子参考，其他页面涉及数据库表的设计，与koa本身话题关系不大，暂时不处理）
