var userData = JSON.parse(window.localStorage.getItem('userAuth'));
function hidePopUp(param) {
    document.getElementById(param).style.display = 'none'
}
function showPopUp(param) {
    if (param === 'popUpForPostAdd') {
        if (userData !== null && userData !== 'null' && userData !== undefined && userData !== 'undefined') {
            document.getElementById(param).style.display = 'block';
        } else {
            swal({
                title: "Error",
                text: 'This feuture is only for login users',
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
        }
    } else {
        document.getElementById(param).style.display = 'block';
    }
}
window.addEventListener('load',()=>{
    var condition = navigator.onLine ? true : false;
    if(condition === false){
        dataRendering()
        var navigatorBar = document.getElementById('navigatorBar')
        navigatorBar.style.display = "block";
        navigatorBar.style.backgroundColor = "darkred";
        navigatorBar.innerHTML = `
        <span> No Connection </span>
        `
            setTimeout(()=>{
                document.getElementById('navigatorBar').style.display = "none";
            },3000)
    }
})

if (userData !== undefined && userData !== null && userData !== 'undefined' && userData !== 'null') {
    firebase.database().ref(`offlineData/${userData.uid}`).on('value', (e) => {
        var offlineKeysArr = [];
        var dt = e.val()
        for (var key in dt) {
            offlineKeysArr.push(dt[key])
        }
        sendOfflineKeysinStorage(offlineKeysArr)
    })
}
function sendOfflineKeysinStorage(dta) {
    window.localStorage.setItem('offlineKeys', JSON.stringify(dta))
        dataRendering()
}
firebase.database().ref('posts').on('value', (e) => {
    let dataArray = [];
    let data = e.val();
    for (var key in data) {
        for (var key2 in data[key]) {
            for (var key3 in data[key][key2]) {
                // console.log(data[key][key2][key3])
                let dataObj = {
                    key2,
                    key3,
                    data: data[key][key2][key3]
                }
                dataArray.push(dataObj)
            }
        }
    }
    sendDataLocalStorage(dataArray)
})
function sendDataLocalStorage(dta) {
    window.localStorage.setItem('data', JSON.stringify(dta))
        dataRendering()
}
function dataRendering(){
    console.log('run');
    var condition = navigator.onLine ? true : false;
    document.getElementById('MainPosts').innerHTML = ""
    var postDta = JSON.parse(window.localStorage.getItem('data'))
    var offlineKeys = JSON.parse(window.localStorage.getItem('offlineKeys'));
    if (condition) {
        for (var key in postDta) {
            var offlineOnlineBtn = ``
            if (userData !== undefined && userData !== null && userData !== 'undefined' && userData !== 'null') {
                if (offlineKeys.indexOf(postDta[key].key3) !== -1) {
                    offlineOnlineBtn = `
                        <div class="row">
                        <p class="col-5" style="font-size: 10px;">
                            Show offline
                        </p>
                        <div class="col-6">
            <span onClick="removeOffline('${postDta[key].key3}')" style="background-color:green;float: right;border: 1px solid;border-radius: 100px;width: 26px;text-align: center;">&#10004;</span>
                        </div>
                    </div>
                        `
                } else {
                    offlineOnlineBtn = `
                        <div class="row">
                        <p class="col-5" style="font-size: 10px;">
                            Show offline
                        </p>
                        <div class="col-6">
            <span onClick="offlineD('${postDta[key].key3}')" style="background-color:none;float: right;border: 1px solid;border-radius: 100px;width: 26px;text-align: center;">&nbsp;</span>
                        </div>
                    </div>
                        `
                }
            } else {
                offlineOnlineBtn = ""
            }
            document.getElementById('MainPosts').innerHTML += `
                <div class="col-10 offset-1 col-lg-3  offset-lg-0" style="padding:5px;">
                <div style="border: 2px solid rgba(33, 33, 33, 0.623); padding: 8px;">
                    <div style="text-align: center;">
                        <img style="width: 100%" height="200px;" src="${postDta[key].data.pImgObj.url}">
                    </div>
                    <h3 style="padding-top: 5px;font-weight: bolder; overflow:hidden;height: 40px; ">
                    ${postDta[key].data.productName}
                    </h3>
                    <p style="margin-bottom: 0px;font-weight: bolder;">
                        Rs. ${postDta[key].data.price}
                    </p>
                    <div style="text-align: left;cursor: pointer">
                    <a style="font-size: 12px;" onClick="showDetails('popUpForDetails','${postDta[key].key2}', '${postDta[key].key3}')">Show Details</a>
                    </div>
                    <br>
                        ${offlineOnlineBtn}
                    </div>
            </div>
                `
        }
    } else {
        document.getElementById('MainPosts').innerHTML = "";
        for (var key in postDta) {
            if (userData !== undefined && userData !== null && userData !== 'undefined' && userData !== 'null') {
                if (offlineKeys.indexOf(postDta[key].key3) !== -1) {
                    document.getElementById('MainPosts').innerHTML += `
                        <div class="col-10 offset-1 col-lg-3  offset-lg-0" style="padding:5px;">
                        <div style="border: 2px solid rgba(33, 33, 33, 0.623); padding: 8px;">
                            <div style="text-align: center;">
                                <img style="width: 100%" height="200px;" src="${postDta[key].data.pImgObj.url}">
                            </div>
                            <h3 style="padding-top: 5px;font-weight: bolder; overflow:hidden;height: 40px; ">
                            ${postDta[key].data.productName}
                            </h3>
                            <p style="margin-bottom: 0px;font-weight: bolder;">
                                Rs. ${postDta[key].data.price}
                            </p>
                            <div style="text-align: left;cursor: pointer">
                            <a style="font-size: 12px;" onClick="showDetails('popUpForDetails','${postDta[key].key2}', '${postDta[key].key3}')">Show Details</a>
                            </div>
                            <br>
                            </div>
                    </div>
                        `
                }
            }
        }
    }
}
// setTimeout(() => {
    // dataRendering()
// }, 2000)
function offlineD(key) {
    firebase.database().ref(`offlineData/${userData.uid}/${key}`).set(key).then(() => {
    }).catch((err) => {
        console.log(err.message)
    })
}
function removeOffline(key) {
    firebase.database().ref(`offlineData/${userData.uid}`).child(key).remove()
}

window.addEventListener('offline', () => {
    dataRendering()
    var navigatorBar = document.getElementById('navigatorBar')
        navigatorBar.style.display = "block";
        navigatorBar.style.backgroundColor = "dimgray";
        navigatorBar.innerHTML = `
        <span> Your are offline </span>
        `
            setTimeout(()=>{
                document.getElementById('navigatorBar').style.display = "none";
            },3000)
})
window.addEventListener('online', () => {
    console.clear()
    // location.reload()
    dataRendering()
    var navigatorBar = document.getElementById('navigatorBar')
    navigatorBar.style.display = "block";
    navigatorBar.style.backgroundColor = "rgb(63, 202, 94)";
    navigatorBar.innerHTML = `
    <span> Back Online </span>
    `
        setTimeout(()=>{
            document.getElementById('navigatorBar').style.display = "none";
        },3000)
})
function srch(param) {
    var input;
    if (param === 'mb') {
        input = document.getElementById('mbSearchBar').value;
    } else {
        input = document.getElementById('searchBar').value;
    }
    document.getElementById('MainPosts').innerHTML = ""
    if (input !== "") {
        document.getElementById('heading').innerHTML = "Search Results"
    } else {
        document.getElementById('heading').innerHTML = "Top picks for you"
    }
    var condition = navigator.onLine ? true : false;
    var postDta = JSON.parse(window.localStorage.getItem('data'))
    var offlineKeys = JSON.parse(window.localStorage.getItem('offlineKeys'));
    for (var key in postDta) {
        if (postDta[key].data.productName.toLowerCase().search(input.toLowerCase()) !== -1) {
            if (condition) {
                var offlineOnlineBtn = ``
                if (userData !== undefined && userData !== null && userData !== 'undefined' && userData !== 'null') {
                    if (offlineKeys.indexOf(postDta[key].key3) !== -1) {
                        offlineOnlineBtn = `
                            <div class="row">
                            <p class="col-5" style="font-size: 10px;">
                            Show offline
                            </p>
                            <div class="col-6">
                            <span onClick="removeOffline('${postDta[key].key3}')" style="background-color:green;float: right;border: 1px solid;border-radius: 100px;width: 26px;text-align: center;">&#10004;</span>
                            </div>
                            </div>
                            `
                    } else {
                        offlineOnlineBtn = `
                            <div class="row">
                            <p class="col-5" style="font-size: 10px;">
                            Show offline
                        </p>
                        <div class="col-6">
                        <span onClick="offlineD('${postDta[key].key3}')" style="background-color:none;float: right;border: 1px solid;border-radius: 100px;width: 26px;text-align: center;">&nbsp;</span>
                        </div>
                        </div>
                        `
                    }
                } else {
                    offlineOnlineBtn = ""
                }
                document.getElementById('MainPosts').innerHTML += `
                <div class="col-10 offset-1 col-lg-3  offset-lg-0" style="padding:5px;">
                <div style="border: 2px solid rgba(33, 33, 33, 0.623); padding: 8px;">
                <div style="text-align: center;">
                <img style="width: 100%" height="200px;" src="${postDta[key].data.pImgObj.url}">
                </div>
                <h3 style="padding-top: 5px;font-weight: bolder; overflow:hidden;height: 40px; ">
                ${postDta[key].data.productName}
                </h3>
                <p style="margin-bottom: 0px;font-weight: bolder;">
                Rs. ${postDta[key].data.price}
                </p>
                <div style="text-align: left;cursor: pointer">
                <a style="font-size: 12px;" onClick="showDetails('popUpForDetails','${postDta[key].key2}', '${postDta[key].key3}')">Show Details</a>
                </div>
                <br>
                ${offlineOnlineBtn}
                </div>
                </div>
                `
            } else {
                if (userData !== undefined && userData !== null && userData !== 'undefined' && userData !== 'null') {
                    if (offlineKeys.indexOf(postDta[key].key3) !== -1) {
                        document.getElementById('MainPosts').innerHTML += `
                        <div class="col-10 offset-1 col-lg-3  offset-lg-0" style="padding:5px;">
                        <div style="border: 2px solid rgba(33, 33, 33, 0.623); padding: 8px;">
                        <div style="text-align: center;">
                        <img style="width: 100%" height="200px;" src="${postDta[key].data.pImgObj.url}">
                        </div>
                        <h3 style="padding-top: 5px;font-weight: bolder; overflow:hidden;height: 40px; ">
                        ${postDta[key].data.productName}
                        </h3>
                        <p style="margin-bottom: 0px;font-weight: bolder;">
                        Rs. ${postDta[key].data.price}
                        </p>
                        <div style="text-align: left;cursor: pointer">
                        <a style="font-size: 12px;" onClick="showDetails('popUpForDetails','${postDta[key].key2}', '${postDta[key].key3}')">Show Details</a>
                        </div>
                        <br>
                        </div>
                        </div>
                        `
                    }
                }
            }
        }
    }
}
function srchByCat(param) {
    var condition = navigator.onLine ? true : false;
    var catogery;
    if (param === 'mb') {
        catogery = document.getElementById('mbSearchercat').value
    } else {
        catogery = document.getElementById('searchercat').value;
    }
    if (catogery === 'all') {
        document.getElementById('heading').innerHTML = 'Top picks for you'
        dataRendering()
    }
    else {
        var postDta = JSON.parse(window.localStorage.getItem('data'))
        var offlineKeys = JSON.parse(window.localStorage.getItem('offlineKeys'));
        document.getElementById('heading').innerHTML = catogery;
        document.getElementById('MainPosts').innerHTML = ``
        for (var key in postDta) {
            if (catogery === postDta[key].data.catogeryHeading) {
                if (condition) {
                    var offlineOnlineBtn = ``
                    if (userData !== undefined && userData !== null && userData !== 'undefined' && userData !== 'null') {
                        if (offlineKeys.indexOf(postDta[key].key3) !== -1) {
                            offlineOnlineBtn = `
                            <div class="row">
                            <p class="col-5" style="font-size: 10px;">
                            Show offline
                            </p>
                            <div class="col-6">
                            <span onClick="removeOffline('${postDta[key].key3}')" style="background-color:green;float: right;border: 1px solid;border-radius: 100px;width: 26px;text-align: center;">&#10004;</span>
                            </div>
                            </div>
                            `
                        } else {
                            offlineOnlineBtn = `
                            <div class="row">
                            <p class="col-5" style="font-size: 10px;">
                            Show offline
                        </p>
                        <div class="col-6">
                        <span onClick="offlineD('${postDta[key].key3}')" style="background-color:none;float: right;border: 1px solid;border-radius: 100px;width: 26px;text-align: center;">&nbsp;</span>
                        </div>
                        </div>
                        `
                        }
                    } else {
                        offlineOnlineBtn = ""
                    }
                    document.getElementById('MainPosts').innerHTML += `
                <div class="col-10 offset-1 col-lg-3  offset-lg-0" style="padding:5px;">
                <div style="border: 2px solid rgba(33, 33, 33, 0.623); padding: 8px;">
                <div style="text-align: center;">
                <img style="width: 100%" height="200px;" src="${postDta[key].data.pImgObj.url}">
                </div>
                <h3 style="padding-top: 5px;font-weight: bolder; overflow:hidden;height: 40px; ">
                ${postDta[key].data.productName}
                </h3>
                <p style="margin-bottom: 0px;font-weight: bolder;">
                Rs. ${postDta[key].data.price}
                </p>
                <div style="text-align: left;cursor: pointer">
                <a style="font-size: 12px;" onClick="showDetails('popUpForDetails','${postDta[key].key2}', '${postDta[key].key3}')">Show Details</a>
                </div>
                <br>
                ${offlineOnlineBtn}
                </div>
                </div>
                `
                } else {
                    if (userData !== undefined && userData !== null && userData !== 'undefined' && userData !== 'null') {
                        if (offlineKeys.indexOf(postDta[key].key3) !== -1) {
                            document.getElementById('MainPosts').innerHTML += `
                        <div class="col-10 offset-1 col-lg-3  offset-lg-0" style="padding:5px;">
                        <div style="border: 2px solid rgba(33, 33, 33, 0.623); padding: 8px;">
                        <div style="text-align: center;">
                        <img style="width: 100%" height="200px;" src="${postDta[key].data.pImgObj.url}">
                        </div>
                        <h3 style="padding-top: 5px;font-weight: bolder; overflow:hidden;height: 40px; ">
                        ${postDta[key].data.productName}
                        </h3>
                        <p style="margin-bottom: 0px;font-weight: bolder;">
                        Rs. ${postDta[key].data.price}
                        </p>
                        <div style="text-align: left;cursor: pointer">
                        <a style="font-size: 12px;" onClick="showDetails('popUpForDetails','${postDta[key].key2}', '${postDta[key].key3}')">Show Details</a>
                        </div>
                        <br>
                        </div>
                        </div>
                        `
                        }
                    }

                }

            }
        }
    }
}
function addPost(param) {
    document.getElementById('loader').style.display = "block";
    let PostAddCatogery = document.getElementById('postAddCatogery').value;
    let productImg = document.getElementById('postAddImage').files[0]
    let postAddPrice = document.getElementById('postAddPrice').value;
    let postAddYear = document.getElementById('postAddYear').value;
    let postAddModule = document.getElementById('postAddModule').value;
    let postAddDescription = document.getElementById('postAddDescription').value;
    let postAddName = document.getElementById('postAddName').value;
    var flag = formValidate(PostAddCatogery, postAddName, postAddDescription, postAddModule, productImg, postAddPrice, postAddYear)
    if (flag) {
        let postObj = {
            year: postAddYear,
            modul: postAddModule,
            description: postAddDescription,
            productName: postAddName,
            catogeryHeading: PostAddCatogery,
            price: postAddPrice,
        }
        var date = new Date();
        var imgKey = date.getTime();
        firebase.storage().ref().child(`PostImages/${userData.uid}/${imgKey}`).put(productImg).then((done) => {
            firebase.storage().ref(`PostImages/${userData.uid}/${imgKey}`).getDownloadURL().then((url) => {
                var pImgObj = {
                    url,
                    imgKey
                }
                postObj.pImgObj = pImgObj
                firebase.database().ref(`posts/${PostAddCatogery}/${userData.uid}`).push(postObj).then((success) => {
                    sendNotification(userData.uid, postAddName, url)
                    document.getElementById('postAddYear').value = "";
                    document.getElementById('postAddModule').value = "";
                    document.getElementById('postAddDescription').value = "";
                    document.getElementById('postAddName').value = "";
                    document.getElementById('postAddPrice').value = "";
                }).then(() => {
                    document.getElementById('loader').style.display = "none";
                    document.getElementById(param).style.display = 'none';
                })
            })
        })
    } else {
        document.getElementById('loader').style.display = "none";
    }
}
function formValidate(catogery, productName, description, modul, productImg, price, year) {
    var a, b, c, d, e, f, g;
    if (catogery !== 'null') {
        g = 1;
    } else {
        swal({
            title: "Error",
            text: 'Pleas Select Catogery',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        g = 0;
    }
    if (year === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter Year of manufacture',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        f = 0;
    } else if (!year.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter Year of manufacture',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        f = 0;
    }
    else {
        f = 1;
    }
    if (price === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter Price',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        e = 0;
    } else if (!price.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter Price',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        e = 0;
    }
    else {
        e = 1;
    }
    if (productImg === null) {
        swal({
            title: "Error",
            text: 'Pleas Upload your Product Image first',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        d = 0;
    }
    else if (productImg === undefined) {
        swal({
            title: "Error",
            text: 'Pleas Upload your Product Image first',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        d = 0;
    } else {
        d = 1;
    }
    if (productName === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter Product Name',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        c = 0;
    } else if (!productName.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter Product Name',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        c = 0;
    }
    else {
        c = 1;
    }
    if (description === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter Descriptions',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        b = 0;
    } else if (!description.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter Descriptions',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        b = 0;
    } else {
        b = 1;
    }
    if (modul === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter Module Name',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        a = 0;
    } else if (!modul.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter your Module Name',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        a = 0;
    } else {
        a = 1;
    }
    var tst = a + b + c + d + e + f + g;
    if (tst === 7) {
        var flag = true;
    } else {
        var flag = false;
    }
    return (flag);
}
function showDetails(param, uid, postkey) {
    document.getElementById(param).style.display = 'block';
    let detailDta = JSON.parse(window.localStorage.getItem('data'))
    for (var key in detailDta) {
        if (detailDta[key].key3 === postkey) {
            document.getElementById(param).innerHTML =
                `
                    <div
                    style="position: fixed;top: 0px;width: 100%; height: 100vh; background-color: rgba(0, 0, 0, 0.774);z-index: 10;">
                </div>
                <div key="${postkey}" class="col-10 offset-1 col-lg-8 offset-lg-2"
                    style="position: fixed;background-color: white;top: 70px; z-index: 11;padding: 0px;">
                    <button onClick="hidePopUp('popUpForDetails')"
                        style="border: none; border-radius: 100px; background-color: rgb(33,33,33); height: 30px;width: 30px;color: white;position: absolute; top: -15px; right: -15px; font-weight: bolder; z-index: 12;">X</button>
                        <div class="row">
                            <div class="col-12 col-lg-5" style="padding: 0px !important;">
                                <img id="detailImg" src="${detailDta[key].data.pImgObj.url}" style="float: left; margin: 0px; height: 350px;" class="col-lg-12">
                            </div>
                            <div class="col-12 col-lg-7">
                                <br>
                                <div class="row">
                                    <h4 class="col-4">Name:</h4><h4 class="col-8">${detailDta[key].data.productName}</h4>
                                </div>
                                <div class="row">
                                    <h4 class="col-4">Model:</h4><h4 class="col-8">${detailDta[key].data.modul}</h4>
                                </div>
                                <div class="row">
                                    <h4 class="col-4">year:</h4><h4 class="col-8">${detailDta[key].data.year}</h4>
                                </div>
                                <div class="row">    
                                    <h4 class="col-4">Price:</h4><h4 class="col-8">Rs. ${detailDta[key].data.price} </h4>
                                </div>
                                <div class="row">
                                    <h4 class="col-4">Details:</h4><p class="col-8"> ${detailDta[key].data.description} </p>
                                </div>
                                <button onClick="chat('${uid}','popUpForChat')" class="col-5 offset-1 col-lg-2 offset-lg-1"
                                style="height: 40px;color: white; background-color: rgb(33,33,33);border-radius: 50px; ">Chat</button>
                            </div>
                        </div>    
                        </div>`
        }
    }
}
function chat(uid, param) {
    if (userData !== undefined && userData !== null && userData !== 'undefined' && userData !== 'null') {
        document.getElementById(param).style.display = 'block';
        var key = uid
        let sendButtton = document.getElementById('sendButtton').setAttribute('key', key);
        firebase.database().ref(`userProfiles/${key}`).once('value', (e) => {
            let curentusr = e.val()
            document.getElementById('chatHeader').innerHTML = `
            <div class="img_cont">
            <img src="${curentusr.profileImgUrl}" class="rounded-circle user_img">
            </div>
            <div class="user_info">
            <span style="color:black; font-weight:bolder;">${curentusr.name}</span>
            </div>
            `
            showMessegeone(key)
        })
    } else {
        swal({
            title: 'Pleas Login First',
            icon: 'error',
            button: 'ok',
        })
    }
}
function sendMessege(ths) {
    var key = ths.getAttribute('key');
    let messegeText = document.getElementById('messege').value;
    let timeStamp = firebase.database.ServerValue.TIMESTAMP;
    let messegeObj = {
        messegeText,
        timeStamp
    }
    var imageForM = userData.profileImgUrl;
    firebase.database().ref(`chat/${key}`).child(userData.uid).push(messegeObj).then((success) => {
        sendNotificationMessege(key, messegeText, imageForM, userData.name)
        document.getElementById('messege').value = '';
        showMessegeone(key)
    })
}
function showMessegeone(k) {
    var key = k;
    var keyImgUrl;
    firebase.database().ref(`userProfiles/${key}`).once('value', (e) => {
        let d = e.val();
        return keyImgUrl = d.profileImgUrl;
    })
    firebase.database().ref(`chat/${userData.uid}`).on('value', (a) => {
        var messegeObj = {
            recieveMessege: [],
            sendMessege: [],
        }
        var recieveMessegeKeyChecker = [];
        var sendMessageKeyCheker = [];
        firebase.database().ref(`chat/${userData.uid}/${key}`).once('value', (l) => {
            firebase.database().ref(`chat/${key}/${userData.uid}`).once('value', (e) => {
                let dta = l.val()
                console.log(dta)
                for (var key in dta) {
                    if (recieveMessegeKeyChecker.indexOf(key) === -1) {
                        recieveMessegeKeyChecker.push(key)
                        messegeObj.recieveMessege.push(dta[key])
                    }
                }
                let data = e.val()
                for (var key in data) {
                    if (sendMessageKeyCheker.indexOf(key) === -1) {
                        sendMessageKeyCheker.push(key)
                        messegeObj.sendMessege.push(data[key])
                    }
                }
            }).then(() => {
                var mainArray = [];
                for (var key in messegeObj) {
                    for (var key2 in messegeObj[key]) {
                        if (key === 'recieveMessege') {
                            messegeObj[key][key2].recieve = 'done'
                            mainArray.push(messegeObj[key][key2])
                        }
                        else if (key === 'sendMessege') {
                            messegeObj[key][key2].send = 'done'
                            mainArray.push(messegeObj[key][key2])
                        }
                    }
                }
                return mainArray;
            }).then((mainArray) => {
                document.getElementById('chatBody').innerHTML = " "
                mainArray.sort(function (a, b) {
                    return a.timeStamp - b.timeStamp;
                });
                for (var key in mainArray) {
                    for (var key2 in mainArray[key]) {
                        if (key2 === 'recieve') {
                            let time = getTime(mainArray[key].timeStamp)
                            document.getElementById('chatBody').innerHTML +=
                                `
                            <div class="d-flex justify-content-end mb-4">
                            <div style="min-width: 100px;" class="msg_cotainer_send">
                            ${mainArray[key].messegeText}
                            <span class="msg_time_send">${time}</span>
                            </div>
                            <div class="img_cont_msg">
                            <img src="${keyImgUrl}" class="rounded-circle user_img_msg">
                            </div>
                            </div>
                            `;

                        } else if (key2 === 'send') {
                            let time = getTime(mainArray[key].timeStamp)
                            document.getElementById('chatBody').innerHTML +=
                                `
                            <div class="d-flex justify-content-start mb-4">
                            <div class="img_cont_msg">
                            <img src="${userData.profileImgUrl}"
                            class="rounded-circle user_img_msg">
                            </div>
                            <div style="min-width: 100px;" class="msg_cotainer">
                            ${mainArray[key].messegeText}
                            <span class="msg_time">${time}</span>
                            </div>
                            </div>
                            `;
                        }
                    }
                }
            }).then(() => {
                var elem = document.getElementById('chatBody');
                elem.scrollTop = elem.scrollHeight;
            })
        })
    })
}
function getTime(t) {
    if (t !== undefined) {
        var myDate = new Date(t);
    } else if (t === undefined) {
        var myDate = new Date();
    }
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    var date = myDate.getDate();
    var year = myDate.getFullYear();
    var month = myDate.getMonth();
    return time = `${date}-${month}-${year} ${hours}:${minutes}`
}
function sendNotification(uid, msg, url) {

    firebase.database().ref("/fcmTokens").once("value", function (snapshot) {
        snapshot.forEach(function (token) {
            if (token.val() !== uid) { //Getting the token of the reciever using  if condition..!   
                // console.log(token.key)   
                $.ajax({
                    type: 'POST',
                    url: "https://fcm.googleapis.com/fcm/send",
                    headers: { Authorization: 'key=' + 'AIzaSyD-cp6lCxqsdfyXdwim4NC1Jc3UIAfdeYs' },
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        "to": token.key,
                        "notification": {
                            "title": `New Post Added In Deal Karlo`,
                            "body": msg,
                            "icon": url, //Photo of sender
                            // "click_action": `https://www.google.com` //Notification Click url notification par click honay k bad iss url par redirect hoga
                        }
                    }),
                    success: function (response) {
                        console.log(response);
                        //Functions to run when notification is succesfully sent to reciever
                    },
                    error: function (xhr, status, error) {
                        //Functions To Run When There was an error While Sending Notification
                        console.log(xhr.error);
                    }
                });
            }
        });
    });

}
function sendNotificationMessege(uid, msg, image, name) {

    firebase.database().ref("/fcmTokens").once("value", function (snapshot) {
        snapshot.forEach(function (token) {
            if (token.val() == uid) { //Getting the token of the reciever using  if condition..!   
                // console.log(token.key)   
                $.ajax({
                    type: 'POST',
                    url: "https://fcm.googleapis.com/fcm/send",
                    headers: { Authorization: 'key=' + 'AIzaSyD-cp6lCxqsdfyXdwim4NC1Jc3UIAfdeYs' },
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        "to": token.key,
                        "notification": {
                            "title": `${name} send you Messege From Post`,
                            "body": msg,
                            "icon": image, //Photo of sender
                            // "click_action": `https://www.google.com` //Notification Click url notification par click honay k bad iss url par redirect hoga
                        }
                    }),
                    success: function (response) {
                        console.log(response);
                        //Functions to run when notification is succesfully sent to reciever
                    },
                    error: function (xhr, status, error) {
                        //Functions To Run When There was an error While Sending Notification
                        console.log(xhr.error);
                    }
                });
            }
        });
    });

}