var dados;

function processImage() {
    // Replace <Subscription Key> with your valid subscription key.
    var subscriptionKey = "a66d6182751b4866ba5bac77d093b5ed";

    // NOTE: You must use the same region in your REST call as you used to
    // obtain your subscription keys. For example, if you obtained your
    // subscription keys from westus, replace "westcentralus" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the "westus" region.
    // If you use a free trial subscription key, you shouldn't need to change 
    // this region.
    var uriBase =
        "https://brazilsouth.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "recognitionModel": "recognition_02",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

        .done(function (data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            console.log(data);
            dados = data;

            if(dados[0].faceAttributes.gender=="female"){
                var genero = "a mulher";
            }else{
                var genero = " homem";
            }
            var numberEmotionHigher = -1;
            var emotionHigher;
            for(var emote in dados[0].faceAttributes.emotion) {
                if(dados[0].faceAttributes.emotion[emote] > numberEmotionHigher){
                    numberEmotionHigher = dados[0].faceAttributes.emotion[emote];
                    emotionHigher = emote;
                }
            }
            switch (emotionHigher){
                case 'anger': 
                    emotionHigher = "de Raiva";
                    break;
                case 'contempt': 
                    emotionHigher = "de Desprezo";
                    break;
                case 'disgust': 
                    emotionHigher = "de Desgosto";
                    break;
                case 'fear': 
                    emotionHigher = "de Medo";
                    break;
                case 'happiness': 
                    emotionHigher = "de Felicidade";
                    break;
                case 'neutral': 
                    emotionHigher = "Neutra";
                    break;
                case 'sadness': 
                    emotionHigher = "de Tristeza";
                    break;
                case 'surprise': 
                    emotionHigher = "de Surpresa";
                    break;
            }

            // if(dados[0]){

            // }

            console.log(emotionHigher);
            document.querySelector("#result").innerText = "Um"+genero+" de " + dados[0].faceAttributes.age + " anos, com uma expressão facial "+emotionHigher+".";
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ?
                "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ?
                "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
};