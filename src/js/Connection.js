import ReconnectingWebSocket from 'reconnecting-websocket';
import db from "./db.js"
export default class Connection {
	constructor(encryption,userList) {
		this.rws=new ReconnectingWebSocket((location.protocol=="http:"?'ws://':'wss://')+(location+'').split('/')[2]+'/ws?user='+window.localStorage.getItem('userId'));
		this.rws.addEventListener('open',this.onOpen);
		this.rws.addEventListener('message',this._onMessage.bind(this));
		this.subscribers=[];
		this.encryption=encryption;
		this.userList=userList;
	}
	onOpen() {
		console.log('onOpen')
	}
	subscribe(listener) {
		this.subscribers.push(listener)
	}
	_onMessage(message) {
		message=message.data
		if(message.length==0) {
			this.rws.send('')
			return
		}
		console.log(message)
		message=JSON.parse(message);
		this.subscribers.forEach(subscriber=>subscriber(message));
		if(message.type=="encrypted") this.encryption.decrypt(message.message).then(message=>{
			db.users.get(message.from).then(user=>{
				if(user==null) return db.users.put({id:message.from}).then(()=>db.users.get(message.from))
				return user;
			}).then(user=>user.received(message.message))
		})
	}
	send(message) {
		this.rws.send(JSON.stringify(message))
	}
}
