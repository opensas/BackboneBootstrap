package utils

import java.util.Calendar

object Validate {

  def isEmptyWord(value: String): Boolean = {
    "[a-zA-Z]".r.findFirstIn(value).isEmpty
  }

  def isNumeric(value: String): Boolean = {
    value.forall(_.isDigit)
  }

  def currentYear: Int = Calendar.getInstance().get(Calendar.YEAR);

}