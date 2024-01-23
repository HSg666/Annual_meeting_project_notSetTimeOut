$(window).resize(function () {
  //背景调试
  if ($(window).height() / $(window).width() < 9 / 16) {
    $(".lottery-bg").css("background-size", "100% auto");
  } else {
    $(".lottery-bg").css("background-size", "auto 100%");
  }

  if ($(window).width() < $(window).height()) {
    //console.log(($(window).height()/'3')+'px')
    let horizontalPos = $(window).height() / "3.5" + "px";
    $(".lottery-tabs").css("margin", `${horizontalPos} auto`);
    $(".lottery-tabs .lottery-tabs-content .prize .people-absolute").css(
      "width",
      "100%"
    );
    $(".lottery-tabs").css("padding", "0");
    $(".lottery-tabs .lottery-tabs-content .prize .goods-name").css(
      "margin-top",
      "10%"
    );
  } else {
    let verticalPos = $(window).height() / "9" + "px";
    $(".lottery-tabs").css("margin", `${verticalPos} auto`);
  }
});

$(window).resize();

function getOs() {
  let OsObject = "";
  if (navigator.userAgent.indexOf("MSIE") > 0) {
    return "MSIE";
  }
  if ((isFirefox = navigator.userAgent.indexOf("Firefox") > 0)) {
    // $(".lottery-tabs .lottery-tabs-nav .special .add").css("top", "7px");
    $(".lottery-tabs .lottery-tabs-nav .special .subtract").css("top", "7px");
    return "Firefox";
  }
  if ((isSafari = navigator.userAgent.indexOf("Safari") > 0)) {
    return "Safari";
  }
  if ((isCamino = navigator.userAgent.indexOf("Camino") > 0)) {
    return "Camino";
  }
  if ((isMozilla = navigator.userAgent.indexOf("Gecko/") > 0)) {
    return "Gecko";
  }
}
//console.log("您的浏览器类型为:"+getOs());

let lottery = {
  //开始按钮取反
  f: false,
  //图片指针
  imgPosition: 0,
  //定时器
  timer: "",
  t: 1,
  //接收中奖者的头像路径和名称
  rewardInfo: [],
  notSelArr: [], // 未选中数组
  seletedArr: [], // 选中数组
  everySelectedArr: [], // 每次抽中的数组
  zhongjiangArr: [], // 中奖展示名单
};

//获取当前点击 li 的长度
let peopleLi,
  //获取当前点击选项卡的下标 + 1
  tabIndex,
  //获取自定义选项卡点击时候的长度，默认显示一个抽奖人员，所以默认是 1
  specialLength = 1,
  // 记录所有抽奖类型各自的次数
  lottery_one_num = 0,
  lottery_two_num = 0,
  lottery_three_num = 0,
  lottery_four_num = 0,
  lottery_five_num = 0;
lottery_six_num = 0;

(function () {
  // $(".List-winners").hide();

  /* 首先获取地址里是否有cus=1这个参数，如果有则显示自定义按钮 */
  function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
    if (r != null) return unescape(r[2]);
    return null;
  }
  let urlOid = GetQueryString("cus");
  //console.log(urlOid)
  if (urlOid == 1) {
    $(".lottery-tabs .lottery-tabs-nav .special").css("visibility", "visible");
  }

  /* 预先加载微信签到人头像和名字 */
  let signUrl = "./js/new_sign_list.json";
  // let signUrl = "./js/sign_list.json";

  $.ajax({
    url: signUrl,
    type: "GET",
    data: {},
    dataType: "json", //json or jsonp
    success: function (data) {
      // console.log(data);
      if (data) {
        // console.log(data, "data");
        /* 获取图片和名字的数据并 push 到新的空数组里 */
        $.each(data, function (index, item) {
          lottery.notSelArr.push({
            headSrc: item["h"],
            name: item["n"],
          });
        });

        // console.log(lottery.notSelArr, "lottery.notSelArr");
        //将获取到的图片预先获取出来并加载到空数组里并隐藏起来
        for (i in lottery.notSelArr) {
          $(
            `<div><img src="${lottery.notSelArr[i].headSrc}" alt=""></div>`
          ).appendTo(".reload-img");
          //console.log(data[i].n);
        }
      } else {
        console.log("暂无 signlist 数据");
      }
    },
  });
  /* 预先加载微信签到人头像和名字结束 */
})();
// 前面5个奖项还没抽完就不显示，等抽完再显示额外的惊喜奖
if (lottery.seletedArr.length <= 39) {
  $("#six_lottery").hide();
}

