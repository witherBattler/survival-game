let canvas
let currentDisplayState = ""
let currentDisplayData = {}


let displayStateTemplates = {
    startupAnimationFadeIn: {
        updateFunction: function () {
            if(currentDisplayData.darknessValue > 80) {
                currentDisplayData.darknessValue = Math.max(currentDisplayData.darknessValue / 100, 0.5)
            }
            background(color(currentDisplayData.darknessValue, currentDisplayData.darknessValue, currentDisplayData.darknessValue))
        },
        setupFunction: function () {console.log("asd")},
        displayData: {darknessValue: 255}
    }
}

function setState(stateName) {
    if(typeof displayStateTemplates[stateName] != "object") {
        throw new Error("\"" + stateName + "\"" + " stateName is not an object in displayStateTemplates.")
    }else if(displayStateTemplates[stateName] == null) {
        throw new Error("\"" + stateName + "\"" + " stateName is null in displayStateTemplates.")
    }else if(typeof displayStateTemplates[stateName].updateFunction != "function") {
        throw new Error("updateFunction property of " + "\"" + stateName + "\"" + " in displayStateTemplates is not a function. It has to be of type function.")
    }else if(displayStateTemplates[stateName].updateFunction == null) {
        throw new Error("updateFunction property of " + "\"" + stateName + "\"" + "in displayStateTemplates is null. It has to be of type function.")
    }else if(typeof displayStateTemplates[stateName].setupFunction != "function") {
        throw new Error("setupFunction property of " + "\"" + stateName + "\"" + " in displayStateTemplates is not a function. It has to be of type function.")
    }else if(displayStateTemplates[stateName].setupFunction == null) {
        throw new Error("setupFunction property of " + "\"" + stateName + "\"" + "in displayStateTemplates is null. It has to be of type function.")
    }else if(typeof displayStateTemplates[stateName].displayData != "function") {
        throw new Error("setupFunction property of " + "\"" + stateName + "\"" + " in displayStateTemplates is not an object. It has to be of type object.")
    }else if(displayStateTemplates[stateName].displayData == null) {
        throw new Error("setupFunction property of " + "\"" + stateName + "\"" + "in displayStateTemplates is null. It has to be of type object.")
    }
    
    currentDisplayData = displayStateTemplates[stateName].displayData
    currentDisplayState = stateName
    displayStateTemplates[stateName].setupFunction()
}


function setup() {
    canvas = createCanvas(1024, 576)
    canvas.id("mainCanvas")
    setState("startupAnimationFadeIn")
}

function draw() {
    displayStateTemplates[currentDisplayState].updateFunction()
}