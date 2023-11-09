const LOCALNAME = "expense";

const inpName = document.querySelector('#inp_name');
const inpPrice = document.querySelector('#inp_price');
const btnAdd = document.querySelector('#btn_add');
const eleTbody = document.querySelector('tbody');
const eleTotal = document.querySelector('.total span');
const selFilter = document.querySelector('#filter');



function setExpense(data) {
    localStorage.setItem('expense', JSON.stringify(data));
}
function loadExpense() {
    let data = localStorage.getItem(LOCALNAME);
    return JSON.parse(data);
}
function deleteExpense(id) {
    let data = loadExpense();
    data = data.filter((item) => item.id != id);
    setExpense(data);
    loadPage();
}
function formatTime(timeSeconds) {
    let date = new Date(timeSeconds);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
function loadPage() {
    let data = loadExpense();
    let filterType = selFilter.value;
    if (filterType == 'today') {
        data = data.filter((item) => new Date(item.time).toLocaleDateString() == new Date().toLocaleDateString());
    } else if (filterType == 'yesterday') {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        let yesterdayDate = currentDate.toLocaleDateString();
        data = data.filter((item) => new Date(item.time).toLocaleDateString() == yesterdayDate);
    } else if (filterType == 'week') {
        let currentDate = new Date();
        let currentDay = currentDate.getDay();
        let firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDay));
        let lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() + 7));
        data = data.filter((item) => {
            let itemTime = new Date(item.time);
            return itemTime > firstDayOfWeek && itemTime < lastDayOfWeek;
        });
    } else if (filterType == 'month') {
        let currentDate = new Date();
        let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        let lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        data = data.filter((item) => {
            let itemTime = new Date(item.time);
            return itemTime > firstDayOfMonth && itemTime < lastDayOfMonth;
        });
    }
    data = data.filter((item) => item.time);
    if (data.length < 1) {
        eleTbody.innerHTML = '';
        return;
    }
    data.sort((firstEl, secondEl) => {
        return secondEl.time - firstEl.time;
    });
    let html = ``
    let total = 0;
    data.forEach(row => {
        html += `
        <tr class="text-center even:bg-slate-100 hover:bg-slate-300">
            <td class="text-left">${row['name']}</td>
            <td>${row['price']}</td>
            <td>${formatTime(row['time'])}</td>
            <td><button class="bg-gray-100 px-2 py-1 rounded-md js_btn_del" id="${row['id']}">DELETE</button></td>
        </tr>`
        total += parseInt(row['price']);
    });
    eleTotal.textContent = total;
    eleTbody.innerHTML = html;
    let btnDels = document.querySelectorAll('.js_btn_del');
    btnDels.forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteExpense(e.target.id);
        });
    });
}
// code chạy khi mở web
if (!localStorage.getItem(LOCALNAME)) {
    setExpense([]);
}
loadPage();

selFilter.addEventListener('change', (e) => {
    loadPage();
});
inpPrice.addEventListener('keydown', (e) => {
    let keycode = e.keyCode || e.which;
    console.log(keycode);
    if (keycode == 9 || keycode == 13) {
        alert(3123123);
    }
})
btnAdd.addEventListener('click', (e) => {
    let expense = loadExpense();
    let name = inpName.value;
    let price = inpPrice.value;
    let time = new Date().getTime();
    let data = {
        id: expense.length + 1,
        name,
        price,
        time
    }
    // console.log(expense);
    // if (expense.lenght < 1) {
    //     expense = Array(data);
    // } else {
    //     console.log('có dữ liệu');
    //     expense.push(data);
    // }
    inpName.value = '';
    inpPrice.value = '';
    expense.push(data);
    setExpense(expense);
    loadPage();
})