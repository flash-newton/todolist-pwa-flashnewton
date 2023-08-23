const taskList = document.querySelector('.task-list')

const renderTaskList = (data, id) => {

    let html = `
    <div class="card task-container mb-2 shadow-secondary" data-id="${id}">
      <div class="row">
        <div class="col-auto center mt-2">`;
    if (data.completed){
        html += `<input class="form-check-input task-chk" type="checkbox" value="" id="${id}" checked>`;
    }else {
        html += `<input class="form-check-input task-chk" type="checkbox" value="" id="${id}">`;
    }

    html += `</div>
        <div class="col text-left mt-2 task-container-title">${data.title}</div>
        <div class="col-auto">
          <button class="btn btn-line-dark btn-icon btn-task-delete"><i class="bi bi-trash3-fill"></i></button>
        </div>
      </div>
    </div>
  `;
    taskList.innerHTML += html
}

const removeTaskList = (id) => {
    const task = document.querySelector(`.task-container[data-id=${id}`);
    task.remove();
}

const categoryList = document.querySelector('.category-list')
categoryList.innerHTML = `
    <div class="side-menu-item text-left pl-2 sm-category-item-container catselected" data-id="">
        <i class="bi bi-bookmark"></i><span class="ml-4 sm-category-title">All</span>
    </div>
  `;

const renderCategoryList = (data, id) => {
    const html = `
    <div class="side-menu-item text-left pl-2 sm-category-item-container" data-id="${id}" data-title="${data.title}">
        <i class="bi bi-bookmark"></i><span class="ml-4 sm-category-title">${data.title}</span>
    </div>
  `;
    categoryList.innerHTML += html
}

if (window.matchMedia("(max-width: 1200px)").matches){
    document.querySelector("#sidebar-toggler-container").style.display = 'block';
    document.querySelector("#sidebar-left-container").classList.remove('show');
    document.querySelector("#sidebar-right-container").classList.remove('show');
}else {
    document.querySelector("#sidebar-toggler-container").style.display = 'none';
    document.querySelector("#sidebar-left-container").classList.add('show');
    document.querySelector("#sidebar-right-container").classList.add('show');
}
window.matchMedia("(max-width: 1200px)").addEventListener("change", function (e){
    if (e.matches){
        document.querySelector("#sidebar-toggler-container").style.display = 'block';
        document.querySelector("#sidebar-left-container").classList.remove('show');
        document.querySelector("#sidebar-right-container").classList.remove('show');
    }else {
        document.querySelector("#sidebar-toggler-container").style.display = 'none';
        document.querySelector("#sidebar-left-container").classList.add('show');
        document.querySelector("#sidebar-right-container").classList.add('show');
    }
});

document.querySelector('#sidebar-right-button').addEventListener('click', function (e){
    document.querySelector("#sidebar-left-container").classList.remove('show');
});

document.querySelector('#sidebar-left-button').addEventListener('click', function (e){
    document.querySelector("#sidebar-right-container").classList.remove('show');
});
