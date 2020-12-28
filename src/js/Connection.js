import ReconnectingWebSocket from 'reconnecting-websocket';
import db from "./db.js"
export default class Connection {
	constructor(encryption) {
		this.rws=new ReconnectingWebSocket((location.protocol=="http:"?'ws://':'wss://')+(location+'').split('/')[2]+'/ws?user='+window.localStorage.getItem('userId'));
		this.rws.addEventListener('open',this.onOpen.bind(this));
		this.rws.addEventListener('message',this._onMessage.bind(this));
		this.subscribers=[];
		this.encryption=encryption;
	}
	onOpen() {
		JSON.parse(window.localStorage.getItem('waiting')||'[]').forEach(this.send.bind(this))
		window.localStorage.removeItem('waiting')
	}
	subscribe(listener) {
		this.subscribers.push(listener)
	}
	_onMessage(message) {
		window.localStorage.setItem('lastConnected',+new Date)
		message=message.data
		if(message.length==0) {
			this.rws.send('')
			return
		}
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
		if(this.rws.readyState==this.rws.OPEN) {
			window.localStorage.setItem('lastConnected',+new Date)
			this.rws.send(JSON.stringify(message))
		} else {
			const messagesWaiting=JSON.parse(window.localStorage.getItem('waiting')||'[]')
			messagesWaiting.push(message)
			window.localStorage.setItem('waiting',JSON.stringify(messagesWaiting))
		}
	}
	get lastConnection() {
		if(this.rws.readyState==this.rws.OPEN) return +new Date
		else return window.localStorage.getItem('lastConnected')
	}
}