/* 选项卡 */
$("#lottery-tabs-nav")
  .find(".tab")
  .click(function () {
    $(this).addClass("on").siblings().removeClass("on");
    $(".lottery-tabs-content")
      .find(".prize")
      .eq($(this).index())
      .addClass("show")
      .siblings()
      .removeClass("show");

    // 获取当前点击选项卡的下标 + 1   记录奖项等级索引
    tabIndex = $(this).index() + 1;
    // console.log(tabIndex, "tabIndex");
  });
/* 选项卡结束 */

/* 定时器封装 */
function timeOut() {
  if (lottery["t"] <= 0) {
    clearTimeout(lottery["timer"]);
    //一定要return，不然下面又创建了新的定时器
    return;
  }
  //遍历当前 所有的 li 并获取下标
  for (let i = 0; i < peopleLi.length; i++) {
    $(peopleLi[i])
      .find("img")
      .attr("src", lottery.notSelArr[lottery.imgPosition]?.headSrc);
    $(peopleLi[i])
      .find("span")
      .text(lottery.notSelArr[lottery.imgPosition]?.name);
    lottery.imgPosition++;
    lottery.imgPosition =
      lottery.imgPosition > lottery.notSelArr.length - 1
        ? 0
        : lottery.imgPosition;
  }

  lottery["timer"] = setTimeout("timeOut()", 100);
}
/* 定时器封装结束 */

/* 点击开始按钮 */
let clickDraw = "./js/draw.json";

