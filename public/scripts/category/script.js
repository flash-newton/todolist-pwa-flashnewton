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


//listen to category collection doc change
db.collection('categories').onSnapshot(snapshot => {
    document.getElementById('category-spinner').style.display = 'none';
    snapshot.docChanges().forEach(change => {
        if(change.doc.data().uid === localStorage.getItem('userId')) {
            if (change.type === 'added') {
                renderCategoryList(change.doc.data(), change.doc.id);
            }
            if (change.type === 'removed') {
                removeCategoryList(change.doc.id);
            }
        }
    })
});

//create new task
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('categories').add({
        title: createForm.title.value,
        uid: localStorage.getItem('userId'),
    }).then(() => {
        // reset form
        createForm.reset();
    }).catch(err => {
        console.log(err.message);
    });
});

const categoryContainer = document.querySelector('.category-list');
categoryContainer.addEventListener('click', e => {
    if(e.target.parentElement.classList.contains('btn-category-delete') ||
        e.target.classList.contains('btn-category-delete')){
        const id = e.target.closest('.category-container').getAttribute('data-id');
        db.collection('categories').doc(id).delete();
    }
});


document.getElementById('btn-todo-list').addEventListener('click', function (){
    document.location.href = "./../../pages/todolist.html";
});
