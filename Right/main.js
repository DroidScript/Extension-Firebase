//Main class for the app
class Main extends App
{
    //Called when app starts.
    onStart()
    {
        ui.setTheme('dark')
        //Add main layout and set default child margins.
        this.main = ui.addLayout( "main", "linear", "fillxy" )
        this.main.backColor = "#313132"
      
        this.apb = ui.addAppBar(this.main, "DroidScript Firebase Extension", "Fixed", 1)
        this.apb.backColor = "#313132"
    }

}