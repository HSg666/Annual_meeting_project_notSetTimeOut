# Annual_meeting_project_notSetTimeOut

## 项目介绍：这是手动点击停止抽奖，没有倒计时的，多一个惊喜奖项目

## 技术栈

HTML5 + CSS3 + JS、ES6+ + jQuery + flexible(rem 自适应)

## 开发工具

1、需要安装一个 VSCode

2、在 VSCode 装个插件 Live Server

## 浏览器

推荐用谷歌

## 启动

进入 index.html，鼠标右键选择 Open in Live Server 启动项目。

## 项目预览

### 1、抽奖页

![](../\Annual_meeting_project_notSetTimeOut\images\PrePictur\页面展示.png)

### 2、中奖名单弹框

![](../\Annual_meeting_project_notSetTimeOut\images\PrePictur\中奖名单弹框.png)

## 项目说明

### 1、这个项目有什么？

- 每种奖项都是一个独立的大盒子，与其他奖项盒子没有关系的。而且当前奖项 如果到达抽奖次数最大时，当前奖项就无法再次抽奖。
- 每次抽完奖都可以点击"中奖名单"查看中奖人员，但是一般来说都是所有奖项的次数抽完之后才查看"中奖名单"的。
- 每个奖项抽完奖都会显示中奖人员，而且各个奖项的开始按钮都是独立的，不是多个奖项共用同一个的按钮，这点放心。
- 代码抽奖规则是：首次将所有人员加入到未选数组中，每次随机生成一个索引，用此索引在未选中找到对应索引的人员；抽中的人从未选数组中删除，同时将抽中的人员插入到一个选中数组中；下一轮抽奖将未选数组作为抽奖数组，还是随机生成一个索引，跟第一次描述的规则一样。往后抽奖都是如此。
- 惊喜奖是前面 5 个奖项全部抽完后才会显示，默认是隐藏的。
- 可以指定某个人在某个奖项必中奖，但其实越是懂这个规则的人越应该要坚守原则。无论奖品"低劣"或"贵重"都要秉持：君子求财，取之有道。道在哪呢？道可以在屎溺中，道也可以在抽奖中。

### 2、例如我的抽奖规则是这样的

> 总共 44 个名额，满了就无法继续抽奖

      特等奖1，每次1个，1次。
      一等奖2，每次1个、3次。
      二等奖3，每次5个，1次。
      三等奖4，每次5个，2次。
      幸运奖5，每次5个，4次。
      惊喜奖6，每次5个，1次。

#### 1、HTML

由于每种奖项都是独立一个 div 包裹的，所以各奖项需要展示几个中奖头像就自己增/删，例如：特等奖只有一个，代码如下：

index.html

```html
<!-- 特等奖 -->
<div class="first-prize prize">
  <div class="lottery-absolute">特等奖：虎牌电饭煲</div>
  <div class="lottery-absolute-timerout"></div>
  <!-- <h2 class="goods-name">特等奖：小米旗舰手机MIX3</h2> -->
  <div class="people-absolute">
    <ul class="people-ul">
      <!-- 看这里！！！   一个就写一个li，中奖图片是动态插入渲染的 -->
      <li class="people-li first-crown">
        <img src="images/question.png" alt="" />
        <span class="people-name"></span>
      </li>
    </ul>
  </div>
  <!-- 点击开始按钮 -->
  <div class="lottery-btn" id="oneBtn">
    <p>开始</p>
  </div>
  <!-- 点击开始按钮结束 -->
</div>
```

#### 2、JS

js/index.js

1、首页：根据你的抽奖规则进行修改

```js
function choujiang(peopleLi) {
  let lotteryType = 0; // 抽奖类型
  let everyDrawNum = 0; // 每次抽几个
  let totalNum = 0; // 当前抽奖类型总共抽几次
  switch (tabIndex) {
    case 1:
      lotteryType = 1;
      everyDrawNum = 1;
      totalNum = 1;
      break;
    case 2:
      lotteryType = 2;
      everyDrawNum = 1;
      totalNum = 1;
      break;
    case 3:
      lotteryType = 3;
      everyDrawNum = 5;
      totalNum = 1;
      break;
    case 4:
      lotteryType = 4;
      everyDrawNum = 5;
      totalNum = 2;
      break;
    case 5:
      lotteryType = 5;
      everyDrawNum = 5;
      totalNum = 4;
      break;
    case 6:
      lotteryType = 6;
      everyDrawNum = 5;
      totalNum = 1;
      break;
  }
}
```

2、首页：开始抽奖按钮根据你的需求修改各奖项的每次抽几个，总共次数

```js

$(".lottery-btn"){
   switch ($(this).attr("id")) {
      case "oneBtn":
        if (lottery_one_num != 1) {
          if (lottery["f"]) {
            lottery_one_num++;  // 例如: 特等奖每次只抽一个，就自增1
          }
          choujiang(peopleLi);
          break;
        }
        clearTimeout(lottery["timer"]);
        $(".lottery-btn p").text("开始");
        alert("特等奖已全部抽完,感谢您的参与!");
        break;
      case "fourBtn":
        if (lottery_four_num != 10) {
          if (lottery["f"]) {
            lottery_four_num+=5;  // 例如: 特等奖每次抽5个，就自增5
          }
          choujiang(peopleLi);
          break;
        }
        clearTimeout(lottery["timer"]);
        $(".lottery-btn p").text("开始");
        alert("三等奖已全部抽完,感谢您的参与!");
        break;
   }
}
```

