import {LitElement, html, css} from 'lit-element';
import db from "./db.js"

export class appSidebarUser extends LitElement {
	static get properties() {
		return {
			userId: {type:String},
			name: {type:String},
			lastMessage: {type:Object}
		}
	}
	constructor() {
		super();
		this.userId='';
		this.name=''
		this.lastMessage='';
		this.lastReceived=false;
	}
	firstUpdated() {
		db.users.get(this.userId).then(user=>{
			this.name=user.name;
			this.lastMessage=JSON.parse(user.lastMessage);
		})
		db.users.hook('updating',(modifications,primKey,obj,transaction)=>{
			if(primKey!=this.userId) return
			if(modifications.name) this.name=modifications.name;
			if(modifications.lastMessage) {
				this.lastMessage=JSON.parse(modifications.lastMessage);
				this.requestUpdate();
			}
		})
	}
	render() {
		return html`<a router-link href="/chat/${this.userId}">${this.name||this.userId}</a><br>${this.lastMessage.message}${this.lastMessage.received?'<':'>'}`;
	}
}

customElements.define('app-sidebar-user', appSidebarUser);
