package utils

import java.util.Date
import java.text.SimpleDateFormat

import play.Logger

object Conversion {

  def toBoolean(v: Long): Boolean = if (v==0) false else true

  def toBoolean(v: String): Boolean = List("on", "1", "-1", "true", "yes").contains(v.toLowerCase)

  def toLong(v: Boolean): Long = if (v==true) 1 else 0

  def toDate(date: String, format: String = "yyyy-MM-dd hh:mm:ss"): Option[Date] = {

    val dateFormat = new SimpleDateFormat(format)
    try {
      Some(dateFormat.parse(date))
    } catch {
      case e => None
    }

  }

}
