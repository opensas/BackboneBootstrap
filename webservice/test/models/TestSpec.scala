package test.models

import org.specs2.mutable._

import play.api.test._
import play.api.test.Helpers._

class ModelSpec extends Specification {

  import _root_.models._

  "Wine model" should {
    
    "be retrieved by id" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {

        val Some(wine) = Wine.findById(1)

        println("wine: %s".format(wine.toString))

        wine.year must equalTo("2009")

      }
    }

  }

}