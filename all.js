
//輸入待辦欄
const txt = document.querySelector(".txt");
//輸入待辦送出鍵
const save = document.querySelector(".btn_add");
//待辦清單 ul 
const list = document.querySelector(".list");
//計算待辦數+清除已完成鍵
const listFooter = document.querySelector(".list_footer");
//全部、待完成、已完成tab
const tab = document.querySelector(".tab");


// 初始化: renderData 函式
// let data =[
//   // {
//   //   content: "待辦事項"
//   // }
// ];

//localStorage: 從瀏覽器讀取之前存的資料，沒有的話就用空陣列
let data = JSON.parse(localStorage.getItem("todoData")) || [];

let tabState = `全部`;

function renderData(){
  let str =``
  data.forEach(function(item,index){
    //依照目前分頁，跳過不用顯示的項目
    if(tabState == "待完成" && item.checked == true){
      return;
    }
    if (tabState == "已完成" && item.checked == false) {
      return;
    }

    //判斷 checkbox 的狀態
    let checkedText = "";
    if (item.checked) {
      checkedText = "checked";
    } else {
      checkedText = "";
    }

    str+=`<li>
          <label class="checkbox">
            <input type="checkbox" data-num="${index}" ${checkedText} />
            <span>${item.content}</span>
          </label>
          <a href="#" class="delete" data-num="${index}"></a>
        </li>`
  })

  list.innerHTML = str;

  //數出未完成待辦事項數目
  const undone = data.filter(function(item){
    return item.checked == false;
  });

  listFooter.innerHTML = `<p>${undone.length}個待完成項目</p>
  <a href="#" class="clear">清除已完成項目</a>`

 ////每次畫面更新，就把最新的資料存進瀏覽器
  localStorage.setItem("todoData", JSON.stringify(data));
}


//新增待辦事項
function addTodo(){
  if(txt.value.trim() == ``){
    alert("請輸入待辦事項");
    return;
  }
  let obj = {};
  obj.content = txt.value;
  obj.checked = false;
  data.push(obj);
  txt.value = ``;
  renderData();
}

save.addEventListener("click",function(e){
  e.preventDefault();
  addTodo();
})

txt.addEventListener("keydown",function(e){
  if (e.key === "Enter" && !e.isComposing) {
    addTodo();
  }
})


//刪除待辦事項: 
// 1. 在renderData函式加上index參數 
// 2. 監聽 .list 若點擊到 delete，則取出索引值並 splice。
// 3. 若是點擊到 checkbox，則狀態顯示為 checked
list.addEventListener("click", function(e){
  const num = e.target.getAttribute("data-num");

  if (e.target.getAttribute("class") === "delete") {
    e.preventDefault();
    data.splice(num, 1);
    renderData();
  } else if (e.target.getAttribute("type") === "checkbox") {
    data[num].checked = e.target.checked;
    renderData();
  }
});


//清除已完成項目
listFooter.addEventListener("click", function(e){
  if (e.target.getAttribute("class") !== "clear") {
    return;
  }
  e.preventDefault();

  data = data.filter(function(item){
    return item.checked == false;
  });

  renderData();
});


//切換tab
tab.addEventListener("click",function(e){
  //記住現在點的是哪個分頁
  tabState = e.target.textContent;

  //把三個tab的active都拿掉，再加到被點的那個
  const tabItems = document.querySelectorAll(".tab li");
  tabItems.forEach(function(li){
    li.classList.remove("active");
  });
  e.target.classList.add("active");

  renderData();
})