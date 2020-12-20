export default class User {
	constructor(id,name,key) {
		this.id=id;
		this.name=name;
		this.key=key;
	}
	send(message) {
		window.encryption.encrypt(this.key,message).then(message=>{
			window.connection.send({type:"sendTo",dest:this.id,message:message})
		})
	}
}