3、设置所有奖项的次数加起来的总数，用于如果所有奖项都抽完就弹框提示用户已抽完

```js
$(".lottery-btn").click(function () {
    if (lottery.seletedArr.length >= 39) // 根据你的需求更改这个数字
}
```

4、 中奖名单弹框：根据奖项类型生成对应奖项的标题和当前奖项的总数，用于给中奖名单的各项标题展示用

例如: 三等奖 5/10 当前三等奖只抽了 1 次 5 个，总数为 10 个。

> tag = 1 特等奖
> tag = 2 一等奖
> tag = 3 二等奖
> tag = 4 三等奖
> tag = 5 幸运奖
> tag = 6 惊喜奖

```js
function getLotteryList() {

  if (item[0].tag >= 1 && item[0].tag <= 5) {
        let headerContent = ""; // 标题
        let lotteryTotal = 0; // 每种奖项的总数
        if (item[0].tag === 1) {
          headerContent = "特等奖";
          lotteryTotal = 1;
        } else if (item[0].tag === 2) {
          headerContent = "一等奖";
          lotteryTotal = 3;
        } else if (item[0].tag === 3) {
          headerContent = "二等奖";
          lotteryTotal = 5;
        } else if (item[0].tag === 4) {
          headerContent = "三等奖";
          lotteryTotal = 10;
        } else if (item[0].tag === 5) {
          headerContent = "幸运奖";
          lotteryTotal = 20;
        } else if (item[0].tag === 6) {
          headerContent = "惊喜奖";
          lotteryTotal = 5;
        }
}
```

5、其他代码数据格式不知道是什么样子的就自己打印查看，很多 js 代码逻辑都有注释的。

### 2、如何在特殊的分辨率下让页面布局能正常展示，不受影响？

看你的需求，例如：我的是 1792 × 512，就用将媒体查询编写

```css
@media screen and (max-width: 1800px) and (max-height: 520px) {
}
```

### 3、如何添加人员

1、将新增人员的图片放置 images/userlist 中，用真实姓名

2、在 new_sign_list.json 中新增一个对象，指定图片路径。

3、oIj9xuMaiow_MdhtHvCJ7N7BS2bI 这个值要求唯一的，如果已经用过的就去 sign_list.json 中找一个你未用到的复制拿来用。

```json
  "oIj9xuMaiow_MdhtHvCJ7N7BS2bI": {
    "h": "/images/userList/赵云.jpg",
    "n": "赵云"
  }
```

### 如果需要点击"幸运大抽奖"标题时页面就全屏展示的话，就解开 js/index.js 这段代码的注释即可。

```js
$(".lottery-title").on("click", function () {
  a++;
  a % 2 == 1 ? enterfullscreen() : exitfullscreen();
});
```

### 抽奖过程人员图片有点卡顿，甚至有点停滞，怎么办？

1、按 F12 -> 检查 -> 网络/Network，将停用缓存取消勾选。

2、如果第 1 点照做了还是卡顿，你的电脑配置太低。

## 注意事项

1、页面数据：为了提前预加载数据，用户列表是通过 jQuery 请求获取 js/sign_list.json。

2、抽奖名单：抽奖完毕后打开"中奖名单"记得将名单截图保存到电脑，因为刷新页面后中奖名单数据就清空了。

## 找问题推荐用百度的免费 AI 工具

不需要 api-key，没有次数限制，可无限使用。比如：生成代码，解释代码，生活的疑难杂症等 😄。

## 此项目是根据 gitee 上这位兄弟的项目进行二次开发的，项目地址如下：

https://gitee.com/MapleStory712/draw_2018?_from=gitee_search

## 两个项目的异同点：

- Annual_meeting_project_hasSetTimeOut：

1、有抽奖倒计时定时器,没有手动点击停止

2、没有惊喜奖

3、README.md 多一个自定义配置抽奖定时器说明

- Annual_meeting_project_notSetTimeOut：

1、没有自定义抽奖倒计时定时器，需要手动点击开始/停止

2、多一个惊喜奖，项目总共 6 个奖项，只有前面 5 个奖项的抽奖次数全部抽完它才会展示出来，毕竟是惊喜。

其他说明两文档基本都是一样的。

## 为什么两个项目不写成一个呢

刚开始领导要的是倒计时的，后来说要那种出其不意、一声令下就停止的，所以就把原本的逻辑改了。为了防止他后面又要改回倒计时的版本，就拆成两个单独的项目。毕竟倒计时的代码多一些，逻辑复杂些。

两个项目开发用时 5 天，一人。时间紧就没弄后端服务器数据库啥的。

## 投屏

HDMI 投屏步骤：

1、准备一根 HDMI 线缆，你的笔记本和显示屏或者是另一台电脑，用这根线连接

2、你的笔记本：

以 Win10 为例

按 Win+P 点击复制，投屏到酒店大视频

## 后言

呕心沥血写的文档，已经写得很明白了，如果还是不懂的，花点时间边看文档边尝试以及研究代码，部分代码不懂的就复制去问 Chatgpt。我克隆人家开源的项目下来也是得读代码，就这样，希望这个项目刚好满足你的需求 😊。

如果觉得项目还不错的记得点个Star ☆哈，感谢。

Author：HoushoLin

Date：2024/01/19

博客地址：https://blog.csdn.net/Steven_Son
