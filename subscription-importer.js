$('#import').click(function() {
    var selectedFile = document.getElementById('input-file').files[0];
    var signedIn = checkIfSignedIn();
    if (signedIn) {
        handleXML(selectedFile);
    } else {
        handleAuthClick();
    }
});
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

function handleXML(file) {
    $.get(window.URL.createObjectURL(file), function(data) {
        console.log(window.URL.createObjectURL(file));
        //var xmlDoc = data.responseXML;
        var regex = /(UC)[A-Za-z0-9\-_]+/g;
        var x = $(data);
        console.log(x);
        var outline = x.find("outline[xmlUrl]")
        console.log(outline);
        var txt = "";
        $(outline).each(function() {
            var title = $(this).attr("title");
            txt += "Subscribed to: " + title + "<br>";
            var id = $(this).attr("xmlUrl") + "";
            addSubscription(id.match(regex)[0]);
            //console.log(id.match(regex)[0]);
        });
        $('#dropbox-label').html("");
        $('#display').html(txt);
    });
}
