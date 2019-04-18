// Developers: Grant LaLonde
// Add your names here if you worked on it: 
// This is a proof of concept in order to assist students on 
// campus with a multitude of different problems. 
// Some of these include: Grades, Movies, and Food. 

const Alexa = require('ask-sdk-core');

const SKILL_NAME = 'SCSU Application';
const HELP_MESSAGE = 'You can ask what is my grade or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'See ya!';
const MORE_MESSAGE = 'Is there anything else I can help with?';
const INTRO_MESSAGE = 'Welcome to the Saint Cloud State Alexa Application';
const amount_of_grades = 5;
const dynamoDBTableName = "SchoolData";


// Data sets used for debugging when dynamo server was acting up
// Grades achieved in Construction
const construction_grades = [100, 80, 64, 40, 600];
const qa_grades = [100, 90, 90, 75, 600];
const systems_grades = [50, 50, 60, 63, 600];

// Events

const EventList = [
    'German Cultural Night, April 20th',
    'Design your future workshop, April 22th',
    ];
    
const restaraunts = [
    'Chik-fil-a',
    'The Den', 
    'Erberts and Gerberts'
    ];

// Overall grade for Construction
const Construction_Grade = [
    'C+',
    ];
    
// Course grade for quality
const Quality_Grades = [
    'B-',
    'A-',
    'B+',
    'C-',
    ];

// Course grade Data
const OS_Grades = [
    'D',
    'B',
    ];

// Movies list
const Movie_List = [
    'Toy Story',
    'Will Smith on Ice',
    'Mean Girls', 
    ];


//This is the intro handler. Basically if the command open scsu is used this will occur. 
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(INTRO_MESSAGE)
            .getResponse();
    }
};

// This is the handler that will call the getgrade funcion to receive grades
// Pres: requires a class name, otherwise it will default to an error message. 
// Post: Outputs whatever grade requester has. 
const getGradeHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetCourseGrade';
    },
    handle(handlerInput) {
        const itemSlot = handlerInput.requestEnvelope.request.intent.slots.class;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }
        const speechText = getGrade(itemName);
        
        return handlerInput.responseBuilder
            .speak(speechText.speach)
            .reprompt(speechText.reprompt)
            .getResponse();
    }
};

// A More simple intent handler. This one just calls getMovies function, 
// It doesn't require any specific slots, and will return a static list of 
// movies. 
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

// The calulate passing intent handler. 
// Pre: Called, and has a proper slot type
// Post: Outputs requirements for class slot to pass 
const calculatePassingHandler = {
        canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CalculatePassing';
    },
    handle(handlerInput) {
        const itemSlot = handlerInput.requestEnvelope.request.intent.slots.class;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }
        const speechText = calculatePass(itemName);
        return handlerInput.responseBuilder
            .speak(speechText.speach)
            .reprompt(speechText.reprompt)
            .getResponse();
    }
    
}

const getEventHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetEvents';
    },
    handle(handlerInput) {
        const speechText = getEvents();
        return handlerInput.responseBuilder
            .speak(speechText.speach)
            .reprompt(speechText.reprompt)
            .getResponse();
    }
};


const getFoodHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetFood';
    },
    handle(handlerInput) {
        const speechText = getFood();
        return handlerInput.responseBuilder
            .speak(speechText.speach)
            .reprompt(speechText.reprompt)
            .getResponse();
    }
};

const orderFoodHandler = {
        canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Order';
    },
    handle(handlerInput) {
        const restarauntSlot = handlerInput.requestEnvelope.request.intent.slots.restaraunt;
        const foodSlot = handlerInput.requestEnvelope.request.intent.slots.food;
        let restaurant, foodItem;
        if (restarauntSlot && restarauntSlot.value) {
            restaurant = restarauntSlot.value.toLowerCase();
        }
        
        if (foodSlot && foodSlot.value) {
            foodItem = foodSlot.value.toLowerCase();
        }
        const speechText = calculateOrderTotal(restaurant, foodItem);
        return handlerInput.responseBuilder
            .speak(speechText.speach)
            .reprompt(speechText.reprompt)
            .getResponse();
    }
}

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

//Intent handler to say yes to request
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

//Intent to handle no to a request
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

//Intent handler to end current session.
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
function getGrade(classtype) {
    //var classtype = this.event.request.intent.slots.class.value;
    let initial_phrase = "In " + classtype + " you have a ";
    var grades = Construction_Grade;
    if (classtype === 'operating systems' || classtype === 'systems' || classtype === 'os') {
        grades = OS_Grades; 
    }
    else if (classtype === 'quality' || classtype === 'software quality') {
        grades = Quality_Grades;
    }
    else if (classtype === 'construction' || classtype === 'software construction'){
        grades = Construction_Grade; 
    }
    else {
        initial_phrase = "I'm sorry, I couldn't find the course: " + classtype;
        grades = ' ';
    }
    const grade_received = grades[0];
    const speachOutput = initial_phrase + grade_received;
    const more = MORE_MESSAGE;
    return {speach: speachOutput, reprompt: more};
}

