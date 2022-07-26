const Alexa = require('ask-sdk-core');

const schuetzenfest = require('./schuetzenfest');

let counter = 0;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Horrido und herzlich willkommen beim Bürgerschützenverein Freckenhorst. Was kann ich für dich tun?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const AskForNextEventIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskForNextEvent';
    },
    handle(handlerInput) {
        const year = Alexa.getSlotValue(handlerInput.requestEnvelope, 'year');

        let datum;

        if (year !== undefined) {
            datum = new Date(year, 0, 1);
        } else {
            datum = new Date();
        }

        let speakOutput = schuetzenfest.nextSchuetzenfest(datum);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const GreetingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Greeting';
    },
    handle(handlerInput) {

        let output = "Do"
        counter++;

        if (counter === 2) {
            output = "Do. Hussa, hussa, husssasssasssa."
            counter = 0
            return handlerInput.responseBuilder
                .speak(output)
                .getResponse();
        }

        return handlerInput.responseBuilder
            .speak(output)
            .reprompt("Du musst jetzt noch einmal 'Horri' sagen.")
            .getResponse();
    }
};

const GreetingTwoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GreetingTwo';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Horrido")
            .getResponse();
    }
};

const AskForLastEventIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskForLastEvent';
    },
    handle(handlerInput) {
        const year = Alexa.getSlotValue(handlerInput.requestEnvelope, 'year');



        let speechOutput = schuetzenfest.lastSchuetzenfest(new Date(year, 0, 1));

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    }
};

const AskForTheThroneIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskForTheThrone';
    },
    handle(handlerInput) {
        const year = Alexa.getSlotValue(handlerInput.requestEnvelope, 'year');

        let speechOutput = schuetzenfest.throneInfo(year);

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    }
};

const AskForTheThroneTwoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskForTheThroneTwo';
    },
    handle(handlerInput) {
        const years = Alexa.getSlotValue(handlerInput.requestEnvelope, 'years');

        let speechOutput = schuetzenfest.throneInfo2(years);

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    }
};

const HowManyDaysIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowManyDays';
    },
    handle(handlerInput) {
        let speakOutput = schuetzenfest.daysUntilNext();

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const AskForTheKingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskForTheKing';
    },
    handle(handlerInput) {
        const year = Alexa.getSlotValue(handlerInput.requestEnvelope, 'year');

        let speechOutput = schuetzenfest.kingInfo(year);

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    }
};

const AskForTheKingTwoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskForTheKingTwo';
    },
    handle(handlerInput) {
        const years = Alexa.getSlotValue(handlerInput.requestEnvelope, 'years');

        let speechOutput = schuetzenfest.kingInfo2(years);

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    }
};

const MonthOfJulyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MonthOfJuly';
    },
    handle(handlerInput) {
        const output = "Wenn im Monat Juli die Schützen ziehen aus, dann ist in Friäkens niemand mehr zu Haus."
        
        return handlerInput.responseBuilder
            .speak(output)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Du kannst mich fragen, in wie vielen Tagen das nächste Schützenfest stattfindet! Wie kann ich dir helfen?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Auf Wiedersehen!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Darauf habe ich leider keine Antwort.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `Du hast gerade ${intentName} gestartet`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Entschuldigung, es sieht so aus als hätte ich dich nicht richtig gehört. Bitte versuche es erneut.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

const LoggingResponseInterceptor = {
    process(response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AskForNextEventIntentHandler,
        AskForLastEventIntentHandler,
        AskForTheKingIntentHandler,
        AskForTheKingTwoIntentHandler,
        AskForTheThroneIntentHandler,
        AskForTheThroneTwoIntentHandler,
        GreetingIntentHandler,
        GreetingTwoIntentHandler,
        HowManyDaysIntentHandler,
        MonthOfJulyIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addRequestInterceptors(
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
    