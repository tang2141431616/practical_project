

/* 点击跳转到详细页面模块 开始*/

function jumpDatail (element) {
   element.addEventListener('click', e => {
      let target;
      // 判断是否点击的是 A标签 是就赋值 
      // 反之 就只有两种情况 点击的不是img就是span 所有直接赋值标签父级
      if (e.target.tagName === 'A') {
         target = e.target;
      } else {
         target = e.target.parentElement;
      }
      // 跳转至详细页面
      location.href = `public/datail.html?key=${target.dataset.key}&index=${target.dataset.id}`;
   })
}
/* 点击跳转到详细页面模块 结束*/

/* 侧边栏列表 模块 开始*/

const homeSideLi = document.querySelectorAll('.home_side ul li');
const sideListBox = document.querySelector('.side_list');

// 侧边栏显示函数
function showSideList () {
   sideListBox.classList.remove('hide');
}

// 侧边栏隐藏函数
function hideSideList () {
   // 判断是否有计时器 有就 清除
   sideListBox.classList.add('hide');
}
// 循环注册事件
for (let i = 0; i < homeSideLi.length; i++) {
   // 鼠标移入侧边栏就 渲染数据 并显示列表
   homeSideLi[i].addEventListener('mouseenter', function (ev) {
      // 显示列表
      showSideList();

      // 处理数据
      // 获取导航内容字符串按空格分割成数组
      const sideNameArr = this.children[0].innerText.split(' ');
      // 用于存放数据
      let arr = [];

      // 筛选符合条件的数据
      goodsList.forEach(element => {
         const goodsName = element.uname;

         // 筛选和 用逻辑与 判断导航名称字符串 是否包含在列表名称 就加入数组
         sideNameArr.filter(item => goodsName.includes(item, 0) && arr.push(element));
      })
      // 清除旧数据
      sideListBox.innerHTML = '';

      // 处理数据
      arr.map((item, index) => {
         // 创建ul
         const ul = document.createElement('ul');
         ul.classList.add(`item_col_${index + 1}`);
         let str = '';
         // 遍历处理 小li
         item.dataList.forEach((element, i) => {
            // 只允许渲染6个
            if (i >= 6) return;
            str += `
            <li>
               <a class="ellipsis" data-key="${item.uname}" data-id="${i}" href="javascript:;">
                  <img src="${element.picture}">
                  <span>${element.title}</span>
               </a>
            </li>`

         });
         // 将li加入ul
         ul.innerHTML = str;
         // 追加到页面
         sideListBox.appendChild(ul);
      })

   })

   // 鼠标离开侧边栏 隐藏列表
   homeSideLi[i].addEventListener('mouseleave', hideSideList);
   // 鼠标移入侧边栏box 列表显示
   sideListBox.addEventListener('mouseenter', showSideList);
   // 鼠标离开侧边栏box 列表隐藏
   sideListBox.addEventListener('mouseleave', hideSideList);

}

jumpDatail(sideListBox);

/* 侧边栏列表 模块 结束*/


/* 轮播图模块 开启*/

// 渲染指示灯
let pagination = document.querySelector('.pagination');
pagination.innerHTML = bannerList.map((item, index) => {
   // 第一个指示灯 添加 action类名
   return `<span data-index="${index}" class="col-${index + 1} ${index === 0 ? `action` : ''} "></span>`
}).join('');
// 第一个指示灯 修改背景
document.querySelector('.pagination span.action').style.backgroundColor = bannerList[0].color;

// 渲染轮播图
document.querySelector('.swiper_item a').innerHTML = bannerList.map((item, index) => {
   return `<img src="${item.picture}" class="${index === 0 ? `action` : ''}" alt="">`
}).join('');

