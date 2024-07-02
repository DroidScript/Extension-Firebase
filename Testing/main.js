/**
 * This is not part of the extensions codebase, its to test undocumented functions
 * in the firebase-tools before adding to the node_Firebase.js file.
 */

const client = require("../Server/node_modules/firebase-tools");

function login() {
    client
        .login({ localhost: true })
        .then((data) => {
            console.log("Login successful:", data);
        })
        .catch((err) => {
            console.log("Login failed:", err.toString());
        });
}

login();
