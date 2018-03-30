var GoogleAuth;
//What part of the youtube API do we need scope for?
var SCOPE = 'https://www.googleapis.com/auth/youtube';

function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
}

function initClient() {
    // Retrieve the discovery document for version 3 of YouTube Data API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyB4iNfzGiZJaorOM6KFACWX3T2q0AlExPU',
        'discoveryDocs': [discoveryUrl],
        'clientId': '1041512274445-upcpmoa8f37d5eping3t3cm7gl79ic9p.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function() {
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);

        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();

        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        /*$('#sign-in-or-out-button').click(function() {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function() {
            revokeAccess();
            console.log("pressed button");
        });*/
        $('#revoke-access-button').click(function() {
            revokeAccess();
            console.log("pressed button");
        });

    });
}
function checkIfSignedIn(){
  return GoogleAuth.isSignedIn.get();
}

function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
    }
}

function revokeAccess() {
    GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
        $('#add-subscription').html('Add Subscription')
    } else {
        $('#add-subscription').html('error')
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}

function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}

// Subscribes the authorized user to the channel specified
function addSubscription(channelSub) {
    var resource = {
        part: 'id,snippet',
        snippet: {
            resourceId: {
                kind: 'youtube#channel',
                channelId: channelSub
            }
        }
    };

    var request = gapi.client.youtube.subscriptions.insert(resource);
    request.execute(function(response) {
        var result = response.result;
        if (result) {
            console.log("subscription completed");
        }
    });
}