$(".lottery-btn").click(function () {
  // 如果抽奖到达所有奖项加起来的最大数，则代表抽奖完毕，弹出显示。
  if (lottery.seletedArr.length >= 44) {
    // lottery["f"] = false;
    // alert("抽奖全部结束，祝大家新年快乐，恭喜发财!");
    lottery.rewardInfo = []; // 清空用于展示每次抽中的中奖名单
    lottery.everySelectedArr = []; // 清空每次抽中的临时数组
    $(".lottery-btn p").text("开始");
    //清除定时器
    clearTimeout(lottery["timer"]);
  } else {
    //获取当前点击 li 的长度
    //console.log($(this).prev().children().children().length)
    peopleLi = $(this).prev().children().children();
    // console.log(peopleLi, "peopleLi");

    // 获取当前奖项的奖品DOM，抽奖时就隐藏，抽奖完成就显示
    lottery_prize_Element = $(this).siblings(".lottery-absolute");

    /* 获取当前点击开始按钮身上的id(每种类型的开始按钮都绑定了不同的id名称)
       判断点击的按钮的id属于哪种抽奖类型
       例如:是特等奖的按钮,如果总共抽奖的次数小于1,说明还没抽奖
              同时判断按钮的状态是否 未点击状态(lottery['f'] == true)   节流优化
                是的话当前抽奖类型的抽奖次数加1
            调用抽奖函数并将当前的人员展示列表peopleLi传入  抽完就退出当前循环
          
           次数等于1的,说明已经抽完了,那么关闭抽奖定时器,抽奖按钮文字初始为开始,同时 如果弹出 当前奖项类型已全部抽完,退出循环.  其他奖项都是如此,以此类推.
     */
    //  console.log($(this).attr("id"), "$(this)");

    switch ($(this).attr("id")) {
      case "oneBtn":
        if (lottery_one_num != 1) {
          if (lottery["f"]) {
            lottery_one_num++;
          }
          choujiang(peopleLi);
          break;
        }
        clearTimeout(lottery["timer"]);
        $(".lottery-btn p").text("开始");
        alert("特等奖已全部抽完,感谢您的参与!");

        break;
      case "twoBtn":
        if (lottery_two_num != 3) {
          if (lottery["f"]) {
            lottery_two_num++;
          }
          choujiang(peopleLi);
          break;
        }
        clearTimeout(lottery["timer"]);
        $(".lottery-btn p").text("开始");
        alert("一等奖已全部抽完,感谢您的参与!");

        break;
      case "threeBtn":
        if (lottery_three_num != 5) {
          if (lottery["f"]) {
            lottery_three_num += 5;
          }
          choujiang(peopleLi);
          break;
        }
        clearTimeout(lottery["timer"]);
        $(".lottery-btn p").text("开始");
        alert("二等奖已全部抽完,感谢您的参与!");

        break;
      case "fourBtn":
        if (lottery_four_num != 10) {
          if (lottery["f"]) {
            lottery_four_num += 5;
          }
          choujiang(peopleLi);
          break;
        }
        clearTimeout(lottery["timer"]);
        $(".lottery-btn p").text("开始");
        alert("三等奖已全部抽完,感谢您的参与!");

        break;
      case "fiveBtn":
        if (lottery_five_num != 20) {
          if (lottery["f"]) {
            lottery_five_num += 5;
          }
          choujiang(peopleLi);
          break;
        }
        clearTimeout(lottery["timer"]);
        $(".lottery-btn p").text("开始");
        alert("幸运奖已全部抽完,感谢您的参与!");

        break;
      case "sixBtn":
        if (lottery_six_num != 5) {
          if (lottery["f"]) {
            lottery_six_num += 5;
          }
          choujiang(peopleLi);
          break;
        }
        clearTimeout(lottery["timer"]);
        $(".lottery-btn p").text("开始");
        alert("惊喜奖已全部抽完,感谢您的参与!");

        break;
    }
    // console.log(lottery_one_num, "lottery_one_num");
    // console.log(lottery_two_num, "lottery_two_num");
    // console.log(lottery_three_num, "lottery_three_num");
    // console.log(lottery_four_num, "lottery_four_num");
    // console.log(lottery_five_num, "lottery_five_num");
  }
});
/* 点击开始按钮结束 */

