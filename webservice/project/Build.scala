import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

    val appName         = "webservice"
    val appVersion      = "1.1"

    val appDependencies = Seq(
      jdbc, anorm
    )

    val main = play.Project(appName, appVersion, appDependencies).settings(
      // Add your own project settings here
    )

}