//Function to find movies playing
function getMovies() {
    const movieNames = Movie_List;
    const ListofMovies = movieNames[0] + ", " + movieNames[1] + ", and " + movieNames[2];
    const openPhrase = "Some of the movies playing right now are: ";
    const more = MORE_MESSAGE;
    const SpeachOutput = openPhrase + ListofMovies;
    return {speach: SpeachOutput, reprompt: more};
}

//Function to calculate what is necessary to pass a classtype
function calculatePass (className) {
    let initial_phrase = "You currently have ";
    let total_achieved = 0;
    let achieved_grades, necessary_pointsA, necessary_pointsB, necessary_pointsC,
    getC, getB, getA, total_points;
    
    //Catch class names, assign variables as required. 
    if(className === 'construction' || className === 'software construction') {
        achieved_grades = construction_grades;
    }
    else if (className === 'quality' || className === 'software quality') {
        achieved_grades = qa_grades; 
    }
    else if (className === 'operating systems' || className === 'systems' || className === 'os') {
        achieved_grades = systems_grades;
    }
    else {
        initial_phrase = "I'm sorry, I couldn't find the course: ";
        return {speach: initial_phrase, reprompt: MORE_MESSAGE};
    }
    
    //Loop to calculate total score of grades
    for (let i = 0; i < amount_of_grades - 1; i++) {
        total_achieved += achieved_grades[i];
    }
    
    initial_phrase += total_achieved + " total points in " + className;
    
    //Start fun calculations
    //Assign the amount of total points in the class
    total_points = achieved_grades[4];
    
    //Assign the total necessary points for an A, B, or C
    necessary_pointsA = total_points * .9;
    necessary_pointsB = total_points * .8;
    necessary_pointsC = total_points * .7;
    
    //Assign the amount of points needed to pass for each grade
    getA = necessary_pointsA - total_achieved;
    getB = necessary_pointsB - total_achieved;
    getC = necessary_pointsC - total_achieved;
    
    //Finally create the new phrases
    initial_phrase += "... to get an A you need " + getA + " more points, ";
    initial_phrase += "to get a B you need " + getB + " more, ";
    initial_phrase += "and to get a C you need " + getC + " more";
    return {speach: initial_phrase, reprompt: MORE_MESSAGE};
}

//Function that returns events happening on campus. 
function getEvents() {
    const Events = EventList;
    const ListofEvents = Events[0] + " and " + Events[1];
    const openPhrase = "Some events happening soon are: ";
    const more = MORE_MESSAGE;
    const SpeachOutput = openPhrase + ListofEvents;
    return {speach: SpeachOutput, reprompt: more};
    
}

//Function to find food on campus
function getFood() {
    const Foods = restaraunts;
    const ListOfRestaraunts = Foods[0] + ", " + Foods[1] + ", and " + Foods[2];
    const openPhrase = "Some restaraunts on campus are: ";
    const more = MORE_MESSAGE;
    const SpeachOutput = openPhrase + ListOfRestaraunts;
    return {speach: SpeachOutput, reprompt: more};
    
}

//Function to calculate what an order total is at a restaraunt. 
function calculateOrderTotal(restaurant, foodItem) {
    let total = 0;
    let multiplier = 1;
    let initial_phrase = "Your total for " + foodItem + " will be: ";
    if (restaurant === 'chikfila') {
        multiplier = 1.2;
    }
    if (restaurant === 'erberts') {
        multiplier = 1.5;
    }
    if(foodItem === 'number1' || foodItem === 'number2' || foodItem === 'chicken') {
        total += 7;
    }
    else if (foodItem === 'nuggets' || foodItem === 'deluxe' || foodItem === 'special')
    {
        total+= 10;
    }
    else
    {
        total += 12;
    } 
    total *= multiplier;
    let minutes = Math.floor(Math.random() * total);
    initial_phrase += total + " dollars, and will be ready for pickup at " + restaurant + " in " + minutes + " minutes";
    const SpeachOutput = initial_phrase;
    return {speach: SpeachOutput, reprompt: MORE_MESSAGE};
}

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        getGradeHandler,
        getMovieHandler,
        calculatePassingHandler,
        getFoodHandler,
        orderFoodHandler,
        getEventHandler,
        YesIntentHandler, 
        NoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
