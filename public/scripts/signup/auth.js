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

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user credentials
    const fname = signupForm['signup-fname'].value;
    const lname = signupForm['signup-lname'].value;
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user & add firestore data
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        cred.user.updateProfile({
            displayName: fname + ' ' + lname
        }).then(function() {
            localStorage.setItem("userId", cred.user.uid);
            localStorage.setItem("displayName", fname);
            if (localStorage.getItem('userId') && localStorage.getItem('displayName')) {
                document.location.href = "./../../pages/todolist.html";
            }
        }, function(error) {
            // An error happened.
        });
    }).catch(err => {
        console.log(err)
        signupForm.querySelector('.error').innerHTML = err.message;
    });
});


