//1024, 576
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
let currentDisplayState = ""
let currentDisplayData = {}
let displayStateTemplates = {
    startupAnimationFadeIn: {
        updateFunction: function () {
            if(currentDisplayData.rednessValue < 160) {
                currentDisplayData.rednessValue += 0.5;
            }else {
                setState("mainMenu")
                return;
            }
            background(currentDisplayData.rednessValue, 0, 0)
        },
        setupFunction: function () {},
        displayData: {rednessValue: 0}
    },
    mainMenu: {
        updateFunction: function() {
            background(160, 0, 0)
        },
        setupFunction: function() {},       
        displayData: {}
    },
    mainGame: {
        updateFunction: function() {},
        setupFunction: function() {
            background(color(112, 112, 112))
            pointerCursor = false;
        },
        //Sanity is used for more advanced effects generation.
        displayData: {sanity: 100}
    },
    
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
    }else if(typeof displayStateTemplates[stateName].displayData != "object") {
        throw new Error("displayData property of " + "\"" + stateName + "\"" + " in displayStateTemplates is not an object. It has to be of type object.")
    }else if(displayStateTemplates[stateName].displayData == null) {
        throw new Error("displayData property of " + "\"" + stateName + "\"" + "in displayStateTemplates is null. It has to be of type object.")
    }
    
    currentDisplayData = displayStateTemplates[stateName].displayData
    currentDisplayState = stateName
    displayStateTemplates[stateName].setupFunction()
}





let canvas
let youMurdererFont
let playButton
let mainMenuGroupButtons
let pointerCursor = false;
let mainCharacter
let mainCharacterAnimations = {}
let mainCharacterGroup
let grassImage

function preload() {
    youMurdererFont = loadFont("fonts/youMurderer.otf")
    mainCharacterAnimations.frontRight.idle = loadImage("images/mainCharacter/frontRight/idle.png")
    mainCharacterAnimations.frontRight.walking = loadAnimation("images/mainCharacter/frontRight/walking0.png", "images/mainCharacter/frontRight/walking1.png")
    mainCharacterAnimations.backRight.idle = loadImage("images/mainCharacter/backRight/idle.png")
    mainCharacterAnimations.backRight.walking = loadAnimation("images/mainCharacter/backRight/walking0.png", "images/mainCharacter/backRight/walking1.png")
    grassImage = loadImage("images/grass.png")
}

function setup() {
    canvas = createCanvas(1024, 576)
    canvas.id("mainCanvas")

    setState("startupAnimationFadeIn")

    

    //playButton
    playButton = new Sprite(512, 238, 476, 75)
    playButton.shapeColor = "black"
    playButton.mouseActive = true
    playButton.setCollider("rectangle")

    //mainCharacter
    mainCharacter = new Sprite(512, 384, 1, 1)
    mainCharacter.addAnimation("frontRightWalking", mainCharacterAnimations.frontRight.walking)
    mainCharacter.addAnimation("backRightWalking", mainCharacterAnimations.backRight.walking)
    mainCharacter.addImage("frontRightIdle", mainCharacterAnimations.frontRight.idle)
    mainCharacter.changeAnimation("frontRightIdle", mainCharacterAnimations.backRight.idle)
    mainCharacter.scale = 7
    mainCharacterGroup = new Group()
    mainCharacterGroup.add(mainCharacter)

    //Groups
    mainMenuGroupButtons = new Group()
    mainMenuGroupButtons.add(playButton)

    frameRate(60)
}

function draw() {
    displayStateTemplates[currentDisplayState].updateFunction()
    if(pointerCursor) {
        cursor("pointer")
    }else {
        cursor("normal")
    }
    if(["startupAnimationFadeIn", "mainMenu"].includes(currentDisplayState)) {
        fill(color(0, 0, 0))
        textFont(youMurdererFont)
        textAlign(CENTER, CENTER)
        textSize(130)
        text("The Mutation", 512, 100)


        //Play Button on hover before drawing button
        playButton.mouseUpdate()
        if(playButton.mouseIsOver){playButton.shapeColor = "white"}else {playButton.shapeColor = "black"}


        drawSprites(mainMenuGroupButtons)


        fill("black")
        textSize(50)
        if(playButton.mouseIsOver){fill("black"); pointerCursor = true;}else {fill("white")}
        text("Play Game", playButton.position.x, playButton.position.y)
        stroke("black")
        strokeWeight(10)
        noFill()
        rectMode(CENTER)
        rect(playButton.position.x, playButton.position.y, playButton.width, playButton.height)
        if(playButton.mouseIsPressed) {
            setState("mainGame")
        }
    } else if(["mainGame"].includes(currentDisplayState)){
        var firstXForGrass = Math.floor((camera.position.x - 512) / 400) * 400
        var firstYForGrass = Math.floor((camera.position.y - 400) / 400) * 400
        for(var x = 0; x != 5; x++) {
            for(var y = 0; y != 5; y++) {
                image(grassImage, firstXForGrass + 400 * x, firstYForGrass + 400 * y)
            }
        }
        
        if(keyDown(87)) {
            mainCharacter.position.y -= 5
            camera.position.y -= 5
        }
        if(keyDown(83)) {
            mainCharacter.position.y += 5
            camera.position.y += 5
        }
        if(keyDown(65)) {
            mainCharacter.mirrorX(-1)
            mainCharacter.position.x -= 5
            camera.position.x -= 5
        }
        if(keyDown(68)) {
            mainCharacter.mirrorX(1)
            mainCharacter.position.x += 5
            camera.position.x += 5
        }
        noSmooth()
        drawSprites(mainCharacterGroup)
    }
    if(pointerCursor) {
        cursor("pointer")
    }else {
        cursor(ARROW)
    }
    pointerCursor = false;
}
//1024, 576