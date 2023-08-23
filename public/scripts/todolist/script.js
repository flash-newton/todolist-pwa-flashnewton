//check user signed in
if (!localStorage.getItem('userId') || !localStorage.getItem('displayName')){
    document.location.href = "./../../index.html";
}else {
    document.querySelector('#user-display-name').innerHTML = `Hello, ${localStorage.getItem('displayName')}`;
    document.querySelector('#user-display-name-right').innerHTML = `Hello, ${localStorage.getItem('displayName')}`;
}

// logout
const logout = document.querySelector('#btn-signout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        localStorage.removeItem("displayName")
        localStorage.removeItem("taskListDate")
        localStorage.removeItem("taskListYear")
        localStorage.removeItem("taskListMonth")
        localStorage.removeItem("taskListDay")
        document.location.href = "./../../index.html";
    });

});


//allow offline data access from firestore
db.enablePersistence()
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // multible tabs open
            console.log('persistance failed');
        } else if (err.code == 'unimplemented') {
            // feature is not browser compatible
            console.log('persistance not available');
        }
    });

//listen to task collection doc change
db.collection('tasks').onSnapshot(snapshot => {
    document.getElementById('task-spinner').style.display = 'none';
    document.getElementById('no-data').style.display = 'none';
    snapshot.docChanges().forEach((change, index, array) => {
        if(change.doc.data().date === localStorage.getItem("taskListDate") &&
            change.doc.data().uid === localStorage.getItem('userId')) {
            if (change.type === 'added') {
                renderTaskList(change.doc.data(), change.doc.id);
            }
            if (change.type === 'removed') {
                removeTaskList(change.doc.id);
            }
        }
    });
});

//retrieve task list with filter
const getTaskList = (data, id) => {
    document.querySelector('.task-list').innerHTML = '';
    let taskCollection = db.collection('tasks').where("uid", "==", id);
    if (data?.date){
        taskCollection = taskCollection.where("date", "==", data?.date)
    }
    if (data?.category && data?.category !== ''){
        taskCollection = taskCollection.where("category", "==", data?.category)
    }
    taskCollection.get()
        .then((querySnapshot) => {
            document.getElementById('task-spinner').style.display = 'none';
            querySnapshot.forEach((doc) => {
                renderTaskList(doc.data(), doc.id);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

//display task list on filter select
const calendar = document.querySelector('#calendar');
const calendarDays = calendar.querySelectorAll('td');

for (let i=0; i<calendarDays.length-1; i++){
    calendarDays[i].addEventListener('click', ()=>{
        if(calendarDays[i].textContent !== ''){
            document.getElementById('task-spinner').style.display = 'block';
            if (window.matchMedia("(max-width: 1200px)").matches){
                document.querySelector("#sidebar-right-container").classList.remove('show');
            }
            getTaskList({category: localStorage.getItem("taskListCategory")?localStorage.getItem("taskListCategory"):'', date:`${localStorage.getItem("taskListYear")}-${localStorage.getItem("taskListMonth")}-${calendarDays[i].textContent}`}, localStorage.getItem('userId'));
        }
    });
}

const categoryContainer = document.querySelector('.category-list');
categoryContainer.addEventListener('click', e => {
    console.log(e.target)
    if(e.target.parentElement.classList.contains('sm-category-item-container') ||
        e.target.parentElement.parentElement.classList.contains('sm-category-item-container') ||
        e.target.classList.contains('sm-category-item-container')){
        for (const child of categoryContainer.children) {
            if (child.classList.contains("catselected")){
            child.classList.remove("catselected");
            }
        }


        const id = e.target.closest('.sm-category-item-container').getAttribute('data-id') ;
        e.target.closest('.sm-category-item-container').classList.add('catselected');
        console.log(e.target.closest('.sm-category-item-container').getAttribute('data-title'))
        if (id){
            document.getElementById('category-name').innerHTML = e.target.closest('.sm-category-item-container').getAttribute('data-title') ;
        }else {
            document.getElementById('category-name').innerHTML = 'All Tasks';
        }

        localStorage.setItem("taskListCategory", id);
        document.getElementById('task-spinner').style.display = 'block';
        if (window.matchMedia("(max-width: 1200px)").matches){
            document.querySelector("#sidebar-left-container").classList.remove('show');
        }

        getTaskList({category: id, date:`${localStorage.getItem("taskListYear")}-${localStorage.getItem("taskListMonth")}-${localStorage.getItem("taskListDay")}`}, localStorage.getItem('userId'));

    }
});

//create new task
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('tasks').add({
        title: createForm.title.value,
        content: '',
        uid: localStorage.getItem('userId'),
        category: localStorage.getItem("taskListCategory") || '',
        completed: false,
        date: localStorage.getItem("taskListDate")
    }).then(() => {
        // reset form
        createForm.reset();
    }).catch(err => {
        console.log(err.message);
    });
});


const taskContainer = document.querySelector('.task-list');
taskContainer.addEventListener('click', e => {
  if(e.target.parentElement.classList.contains('btn-task-delete') ||
        e.target.classList.contains('btn-task-delete')){
      const id = e.target.closest('.task-container').getAttribute('data-id');
      db.collection('tasks').doc(id).delete();
  }else if(e.target.parentElement.classList.contains('btn-task-edit') ||
      e.target.classList.contains('btn-task-delete')){
      const id = e.target.closest('.task-container').getAttribute('data-id');
      document.location.href = `./../../pages/todoadd.html?tid=${id}`;
  }else if(e.target.parentElement.classList.contains('task-chk') ||
        e.target.classList.contains('task-chk')){
        const id = e.target.closest('.task-container').getAttribute('data-id');
        const chk = document.getElementById(`${id}`).checked;
        db.collection('tasks').doc(id).update({completed: chk});
    }
});

document.getElementById('btn-category-add').addEventListener('click', function (){
    document.location.href = "./../../pages/category.html";
});

document.getElementById('btn-task-add-advanced').addEventListener('click', function (){
    document.location.href = "./../../pages/todoadd.html";
});


db.collection('categories').where("uid", "==", localStorage.getItem('userId')).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            renderCategoryList(doc.data(), doc.id);
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });





