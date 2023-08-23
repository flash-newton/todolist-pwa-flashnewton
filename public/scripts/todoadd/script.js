//check user signed in
if (!localStorage.getItem('userId') || !localStorage.getItem('displayName')){
    document.location.href = "./../../index.html";
}else {
    document.querySelector('#user-display-name').innerHTML = `Hello, ${localStorage.getItem('displayName')}`;
    document.querySelector('#user-display-name-right').innerHTML = `Hello, ${localStorage.getItem('displayName')}`;
}

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

// logout
const logout = document.querySelector('#btn-signout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        document.location.href = "./../../index.html";
    });

});
const taskAddForm = document.querySelector('#taskadd-form');
document.addEventListener('DOMContentLoaded', function (){
    const tid = new URLSearchParams(window.location.search).get('tid');
    if(tid){
        document.getElementById('btn-add').style.display = 'none';
        db.collection('tasks').where("uid", "==", tid).get()
            .then((querySnapshot) => {
                if(querySnapshot[0]){
                    taskAddForm.title.value = querySnapshot[0].data().title;
                }
            })
            .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    }else {
        document.getElementById('btn-update').style.display = 'none';
    }
});

document.getElementById('btn-todo-list').addEventListener('click', function (){
    console.log('kl')
    document.location.href = "./../../pages/todolist.html";
});

db.collection('categories').where("uid", "==", localStorage.getItem('userId')).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            renderCategorySelect(doc.data(), doc.id);
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

if (localStorage.getItem('taskListDate')){
    document.getElementById('date').valueAsDate = new Date(Number(localStorage.getItem('taskListYear')), Number(localStorage.getItem('taskListMonth')), Number(localStorage.getItem('taskListDay'))+1);
}

//create new task
taskAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let d = new Date(taskAddForm.date.value);
    db.collection('tasks').add({
        title: taskAddForm.title.value,
        content: taskAddForm.description.value,
        uid: localStorage.getItem('userId'),
        category: taskAddForm.category.value,
        completed: false,
        date: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    }).then(() => {
        localStorage.setItem("taskListDate", `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
        localStorage.setItem("taskListYear", d.getFullYear());
        localStorage.setItem("taskListMonth", d.getMonth());
        localStorage.setItem("taskListDay", d.getDate());
        localStorage.setItem("taskListCategory", taskAddForm.category.value);
        taskAddForm.reset();
        document.location.href = "./../../pages/todolist.html";
    }).catch(err => {
        console.log(err.message);
    });
});
