/**
 * @description
 * Firebase Command Extension For DroidScript
 * 
 * @authors D. Hurren, O. Koore
 * 
 * @license Apache V2
 * 
 * @version 0.0.1
 * 
 * @information
 * https://github.com/firebase/firebase-tools
 * https://github.com/firebase/firebase-tools/tree/master/src/commands
 * minor tweaks done to firebase-tools/lib/commands/login.js 
 * and firebase-tools//lib/logger.js
 * therefore download node modules from androidscript.org/alpha/Firebase/
 */

var isFirebaseLoaded = false
var curProjId, client;

/**
 * Prevent Exiting Without Signal
 */
process.on("SIGINT", function () {
    console.log("Received exit signal");
});

//Load Firebase 

const init = (cb) => isFirebaseLoaded ? cb() : loadFirebase(cb);

const loadFirebase = function (cb){
    console.log( "Loading Firebase..." )
    process.env.GOOGLE_APPLICATION_CREDENTIALS =
    process.env.DS_DIR + "/.keys/" + 
    process.env.DS_PROJECT + "/firebase-key.json"

    process.env.XDG_CONFIG_HOME = 
    process.env.DS_DATA_DIR + 
    "/.DroidScript/Firebase/" + process.env.DS_PROJECT
    
    client = require("firebase-tools")
    isFirebaseLoaded = true
    
    //Get project id (will only be one as we use project service key)
    client.projects.list()
    .then((data) => { 
        curProjId = data[0]?.projectId
        console.log( "Project Id = " + curProjId ) 
        cb()
    })
    .catch((err) => { console.log( err.toString() ) }) 
}


const login = function () {
    init( ()=>{
        client.logger.logger.reset()
        client.login( { localhost:true } )
        .then((data) => { console.log( data ) })
        .catch((err) => { console.log( err.toString() ) })
    })
}

const list = function () {
    init( ()=>{
        client.logger.logger.reset()
        client.projects.list()
        .then((data) => { console.log( data ) })
        .catch((err) => { console.log( err.toString() ) })   
    })
}

//Set default Firebase project.
const use = function ( projId ) {
    var conf = process.env.DS_DIR+"/"+process.env.DS_PROJECT+"/firebase.json"
    
    init( ()=>{
        console.log( "Setting config: " + conf )
        client.logger.logger.reset()
        client.use( projId, {project:projId, config:conf} )
        .then((data) => { console.log( data ) })
        .catch((err) => { console.log( err.toString() ) })  
    })
}

//Get default Firebase project.
const using = function () {
    init( ()=>{
        client.logger.logger.reset()
        client.projects.list()
        .then((data) => { console.log( data[0]?.projectId ) })
        .catch((err) => { console.log( err.toString() ) })   
    })
}

const serv = function () {
    var conf = process.env.DS_DIR+"/"+process.env.DS_PROJECT+"/firebase.json"
    console.log( "Setting config: " + conf )
   
    init( ()=>{
        console.log( "Serving on port 5000..." )
        client.logger.logger.reset()
        client.serve( { project:curProjId, config:conf, port:5000, only:"hosting"} )
        .then((data) => { console.log( data ) })
        .catch((err) => { console.log( err.toString() ) })
    })
}

/* For Users Who Will Type serve instead of serv */
const serve = () =>{
    serv();
}

const deploy = function () {
    
    var conf = process.env.DS_DIR+"/"+process.env.DS_PROJECT+"/firebase.json"
    console.log( "Setting config: " + conf )
    
    init( ()=>{
        console.log( "Deploying to Firebase..." )
        client.logger.logger.reset()
        client.deploy( { project:curProjId, config:conf} )
        .then((data) => { console.log( "Done! "+ JSON.stringify(data) ) })
        .catch((err) => { console.log( err.toString() ) }); 
    })
}
  


