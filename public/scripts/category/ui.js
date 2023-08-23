const categoryList = document.querySelector('.category-list')

const renderCategoryList = (data, id) => {
    const html = `
    <div class="card category-container shadow-secondary mb-3" data-id="${id}">
      <div class="row">
        <div class="col text-left mt-2">${data.title}</div>
        <div class="col-auto">
          <button class="btn btn-outline-secondary btn-icon btn-category-delete"><i class="bi bi-trash3-fill"></i></button>
        </div>
      </div>
    </div>
  `;
    categoryList.innerHTML += html
}

const removeCategoryList = (id) => {
    const category = document.querySelector(`.category-container[data-id=${id}`);
    category.remove();
}

