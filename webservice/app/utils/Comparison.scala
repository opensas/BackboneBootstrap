package utils

import java.util.Date
import java.text.SimpleDateFormat

import play.Logger

import anorm.Pk

class ComparableWithIsOneOf[T](val value: T) {
  def isOneOf(values: List[T]): Boolean = {
    values.contains(value)
  }
  
  def isOneOf(values: T*): Boolean = {
    values.contains(value)
  }
}

object Comparison {
  object implicits {
    implicit def AnyToComparableWithIsOneOf[T](value: T): ComparableWithIsOneOf[T] = {
      return new ComparableWithIsOneOf(value)
    }
  }
}

