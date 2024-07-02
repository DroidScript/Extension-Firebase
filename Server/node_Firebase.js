/*
Description: Firebase Command extension for DroidScript
Author(s): D.Hurren, you?
Copyright: droidscript.org
License: Apache V2

Useful resources:
  https://github.com/firebase/firebase-tools
  https://github.com/firebase/firebase-tools/tree/master/src/commands
  Note: minor tweaks done to firebase-tools/lib/commands/login.js and firebase-tools//lib/logger.js
*/

//Globals
var firebaseLoaded = false;
var client = null;
var curProjId = null;

//Prevent process exiting on errors.
process.on("SIGINT", function () {
    console.log("Received exit signal");
});

//Load Firebase tools (if not already done).
function init(callback) {
    if (!firebaseLoaded) {
        //Load firebase.
        console.log("Loading Firebase...");
        process.env.GOOGLE_APPLICATION_CREDENTIALS =
            process.env.DS_DIR +
            "/.keys/" +
            process.env.DS_PROJECT +
            "/firebase-key.json";
        process.env.XDG_CONFIG_HOME =
            process.env.DS_DATA_DIR +
            "/.DroidScript/Firebase/" +
            process.env.DS_PROJECT;
        process.env.DEBUG = false;
        client = require("firebase-tools");
        firebaseLoaded = true;

        //Get project id (will only be one as we use project service key)
        client.projects
            .list()
            .then((data) => {
                curProjId = data[0]?.projectId;
                console.log("Project Id = " + curProjId);
                callback();
            })
            .catch((err) => {
                console.log(err.toString());
            });
    } else callback();
}

//Login to Firebase (not required if using local creds).
function login() {
    init(() => {
        client.logger.logger.reset();
        client
            .login({ localhost: true })
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err.toString());
            });
    });
}

//List all Firebase projects.
function list() {
    init(() => {
        client.logger.logger.reset();
        client.projects
            .list()
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err.toString());
            });
    });
}

//Set default Firebase project.
function use(projId) {
    var conf =
        process.env.DS_DIR + "/" + process.env.DS_PROJECT + "/firebase.json";

    init(() => {
        console.log("Setting config: " + conf);
        client.logger.logger.reset();
        client
            .use(projId, { project: projId, config: conf })
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err.toString());
            });
    });
}

//Get default Firebase project.
function using() {
    init(() => {
        client.logger.logger.reset();
        client.projects
            .list()
            .then((data) => {
                console.log(data[0]?.projectId);
            })
            .catch((err) => {
                console.log(err.toString());
            });
    });
}

//Start local test http server for project.
//(projId is optional, defaults to current 'using' project)
function serv() {
    var conf =
        process.env.DS_DIR + "/" + process.env.DS_PROJECT + "/firebase.json";
    console.log("Setting config: " + conf);

    const fs = require("fs");
    var publicDir =
        process.env.DS_DIR + "/" + process.env.DS_PROJECT + "/public";
    if (!fs.existsSync(publicDir)) {
        console.log("Error: No 'public' folder exists in this project");
        return;
    }

    init(() => {
        console.log("Serving on port 5000...");
        client.logger.logger.reset();
        client
            .serve({
                project: curProjId,
                config: conf,
                port: 5000,
                only: "hosting",
            })
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err.toString());
            });
    });
}

//Deploy project to firebase server (reads local firebase.json file)
//(projId is optional, defaults to current 'using' project)
function deploy() {
    var conf =
        process.env.DS_DIR + "/" + process.env.DS_PROJECT + "/firebase.json";
    console.log("Setting config: " + conf);

    init(() => {
        console.log("Deploying to Firebase...");
        client.logger.logger.reset();
        client
            .deploy({ project: curProjId, config: conf })
            .then((data) => {
                console.log("Done! " + JSON.stringify(data));
            })
            .catch((err) => {
                console.log(err.toString());
            });
    });
}