// 抽奖函数 start
/*
  params  
      peopleLi：抽奖名单
*/
function choujiang(peopleLi) {
  // console.log(1, "来了");

  if ((lottery["f"] = !lottery["f"])) {
    //每次点击之前先清空数组
    lottery.rewardInfo = [];
    lottery.everySelectedArr = [];
    $(".lottery-btn p").text("停止");
    //激活定时器
    timeOut();

    // 未选数组有值才走逻辑，防止页面预加载时找不到数据报错
    if (lottery.notSelArr) {
      lottery.rewardInfo = [];
      lottery.everySelectedArr = [];
      /* 
    总共44个名额，满了就无法继续抽奖
      特等奖1，每次1个，1次。
      一等奖2，每次1个、3次。
      二等奖3，每次5个，1次。
      三等奖4，每次5个，2次。
      幸运奖5，每次5个，4次。
      惊喜奖6，每次5个，1次。
    */
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
      // 将需要的参数（未选中的数组、抽奖类型、每次抽几个、总共抽几次）传入获取中奖名单数组和未中奖数组
      let selectedObjects = randomlySelectObjects(
        lottery.notSelArr,
        lotteryType,
        everyDrawNum,
        totalNum
      );
      // console.log(selectedObjects, "selectedObjects");
      // 将每次抽中的名单放进中奖数组中
      selectedObjects[0].forEach((item) => {
        lottery.seletedArr.push(item);
      });

      // 将每次抽中的存入 临时抽中数组，用于页面展示中奖名单
      lottery.everySelectedArr = selectedObjects[0];
      // 取出未选中的数组赋值给初始数组,用于下次抽奖使用
      lottery.notSelArr = selectedObjects[1];
      // 将每次选中的名单转化为页面展示数组的格式
      lottery.everySelectedArr.forEach((val) => {
        lottery.rewardInfo.push({
          rewardSrc: val["headSrc"],
          rewardName: val["name"],
        });
      });

      if (lottery.seletedArr.length === 39) {
        $("#six_lottery").show();
      }
      // console.log(lottery.rewardInfo, "lottery.rewardInfo");
      // console.log(lottery.everySelectedArr, "lottery.everySelectedArr");

      //   console.log(selectedObjects, "选中的数组");

      // console.log(lottery.seletedArr, "选中的数组");
      // console.log(lottery.notSelArr, "未选的数组");
    }
  } else {
    $(".lottery-btn p").text("开始");
    //清除定时器
    clearTimeout(lottery["timer"]);

    if (lottery.rewardInfo.length) {
      //如果 lottery.rewardInfo 里有数据的话，则。。。
      //点击停止，将接收到的中奖者头像和名字，渲染到页面上
      for (i in lottery.rewardInfo) {
        //1. 遍历获取到的中奖者头像和名字
        //console.log(lottery.rewardInfo[i]);
        //console.log(lottery.rewardInfo[i].rewardSrc);
        for (let j = 0; j < peopleLi.length; j++) {
          //2. 遍历当前奖品等级有几个抽奖人员参加

          //将 1 和 2  一一对应渲染到页面上，并且判断，如果 lottery.rewardInfo 里剩余的数据小于当前 li 的长度了，则把剩下的用 问号 显示
          $(peopleLi[j])
            .find("img")
            .attr(
              "src",
              lottery.rewardInfo[j]
                ? lottery.rewardInfo[j].rewardSrc
                : "images/question.png"
            );
          $(peopleLi[j])
            .find("span")
            .text(
              lottery.rewardInfo[j] ? lottery.rewardInfo[j].rewardName : ""
            );
        }
      }
    } else {
      //没数据的话则直接显示问号头像
      $(peopleLi).find("img").attr("src", "images/question.png");
      $(peopleLi).find("span").text("");
    }
  }
}
// 抽奖函数 end

// 根据选项卡的索引随机抽取幸运观众
/* 
  params
    arr: 未选数组
    num: 抽奖类型  1=特等奖，2=一等奖，3=二等奖，4=三等奖，5=幸运奖
    lotteryType: 抽奖类型
    everyDrawNum: 每次抽几个
    totalNum: 当前抽奖类型总共抽几次
  return 
      选中的数组,未选的数组
    */
function randomlySelectObjects(arr, lotteryType, everyDrawNum, totalNum) {
  let len = arr.length;
  let selected = []; // 选中的数组
  let notSelArr = []; // 未选的数组
  //   console.log(everyDrawNum, "everyDrawNum");
  // 选中的数组
  while (selected.length < everyDrawNum && arr.length > 0) {
    let randomIndex = Math.floor(Math.random() * len);

    if (!selected.includes(arr[randomIndex])) {
      // 中奖等级标识 1=特等奖，2=一等奖，3=二等奖，4=三等奖，5=幸运奖，6=惊喜奖
      arr[randomIndex]["tag"] = lotteryType;
      selected.push(arr[randomIndex]);
    }
  }

  // 从选中的数组中找到与原始数组不一致的元素 插入到新未选数组中
  arr.forEach((item) => {
    if (!selected.includes(item)) {
      notSelArr.push(item);
    }
  });
  //   console.log(selected, "selected");

  return [selected, notSelArr];
}

