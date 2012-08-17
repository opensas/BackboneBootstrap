rem # java %* -cp "./lib/*;" play.core.server.NettyServer "."
java -Dhttp.port=9001 -DapplyEvolutions.default=true -cp "./lib/*;" play.core.server.NettyServer "."