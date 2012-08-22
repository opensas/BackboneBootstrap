package models

import play.api.http.Status

case class Error(
  val status: Int = Status.INTERNAL_SERVER_ERROR,
  val errorCode: Int = 10000,
  val field: String = "",
  val message: String = "Error performing operation",
  val developerMessage: String = "Error performing operation"
)