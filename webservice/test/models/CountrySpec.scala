package test.models

import org.specs2.mutable._
import org.specs2.mutable.After

import play.api.test._
import play.api.test.Helpers._

class CountrySpec extends org.specs2.mutable.Specification {

  import models.Country

  "Country model" should {

    "be retrieved by id" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {
        val Some(country) = Country.findById(12)

        println("country: %s".format(country.toString))

        country must not be none
        country.code must equalTo("AR")
        country.name must equalTo("Argentina")

        val noneCountry: Option[Country] = Country.findById(5000)
        noneCountry must be none //equalTo(None)
      }
    }
  }

}