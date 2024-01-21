let todo = localStorage.getItem('todo');
let chd = { 0: ['fall', null], 1: ['fact', false], 2: ['fcomp', true] }, cf = 0;
if (todo) {
    todo = JSON.parse(todo);
} else {
    todo = [];
}

function loadTodo() {
    let list = document.querySelector('.todos');
    let c = 0;
    list.innerHTML = '';
    for (const [k, v] of Object.entries(todo)) {
        let comp_class = '', inpc = '';
        if (v.checked) {
            comp_class = 'completed'
            inpc = 'checked'
        } else {

            c++;
        }
        let html = `<section class="todo" onclick='set_check(this.children[0].children[0],` + k + `,true)'>
        <section class="chk">
          <input onclick='set_check(this.checked,`+ k + `)' ` + inpc + ` type="checkbox">
          <img src="./images/icon-check.svg" class="check">
        </section>
        <p class='`+ comp_class + `'>` + v.name + `</p>
        <img onclick='removeTodo(`+ k + `)' src="./images/icon-cross.svg" class="cross">
      </section>`
        list.innerHTML += html;
    }
    document.querySelector('.count').innerHTML = c + " items left";

    (() => { enableDragSort('drag-sort-enable') })();
}

function addTodo(elem) {
    if (event.key == 'Enter') {
        let data = { name: elem.value, checked: false }
        elem.value = '';
        todo.push(data);
        localStorage.setItem('todo', JSON.stringify(todo));
        loadTodo();
    }
}

function set_check(checked, index, main = false) {
    console.log(event.target.classList.contains('cross'))
    if (event.target.classList.contains('cross') == false) {
        if (main) {
            if (checked.checked) {
                checked.checked = false
            } else {
                checked.checked = true
            }

            todo[index].checked = checked.checked;
            localStorage.setItem('todo', JSON.stringify(todo));
            loadTodo();
        }
    }
}

function removeTodo(index) {
    if(todo.length!=1){
    delete todo[index];
    }else{
        todo=[]
        localStorage.clear()
    }
    loadTodo();
}

function set_filter(id) {
    document.querySelector('.' + chd[id][0]).classList.toggle('t-active')
    document.querySelector('.' + chd[cf][0]).classList.toggle('t-active')
    cf = id
    filetTodo()
}


function filetTodo() {
    let list = document.querySelector('.todos');
    list.innerHTML = '';
    for (const [k, v] of Object.entries(todo)) {
        let comp_class = '', inpc = '';
        if (v.checked == chd[cf][1] || chd[cf][1] == null) {
            if (v.checked) {
                comp_class = 'completed'
                inpc = 'checked'
            }
            let html = `<section class="todo" onclick='set_check(this.children[0].checked,` + k + `)'>
        <section class="chk">
          <input `+ inpc + ` type="checkbox">
          <img src="./images/icon-check.svg" class="check">
        </section>
        <p class='`+ comp_class + `'>` + v.name + `</p>
        <img onclick='removeTodo(`+ k + `)' src="./images/icon-cross.svg" class="cross">
      </section>`
            list.innerHTML += html;
        }

    }

    (() => { enableDragSort('drag-sort-enable') })();
}

function store_order() {
    let temp = [], tds = document.querySelectorAll('.todo');
    for (const [k, v] of Object.entries(tds)) {
        temp.push({ name: v.querySelector('p').innerHTML, checked: v.querySelector('input').checked })
    }
    todo = temp
    localStorage.setItem('todo', JSON.stringify(todo));
    loadTodo();

}

function clearComp() {
    let temp = []
    for (const [k, v] of Object.entries(todo)) {
        if (!v.checked) {
            temp.push(v)
        }
    }
    todo = temp
    localStorage.setItem('todo', JSON.stringify(todo));
    loadTodo();
}


function enableDragSort(listClass) {
    const sortableLists = document.getElementsByClassName(listClass);
    Array.prototype.map.call(sortableLists, (list) => { enableDragList(list) });
}

function enableDragList(list) {
    Array.prototype.map.call(list.children, (item) => { enableDragItem(item) });
}

function enableDragItem(item) {
    item.setAttribute('draggable', true)
    item.ondrag = handleDrag;
    item.ondragend = handleDrop;
}

function handleDrag(item) {
    const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY;

    selectedItem.classList.add('drag-sort-active');
    let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

    if (list === swapItem.parentNode) {
        swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
        list.insertBefore(selectedItem, swapItem);
    }
}

function handleDrop(item) {
    item.target.classList.remove('drag-sort-active');
    store_order()
}

function tgl_mode() {
    document.body.classList.toggle('dark')
    document.body.classList.toggle('light')

}

loadTodo()