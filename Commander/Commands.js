/*
Description: Firebase Command extension for DroidScript
Author(s): D.Hurren, you?
Copyright: droidscript.org
License: Apache V2
*/

//Make sure node sever is running.
function Init() {
    //Start menu server (with unique context id) on first show of 'Firebase' context menu.
    if (!glob[ext_progId]) {
        var dir = "/sdcard/DroidScript/Extensions/Firebase/Server";
        ext_NodeRun(
            dir + "/node_Firebase.js",
            ext_progId,
            dir + "/node_modules",
        );
        glob[ext_progId] = true;
    }
}

//Called when using menus or wifi ide '!firebase' commands.
function Firebase_OnCommand(cmd) {
    Init();

    //Execute menu command in our node node_Firebase.js file.
    ext_NodeExec(cmd.toLowerCase() + "()", ext_progId);
}

//Called when 'Firebase' device context menu is selected.
function Firebase_OnMenu() {
    Init();

    //Show Firebase sub-menus.
    dlgFirebase = app.CreateListDialog("Firebase", "Serv,Deploy");
    dlgFirebase.Show();

    //Handle menu selection.
    dlgFirebase.SetOnTouch((cmd) => {
        //Show fresh debug window.
        app.ShowDebug(true, "dialog,clear");

        //Execute menu command in our node node_Firebase.js file.
        ext_NodeExec(cmd.toLowerCase() + "()", ext_progId);
    });
}
