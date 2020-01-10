var config = {
    
};
firebase.initializeApp(config);

window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../../sw.js').then((registration) => {
            console.log("resistration succesfull")
            // Registration was successful
            firebase.messaging().useServiceWorker(registration);

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {

                    function saveMessagingDeviceToken() {

                        firebase.messaging().getToken().then(function (currentToken) {
                            if (currentToken) {
                                console.log('Got FCM device token:', currentToken);
                                // Saving the Device Token to the datastore.
                                firebase.database().ref('/fcmTokens').child(currentToken)
                                    .set(firebase.auth().currentUser.uid);
                            } else {
                                // Need to request permissions to show notifications.
                                requestforpermision()
                            }
                        }).catch(function (error) {
                            console.error('Unable to get messaging token.', error);
                        });
                    } //Savetoken ends here

                    function requestforpermision() {
                        firebase.messaging().requestPermission().then(function () {
                            // Notification permission granted.
                            saveMessagingDeviceToken();
                        }).catch(function (error) {
                            console.error('Unable to get permission to notify.', error);
                            alert("Your Notifications Are Disabled")
                        });

                    } //Req Permisison ends here
                    requestforpermision()
                }
            });
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
            .catch((err) => {
                console.log('ServiceWorker registration failed: ', err);

            })
    }
})

firebase.messaging().onMessage(function (payload) {
    console.log(payload)
});