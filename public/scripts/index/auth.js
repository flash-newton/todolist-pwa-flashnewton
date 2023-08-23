//check user signed in
if (localStorage.getItem('userId') && localStorage.getItem('displayName')){
    document.location.href = "./../../pages/todolist.html";
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

// signin
const signinForm = document.querySelector('#signin-form');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signinForm['signin-email'].value;
    const password = signinForm['signin-password'].value;

    // log the user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        document.location.href = "./../../pages/todolist.html";
    }).catch(err => {
        signinForm.querySelector('.error').innerHTML = err.message;
    });

});


const btnGoogleSignin = document.getElementById('google');
btnGoogleSignin.addEventListener('click', function (e){
    e.preventDefault();
    auth.signInWithPopup(googleProvider).then((result) => {
        document.location.href = "./../../pages/todolist.html";
    })
        .catch(function(error) {
            console.log(error.code)
            console.log(error.message)
    });
});

