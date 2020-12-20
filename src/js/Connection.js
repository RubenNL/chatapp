import ReconnectingWebSocket from 'reconnecting-websocket';
import CustomStorage from "./CustomStorage.js";
export default class Connection {
	constructor(encryption) {
		this.rws=new ReconnectingWebSocket((location.protocol=="http:"?'ws://':'wss://')+(location+'').split('/')[2]+'/ws?user='+(new CustomStorage('userId')).value);
		this.rws.addEventListener('open',this.onOpen);
		this.rws.addEventListener('message',this._onMessage.bind(this));
		this.subscribers=[];
		this.encryption=encryption;
	}
	onOpen() {
		console.log('onOpen')
	}
	subscribe(listener) {
		this.subscribers.push(listener)
	}
	_onMessage(message) {
		message=JSON.parse(message.data);
		this.subscribers.forEach(subscriber=>subscriber(message));
		if(message.type=="encrypted") this.encryption.decrypt(message.message).then(message=>console.log(message))
	}
	send(message) {
		this.rws.send(JSON.stringify(message))
	}
}
