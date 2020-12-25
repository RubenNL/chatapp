import {css, html, LitElement} from 'lit-element';
import db from "./db.js"
import User from "./User.js"

class AppChat extends LitElement {
	static get properties() {
		return {
			location: {type: Object},
			userId: {type: String},
			messages: {type: Array},
			value: {type:String},
			user: {type:User},
			name: {type:String}
		};
	}
	constructor() {
		super();
		this.value='';
		this.messages=[];
		db.messages.hook('creating',(primKey,obj,transaction)=>{
			if(obj.user==this.userId) {
				this.messages.push(obj);
				this.requestUpdate()
			}
		})
	}
	onBeforeEnter(location, commands, router){
		this.userId=location.params.userId
		//TODO limit to last ~10 messages, lazy loading.
		db.messages.where({user:this.userId}).toArray().then(messages=>this.messages=messages)
		db.users.get(this.userId).then(user=>{
			this.user=user
			this.name=this.user.name;
		})
		db.users.hook('updating',(modifications,primKey,obj,transaction)=>{
			if(primKey!=this.userId) return
			if(modifications.name) this.name=modifications.name;
		})
	}
	render() {
		//language=HTML
		return html`<h1>${this.name||this.userId}</h1>
		<ul class="chatMessages">${
			this.messages.map(message=>html`<li class="chatMessage ${message.received?"him":"me"}">${message.message}</li>`)
		}</ul>
		<form @submit="${this.submit}">
			<input .value="${this.value}" @change="${this.onChange}">
			<input type="submit" value="send">
		</form>
		`;
	}
	onChange(e) {
		this.value=e.srcElement.value;
	}
	submit(event) {
		this.user.send(this.value);
		this.value='';
		event.preventDefault()
	}
	static get styles() {
		//language=CSS
		return css`
			.chatMessage {
				display:inline-block;
				clear: both;
				padding: 20px;
				border-radius: 30px;
				margin-bottom: 2px;
				font-family: Helvetica, Arial, sans-serif;
			}
			.chatMessages {
				list-style: none;
				margin: 0;
				padding: 0;
				overflow-y:scroll;
				clear: both;
			}
			.him{
				background: #eee;
				float: left;
			}
			.me{
				float: right;
				background: #0084ff;
				color: #fff;
			}

			.him + .me{
				border-bottom-right-radius: 5px;
			}
			.me + .him {
				border-bottom-left-radius: 5px;
			}
			.me + .me{
				border-top-right-radius: 5px;
				border-bottom-right-radius: 5px;
			}
			.him + .him{
				border-top-left-radius:5px;
				border-bottom-left-radius: 5px;
			}
			.me:last-of-type {
				border-bottom-right-radius: 30px;
			}
			.me:first-of-type {
				border-bottom-right-radius: 5px;
			}
			.him:last-of-type {
				border-bottom-left-radius: 30px;
			}
			.him:first-of-type {
				border-bottom-left-radius: 5px;
			}`
	}
}

window.customElements.define('app-chat', AppChat);
