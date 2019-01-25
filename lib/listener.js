'use strict'

const net = require('net');
this.server = net.createServer(function(socket) {
	socket.pipe(socket);
	global.listener = socket;
});

class listener{
  constructor(opts){
		this.opts = opts;
  }
	start(){
		this.server = net.createServer(function(socket) {
//			global.logger.debug("Client Connected")
			socket.on('end', () => {
//				global.logger.debug('client disconnected');
			});
			socket.on("data",function(e){
				global.p2p.write(e);
				global.iStream.emit("p2p",e);
				socket.emit("end")
			})
		}.bind(this));
		this.server.listen(this.opts.interfacePort, this.opts.localIp,function(){
			global.logger.info("Listening server Started on " + this.opts.localIp + ":" + this.opts.interfacePort)
		}.bind(this));

	}
}


module.exports = listener;