// 轮播操作
function banner (index) {
   const { color } = bannerList[index];
   // 操作轮播图

   // 排他操作 其他的移除action 当前添加 action
   document.querySelector('.swiper_item img.action').classList.remove('action');
   document.querySelector(`.swiper_item img:nth-child(${index + 1})`).classList.add('action');

   // 获取当前指示灯元素 +1 是因为 伪类选择器是从1开始的
   const span = document.querySelector(`.pagination span:nth-child(${index + 1})`);

   // 操作指示灯
   // 排他操作 当前加action
   document.querySelector('.pagination span.action').classList.remove('action');
   span.classList.add('action');

   // 修改当前指示灯背景
   // 排他操作 清除所有背景 添加当前背景
   document.querySelectorAll('.pagination span[style]').forEach(item => item.style = '');
   span.style.backgroundColor = color;
}

// 定时器 多少秒 切换一次
let i = 0;
let timerId = 0;
function swiperTimer () {
   timerId = setInterval(() => {
      banner(i);
      i++;
      // 当 i长度大于等于 图片数量时 i归零
      if (i >= bannerList.length) i = 0;
   }, 2000);
}
//
swiperTimer();
const swiperBox = document.querySelector('.swiper_container');

// 节流 throttle函数 
function throttle (fn, t, flag) {
   // 起始时间
   let startTime = 0;
   let i = 0;
   return function () {
      // 当前最新的时间戳
      const now = Date.now();
      // console.log(now - startTime)

      // 当前时间 - 起始时间 = 过去的时间 是否大于等于 t 就调用函数
      if (now - startTime >= t) {
         // 调用函数
         fn(i);
         // 根据 flag 值来判断是 前进还是后退
         if (flag) {
            i++;
            // 当 i长度大于等于 图片数量时 i归零
            if (i >= bannerList.length) i = 0;
         } else {
            // 当 i长度等于0  i为图片数量长度
            if (i <= 0) i = bannerList.length;
            i--;
         }
         // 当前时间赋值给 起始时间 就开启下一轮
         startTime = now;
      }
      console.log(now - startTime)



   }
}

// 点击指示信号 切换图片 
document.querySelector('.pagination').addEventListener('click', e => {
   const { tagName, dataset } = e.target;
   if (tagName === 'SPAN') {
      // 转换成数字类型 传入函数
      banner(+dataset.index);
   }
})

// 鼠标移入大盒子 就停止计时器 并进行操作
swiperBox.addEventListener('mouseenter', () => {
   // 停止计时器 
   clearInterval(timerId);
   document.querySelector('.swiper_next').addEventListener('click', throttle(banner, 500, true));
   document.querySelector('.swiper_prev').addEventListener('click', throttle(banner, 500, false));

});

// 鼠标离开大盒子 就启动计时器；
swiperBox.addEventListener('mouseleave', swiperTimer);

/* 轮播图模块 结束*/

/* 工具栏模块 开始*/
// 检测页面滚动
window.addEventListener('scroll', function () {
   // 页面滚去数值
   document.documentElement.scrollTop
   // 获取元素
   const homeMain = document.querySelector('.home_main');
   // 判断页面滚动数值 是否大于等于 主体模块的位置 就显示回顶部 反之隐藏
   if (document.documentElement.scrollTop >= homeMain.offsetTop) {
      document.querySelector('.tools_bar .back_top').classList.remove('hide');
      document.querySelector('.tools_bar').style.transform = "translateY(-100px)"
   } else {
      document.querySelector('.tools_bar .back_top').classList.add('hide');
      document.querySelector('.tools_bar').style.transform = '';
   }
});

// 点击返回顶部
document.querySelector('.tools_bar .back_top').addEventListener('click', () => {
   document.documentElement.scrollTop = '';
})

/* 工具栏模块 结束*/

/* 主体商品渲染模块 开始 */

//首位商品区域
const brickItemUl = document.querySelector('.homne_plain_box .brick_item ul');
// 渲染侧边图
const brickPromo = document.querySelector('.homne_plain_box .brick_promo li a');
brickPromo.innerHTML = goodsList[0].promoPicure.map(item => {
   return `<img src="${item}" alt="图片">`;
}).join('');

