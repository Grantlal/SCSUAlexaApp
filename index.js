// Developers: Grant LaLonde
// Add your names here if you worked on it:
// This is a proof of concept in order to assist students on 
// campus with a multitude of different problems. 
// Some of these include: Grades, Movies, and Food. 
const Alexa = require('ask-sdk-core');

const SKILL_NAME = 'Course Grades';
const GET_GRADE_MESSAGE = "Your grade is: ";
const HELP_MESSAGE = 'You can ask what is grade or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'See ya!';
const MORE_MESSAGE = 'Is there anything else I can help with?';
const INTRO_MESSAGE = 'Welcome to the Saint Cloud Alexa Application';


//Course grade Data
const OS_Grades = [
    'A ',
    'B ',
];

//Movies list
const Movie_List = [
    'Avengers: Endgame',
    'Detective Pikachu',
    'Mean Girls', 
    ];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = getGrade();
        return handlerInput.responseBuilder
            .speak(INTRO_MESSAGE)
            .getResponse();
    }
};

const getGradeHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetCourseGrade';
    },
    handle(handlerInput) {
        const speechText = getGrade();
        return handlerInput.responseBuilder
            .speak(speechText.speach)
            .reprompt(speechText.reprompt)
            .getResponse();
    }
};

const getMovieHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetMovies';
    },
    handle(handlerInput) {
        const speechText = getMovies();
        return handlerInput.responseBuilder
            .speak(speechText.speach)
            .reprompt(speechText.reprompt)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent')
    },
    handle(handlerInput) {
        const speechText = getGrade();
        return handlerInput.responseBuilder
            .speak(speechText.speach)
            .reprompt(speechText.speach)
            .getResponse();
    }
};

const NoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent')
    },
    handle(handlerInput) {
        const speechText = STOP_MESSAGE;
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

//Function to find grades in grade list.
function getGrade() {
    const initial_phrase = "In operating systems you currently have a ";
    const grades = OS_Grades;
    const grade_received = grades[1];
    const speachOutput = initial_phrase + grade_received;
    const more = MORE_MESSAGE;
    return {speach: speachOutput, reprompt: more};
}

//Fuction to find movies playing
function getMovies() {
    const movieNames = Movie_List;
    const ListofMovies = movieNames[0] + ", " + movieNames[1] + ", and " + movieNames[2];
    const openPhrase = "Some of the movies playing right now are: ";
    const more = MORE_MESSAGE;
    const SpeachOutput = openPhrase + ListofMovies;
    return {speach: SpeachOutput, reprompt: more};
}

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        getGradeHandler,
        getMovieHandler,
        YesIntentHandler, 
        NoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
