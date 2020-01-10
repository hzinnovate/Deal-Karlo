
window.addEventListener('load', () => {
    let userAuth = JSON.parse(window.localStorage.getItem('userAuth'))
    if (userAuth !== null && userAuth !== 'null' && userAuth !== undefined && userAuth !== 'undefined') {
        document.getElementById('nav').innerHTML += `
        <button onClick="location = './htmlFiles/chat.html'" 
        style="height: 30px;border: none;border-radius: 50px; background-color: rgb(33,33,33); color: white;"
        class="col-lg-1">Chat</button>
        <button onClick="logOut()"
        style="height: 30px;border: none;border-radius: 50px; background-color: rgb(33,33,33);color:  white;"
        class="col-lg-1">LogOut</button>
        `
        document.getElementById('navBtn').innerHTML += `
        <li style="color:white;" onClick="location = './htmlFiles/chat.html'">Chat</li>
        <li style="color:white;" onClick="showPopUp('popUpForPostAdd')">Sell</li>
        <li style="color:white;" onClick="logOut()">Log out</li>        
        `
    } else {
        document.getElementById('navBtn').innerHTML += `
        <li style="color:white;" onClick="showPopUp('popUpForLogin')">Login</li>
        <li style="color:white;" onClick="showPopUp('popUpForsignUp')">Signup</li>
        `
        document.getElementById('nav').innerHTML += `
        <button onClick="showPopUp('popUpForLogin')"
        style="    height: 30px;border: none;border-radius: 50px; background-color: rgb(33,33,33); color: white;"
        class="col-lg-1">Login</button>
        <button onClick="showPopUp('popUpForsignUp')"
        style="    height: 30px;border: none;border-radius: 50px; background-color: rgb(33,33,33);color:  white;"
        class="col-lg-1">Signup</button>
        `
    }

})
function logOut() {
    let ui = window.localStorage.getItem('userAuth');
    let dta = JSON.parse(ui)
    let key = dta.uid;
    firebase.database().ref(`LoginUsers`).child(key).remove().then(() => {
        firebase.auth().signOut().then(() => {
            window.localStorage.removeItem("userAuth");
            location.reload()
        })
    })
}
function signUp(param) {
    // loader(true)
    document.getElementById('loader').style.display = "block";
    const name = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    var flag = formValidation(name, email, password, confirmPassword)
    if (flag === true) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((success) => {
            let uid = success.user.uid;
            var userObj = {
                uid,
                name,
                email,
                profileImgUrl: `https://firebasestorage.googleapis.com/v0/b/dealkarlo.appspot.com/o/defaultProfileImg%2FuserProfileImg.png?alt=media&token=0ffa0d8e-8bb6-4a79-a046-0ca922456bef`,
            }
            firebase.database().ref(`userProfiles/${uid}/`).set(userObj).then(() => {
                swal({
                    title: "SignUp Successfull",
                    text: "Click Continue and Login with Email & password",
                    icon: "success",
                    button: "Continue",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                }).then(() => {
                    // loader(false)
                    document.getElementById('loader').style.display = "none";
                    document.getElementById(param).style.display = 'none'
                })
            })
        }).catch((error) => {
            swal({
                title: "SignUp fail",
                text: error.message,
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            }).then(() => {
                document.getElementById('loader').style.display = "none";

                // loader(false)
            })
        })
    } else {
        document.getElementById('loader').style.display = "none";

        // loader()
    }
}
function formValidation(fullName, email, password, confirmPassword) {
    var a, b, c;
    if (password !== confirmPassword) {
        swal({
            title: "Error",
            text: 'Password does not match',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        c = 0;
    } else if (password === confirmPassword) {

        if (password === "") {
            swal({
                title: "Error",
                text: 'Pleas Enter password',
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
            c = 0;
        } else if (!password.replace(/\s/g, '').length) {
            swal({
                title: "Error",
                text: 'Pleas Enter Password',
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
            c = 0;
        } else if (password.length < 7) {
            swal({
                title: "Error",
                text: 'Password lenght must be upto 6',
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
            c = 0;
        } else {
            c = 1;
        }
    }
    if (email === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter Email',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        b = 0;
    } else if (!email.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter Valid Email',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        b = 0;
    } else {
        b = 1;
    }
    if (fullName === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter your full name',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        a = 0;
    } else if (!fullName.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter your full name',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        a = 0;
    } else {
        a = 1;
    }
    var tst = a + b + c;
    if (tst === 3) {
        var flag = true;
    } else {
        var flag = false;
    }
    return (flag);
}
function signIn() {
    document.getElementById('loader').style.display = "block";
    const signInEmail = document.getElementById('signInEmail').value
    const signInPassword = document.getElementById('signInPassword').value
    firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword).then((success) => {
        var uid = success.user.uid;
        firebase.database().ref(`LoginUsers/${uid}`).set(uid)
        setProfileDataToLocalStorage(uid)
    }).catch((error) => {
        swal({
            title: "Login Fail",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then(() => {
            document.getElementById('loader').style.display = "none";
        })
    })
}
function signUpSocial(social) {
    document.getElementById('loader').style.display = "block";
    if (social === "facebook") {
        var provider = new firebase.auth.FacebookAuthProvider();
    } else if (social === "google") {
        var provider = new firebase.auth.GoogleAuthProvider();
    }
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider).then(function (result) {
        let uid = firebase.auth().currentUser.uid
        firebase.database().ref(`LoginUsers/${uid}`).set(uid)
        var name = result.user.displayName;
        var email = result.user.email;
        var profileImgUrl = result.user.photoURL;
        var userObj = {
            email,
            name,
            profileImgUrl,
            uid,
        }
        firebase.database().ref(`userProfiles`).once('value', (e) => {
            let value = e.val();
            var keyArry = []
            for (var key in value) {
                keyArry.push(key);
            }
            if (keyArry.indexOf(uid) === -1) {
                firebase.database().ref(`userProfiles/${uid}/`).set(userObj).then(() => {
                })
            }
            else if (keyArry.indexOf(uid) !== -1) {
            }
        }).then(() => {
            setProfileDataToLocalStorage(uid)
        })

    }).catch((error) => {
        swal({
            title: "Login Fail",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then(() => {
            // loader(false)
            document.getElementById('loader').style.display = "none";

        })
    });
}
function setProfileDataToLocalStorage(uid) {
    firebase.database().ref(`userProfiles/${uid}`).once('value', (e) => {
        let usrObj = e.val()
        window.localStorage.setItem('userAuth', JSON.stringify(usrObj))
    }).then(() => {
        swal({
            title: "Login Successfull",
            text: "Click Continue to go next page",
            icon: "success",
            button: "Continue",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then(() => {
            location.reload(true)
        })
    })
}