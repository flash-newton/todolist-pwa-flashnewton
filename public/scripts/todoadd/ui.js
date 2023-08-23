const categorySelect = document.querySelector('#category')
categorySelect.add(new Option('None', ''));

const renderCategorySelect = (data, id) => {
    if (localStorage.getItem("taskListCategory") == id) {
        categorySelect.add(new Option(data.title, id, false, true));
    }else {
        categorySelect.add(new Option(data.title, id, false, false));
    }
}
