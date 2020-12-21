import db from "./db.js"
class User {
	constructor(id,name,key) {
		this.id=id;
		this.name=name;
		this.key=key;
		db.users.put(this)
	}
	_storeMessage(message) {
		return db.messages.put({user:this.id,message:message})
	}
	send(message) {
		this.getKey().then(key=>window.encryption.encrypt(key,message)).then(message=>{
			console.log(message)
			window.connection.send({type:"sendTo",dest:this.id,message:message})
		})
		this._storeMessage(message);
	}
	received(message) {
		this._storeMessage(message);
		console.log('received from',this.id,message)
	}
	get messages() {
		if(!this._messages) this._messages=JSON.parse(this._storage.value||'[]')
		return this._messages;
	}
	downloadKey() {
		return fetch('/api/user/'+this.id).then(response=>response.text()).then(key=>{
			this.key=key
			return key
		})
	}
	lastMessages() {
		return db.messages.where('user').equals(this.id).limit(10)
	}
	getKey() {
		if(this._key) return Promise.resolve(this._key)
		else return this.downloadKey()
	}
	set key(key) {
		db.users.update(this.id,{key:key});
	}
}
db.users.mapToClass(User)
export default User
