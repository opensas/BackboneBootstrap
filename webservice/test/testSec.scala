package test

import org.specs2.mutable._
import org.specs2.specification.{BeforeExample, BeforeAfterExample}

  class ContextSpec extends Specification with BeforeAfterExample {
    lazy val message = "Hola"
    def now = new java.util.Date().toString
    def before = println("before executing (%s)".format(now))
    def after = println("after executing (%s)".format(now))

    "this is the first example" in {
      message must have size(4)
    }
    "this is the first example" in {
      message must be equalTo("Hola")
    }
  }

  trait context extends BeforeAfter {
    lazy val message = "Hola"
    def now = new java.util.Date().toString
    def before = println("before executing (%s)".format(now))
    def after = println("after executing (%s)".format(now))
  }