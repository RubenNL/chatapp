export default class Authentication {
	constructor(connection,sign) {
		this.connection=connection;
		this.sign=sign;
		connection.subscribe(this._onMessage)
	}
	_onMessage(message) {
		console.log('received:',message)
		if(message.type=="signMessage") {
			sign.sign(message.message)
				.then(signature=>btoa(String.fromCharCode(...new Uint8Array(signature))))
				.then(signature=>{
					console.log('sending signature',signature)
					connection.send({signature})
				})
		}
	}
}
