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
            var texto = "Um"+genero+" de aproximadamente " + dados[0].faceAttributes.age + " anos, com uma expressão facial "+emotionHigher+".";

            if(dados[0].faceAttributes.facialHair.moustache>0 && dados[0].faceAttributes.facialHair.moustache<0.51){
                texto += " Possui um pequeno bigode.";
            } else if(dados[0].faceAttributes.facialHair.moustache>0.51){
                texto += " Possui um grande bigode.";
            }

            if(dados[0].faceAttributes.facialHair.beard>0 && dados[0].faceAttributes.facialHair.beard<0.51){
                texto += " Apresenta uma pequena barba.";
            } else if(dados[0].faceAttributes.facialHair.beard>0.51){
                texto += " Apresenta uma grande barba.";
            }

            if(dados[0].faceAttributes.facialHair.sideburns>0 && dados[0].faceAttributes.facialHair.sideburns<0.51){
                texto += " Possui pequenas costeletas.";
            } else if(dados[0].faceAttributes.facialHair.sideburns>0.51){
                texto += " Possui grandes barba.";
            }

            if(dados[0].faceAttributes.hair.invisible == "false"){
                var hairNumber = -1;
                var hairHigher;
                for(var hair in dados[0].faceAttributes.hair.hairColor) {
                    if(dados[0].faceAttributes.hair.hairColor[hair].confidence > hairNumber){
                        hairNumber = dados[0].faceAttributes.hair.hairColor[hair].confidence;
                        hairHigher = hair;
                    }
                }
                var hairColor = dados[0].faceAttributes.hair.hairColor[hairHigher].color;

                switch (hairColor){
                    case 'Brown': 
                        hairColor = "Marrom";
                        break;
                    case 'Grey': 
                        hairColor = "Cinza";
                        break;
                    case 'Black': 
                        hairColor = "Preto";
                        break;
                    case 'Blond': 
                        hairColor = "Loiro";
                        break;
                    case 'Red': 
                        hairColor = "Ruivo";
                        break;
                    case 'Other': 
                        hairColor = "Não identificada.";
                        break;
                }

                texto += " Seu cabelo é "+hairColor+".";
            }


            if(dados[0].faceAttributes.glasses != "NoGlasses"){
                if(dados[0].faceAttributes.glasses == "ReadingGlasses"){
                    var oculos = "Óculos de Grau"
                } else if(dados[0].faceAttributes.glasses == "Sunglasses"){
                    var oculos = "Óculos de Sol"
                }
                texto += " Está usando "+oculos+".";
            }

            if(dados[0].faceAttributes.makeup.eyeMakeup =="true" && dados[0].faceAttributes.makeup.lipMakeup =="true"){
                texto += " Foram passadas maquiagens nos olhos e nos lábios.";
            } else if(dados[0].faceAttributes.makeup.eyeMakeup =="true"){
                texto += " Foi passada maquiagem nos olhos.";
            } else if(dados[0].faceAttributes.makeup.lipMakeup =="true"){
                texto += " Foi passada maquiagem nos lábios.";
            }

            document.querySelector("#result").innerText = texto;
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