// 渲染商品图
brickItemUl.innerHTML = goodsList[0].dataList.map((item, index) => {
   return `
      <li class="item-col-${index + 1}">
         <a href="javascript:;">
            <div class="image">
               <img src="${item.picture}" alt="">
            </div>
            <h3 class="title">${item.title}</h3>
            <p class="desc ellipsis">${item.desc}</p>
            <p class="price">${item.pirce}元起</p>
         </a>
      </li>
   `
}).join('')

// tab 切换图切换

// 商品tab切换渲染函数
function goodsTabRender (element, str) {
   const brickPromoA = element.querySelector('.brick_promo a');
   const brickItem = element.querySelector('.brick_item');
   // 筛选数据列表名称是否包含在str中
   const data = goodsList.filter(item => str.includes(item.uname, 0));
   data.map((element, i) => {
      // 渲染侧边大图
      brickPromoA.innerHTML = `<img src="${element.promoPicure}" alt="">`;

      // 处理每一个ul的小li
      let li = '';
      element.dataList.forEach((item, index) => {
         // 判断是否是最后一个
         if (index === element.dataList.length - 1) {
            li += `
               <li>
                  <div class="item_box">
                     <div class="text">
                        <h3>${item.title}</h3>
                        <div class="price">${item.pirce}元起</div>
                     </div>
                     <div class="image">
                        <img src="${item.picture}" alt="">
                     </div>
                  </div>
                  <div class="more_box">
                     <a href="javascript:;">
                        <div class="more">
                           浏览更多
                           <em>${element.uname}</em>
                        </div>
                        <div class="right">
                           <i class="iconfont iconfont-circle-arrow-right"></i>
                        </div>
                     </a>
                  </div>
               </li>
               `;
         } else {
            li += `
            <li>
               <a href="javascript:;">
                  <div class="image">
                     <img src="${item.picture}" alt="">
                  </div>
                  <h3 class=" title">${item.title}</h3>
                  <p class="desc">${item.desc}</p>
                  <p class="price">${item.pirce}</p>
               </a>
            </li>
            `
         }

      });
      // 将第一个小li 添加到 ul中
      const ul = document.createElement('ul');
      ul.innerHTML = li;
      // 第一个ul添加action
      if (i === 0) ul.classList.add('action')
      brickItem.appendChild(ul);


   })
}
// tab栏切换函数
function TbaBox (element, index) {
   // 进行转数字型并 + 1
   index = +index + 1;
   // 1.操作小盒子
   // 排他 去除其他的 action
   element.querySelector('.tab_list li.action').classList.remove('action');
   // 添加当前盒子action
   element.querySelector(`.tab_list li:nth-child(${index})`).classList.add('action')

   // 2.操作大盒子

   // 排他 去除其他的 action
   element.querySelector('.brick_item ul.action').classList.remove('action');
   // 添加当前盒子action
   element.querySelector(`.brick_item ul:nth-child(${index})`).classList.add('action');
}


/* 主体商品渲染模块 结束 */


/* 智能穿戴 */
// 渲染数据
const homeTbaBox1 = document.querySelectorAll('.tab_box')[0];
goodsTabRender(homeTbaBox1, '耳机 穿戴');



// tab栏切换 事件注册
homeTbaBox1.querySelector('.tab_list').addEventListener('mouseover', e => {
   const { tagName, dataset } = e.target;
   if (tagName === 'LI') TbaBox(homeTbaBox1, dataset.id);
})

/* 笔记本 平板模块 */

// 渲染数据
const homeTbaBox2 = document.querySelectorAll('.tab_box')[1];
goodsTabRender(homeTbaBox2, '笔记本 平板');

// tab栏切换 事件注册
homeTbaBox2.querySelector('.tab_list').addEventListener('mouseover', e => {
   const { tagName, dataset } = e.target;
   if (tagName === 'LI') TbaBox(homeTbaBox2, dataset.id);
});







