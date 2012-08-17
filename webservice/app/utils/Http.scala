package utils

import scala.collection.immutable.Map

object Http {

  implicit def toFlatQueryString(queryString: Map[String, Seq[String]]): Map[String, String] = {
    queryString.map { (entry) => (entry._1, entry._2.mkString(",")) }
  }
  
}