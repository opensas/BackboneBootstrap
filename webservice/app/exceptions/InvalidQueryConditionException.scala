package exceptions

/**
 * Created with IntelliJ IDEA.
 * User: sas
 * Date: 6/6/12
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */

case class InvalidQueryConditionException(msg: String=null, e: Throwable=null) extends RuntimeException(msg, e)