// 将选中的数据格式化一下为二维数组，此数组给中奖名单的动态生成DOM用的

/*
  tag是当前奖项的标识
  转化前：[
          { headSrc: '图片链接', name: '赵云', tag: 1 },
          { headSrc: '图片链接', name: '李白', tag: 2 },
          { headSrc: '图片链接', name: '白起', tag: 1 },
          ...
        ]
   同种奖项的对象存到同个二维数组中
  转化后：[
          [ 
             { headSrc: '图片链接', name: '赵云', tag: 1 },
            { headSrc: '图片链接', name: '白起', tag: 1 },
            ...
          ]
          [ 
            { headSrc: '图片链接', name: '李白', tag: 2 },
            ...
          ]
        ]
  最后将整个一维数组中的二维数组做从小到大排序，结果就是特等奖、一等奖、... ，根据tag排的
*/

function formatData(testList) {
  console.log(testList, "testList");
  let result = [];

  testList.forEach((item) => {
    let existingTagArray = result.find((arr) => arr[0].tag === item.tag);
    if (existingTagArray) {
      if (!existingTagArray.some((obj) => obj.name === item.name)) {
        existingTagArray.push(item);
      }
    } else {
      result.push([item]);
    }
  });

  return result.sort((a, b) => a[0].tag - b[0].tag);
}

// 将中奖名单数据动态展示到页面上
/*  
      逻辑说明：
          1、先在中奖名单一维数组循环外层创建一个存放所有奖项的大盒子(.lottery-content)，用于给内部每个奖项盒子(.lottery-level-outer)插入
              二维数组循环外层创建一个存放奖项的盒子(.lottery-level-outer)
          2、同时它的两个子级div，奖项的标题名称(.lottery-level-header)和存放此奖项中奖人员的盒子(.lottery-level-main)，并为它设置上单独的data-key值
              data-key提示：这个值非常重要，自从为每个.lottery-level-main添加上唯一的data-key，一维数组遍历插入时就不会重复插入的，
              只要是同个data-key的盒子不会再次插入到存放所有奖项的大盒子中，就不会出现一种奖项在页面出现多次。
          3、每个奖项标题都有当前奖项抽几个了(item.length)，总数是多少(lotteryTotal)。  lotteryTotal的值在一维数组遍历时就用if语句对各选项的总数进行判定了。
          4、存放此奖项中奖人员的盒子(.lottery-level-main)加个判断
              如果一维数组中的某个数组的第0个索引的tag==1，特等奖的则添加额外的水平垂直居中样式(.lottery-special-level),因为特等奖的人员要展示到中间。
          5、为了让每个奖项盒子(.lottery-level-outer)中保留一个奖项标题(.lottery-level-header)和该奖项存放中奖人员盒子(.lottery-level-main),所以插入前需要做判断：
            查找刚刚创建的存放内部每个奖项盒子(.lottery-level-outer)中是否已经存在奖项标题和存放奖项盒子，如果不存在就单独将它们插入到当前奖项的大盒子(.lottery-level-outer)
              效果是这样的：<div class="lottery-level-outer">
                            <div class="lottery-level-header"></div> 
                            <div class="lottery-level-main"></div> 
                          </div>
          6、外层盒子做好了，就差中奖人员了，接下来就创建这个了。
          二维数组循环中创建一个中奖人员div(.lottery-level-main-item),如果二维数组中的tag==2代表是一等奖，就为这个div添加额外的样式(.lottery-one-level)三个名额平分居中,其他的item不需要
            每个人员名称就是二维数组中每个人员元素的名称，同时为他们设置单独的key值，就是data-name,使它们在遍历时保持唯一性。
          7、二维数组每遍历一次，就将中奖人员div插入到当前奖项的.lottery-level-main中
          8、二维数组外层将每个装满奖项数据的div(.lottery-level-outer) 插入到存放所有奖项的大盒子(.lottery-content)
          9、一维数组外层将整个存放所有奖项的大盒子(.lottery-content)插入到它的父级元素.content大盒子中，也就是中奖名单的内容区大盒子，至此完毕。

          这个地方的动态增删改DOM操作差点把我写哭，还好我有vue2的遍历绑定key思想。最后才整出来了。 
          由于不是像vue那样标签中v-for就OK，那是vue底层帮我们做好了，而这个是要自己手写的。
        */

function getLotteryList() {
  if (zhongjiangArr.length) {
    // 先删除中奖名单大盒子,让页面只保留一个大盒子,重新创建一个新的
    $("div.lottery-content").remove();
    var lotteryContent = $("<div>").addClass("lottery-content");
    zhongjiangArr.forEach(function (item, i) {
      if (item[0].tag >= 1 && item[0].tag <= 6) {
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

        // 每种奖项级别都创建一个外层盒子并设置独立的key,key为它们的tag,即奖项类型
        var outer = $("<div>")
          .addClass("lottery-level-outer")
          .attr("data-key", item[0].tag);
        var lottery_level_header = $("<div>")
          .addClass("lottery-level-header")
          .text(headerContent + "(" + item.length + "/" + lotteryTotal + ")"); // 奖项标题  item.length每次抽中的数量, 当前奖项的中奖总数
        var lottery_level_main = $("<div>")
          .addClass("lottery-level-main")
          .addClass(function () {
            if (item[0].tag == 1) {
              return "lottery-special-level";
            } else {
              return ""; // 不添加其他class
            }
          }); // 中奖人员盒子
        // 使用 data-key 属性值查找当前.lottery-level-outer下是否存在.lottery-level-header div,不存在就插入一个.
        // 让每个.lottery-level-outer中只保留一个奖项标题和中奖人员盒子
        var headerExists = outer.find(".lottery-level-header").length > 0;
        var mainExists = outer.find(".lottery-level-main").length > 0;

        if (!headerExists) {
          outer.append(lottery_level_header);
        }
        if (!mainExists) {
          outer.append(lottery_level_main);
        }

        // 遍历二维数组
        $.each(item, function (i2, item2) {
          // 新建一个lottery_level_item(中奖人员) div,每次都插入到lottery_level_main(中奖人员盒子)中
          // 如果抽奖类型为2,也就是一等奖,则每个item添加额外的样式
          var lottery_level_item = $("<div>")
            .addClass("lottery-level-main-item")
            .addClass(function () {
              if (item[0].tag == 2) {
                return "lottery-one-level";
              } else {
                return "";
              }
            })
            .text(item2.name)
            .attr("data-name", item2.name); // 中奖人员item

          lottery_level_main.append(lottery_level_item);
        });
        // 每次一层循环完就插入一种奖项类型的大盒子
        lotteryContent.append(outer);
      }
    });
    $(".content").append(lotteryContent);
  }
}

// 中奖名单图层蒙版 start
$("#showListBtn").click(function () {
  $(".overlay").show();
  zhongjiangArr = formatData(lottery.seletedArr);
  // console.log(zhongjiangArr, "zhongjiangArr");
  getLotteryList();
});

$(".close-btn").click(function () {
  $(".overlay").hide();
});
// 中奖名单图层蒙版 end

/* 双击标题全屏显示结束 */
//控制全屏
function enterfullscreen() {
  //进入全屏
  let docElm = document.documentElement;
  //W3C
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  }
  //FireFox
  else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  }
  //Chrome等
  else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  }
  //IE11
  else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function exitfullscreen() {
  //退出全屏
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
let a = 0;

// 如果需要点击标题就全屏展示的话，就解开下面代码的注释即可。
$(".lottery-title").on("click", function () {
  a++;
  a % 2 == 1 ? enterfullscreen() : exitfullscreen();
});
/* 双击标题全屏显示结束 */
