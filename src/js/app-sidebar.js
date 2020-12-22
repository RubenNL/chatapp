import db from "./db.js"
import {LitElement, html, css} from 'lit-element';
import './app-sidebar-user.js'
export class appSidebar extends LitElement {
	static get properties() {
		return {
			users: {type:Array}
		}
	}
	constructor() {
		super();
		this.users=[]
		db.users.orderBy('id').eachPrimaryKey(key=>this.users.push(key)).then(()=>this.requestUpdate())
		db.users.hook('creating',(primKey,obj,transaction)=>{
			this.users.push(primKey)
			setTimeout(()=>this.requestUpdate(),1)
		})
	}
	render() {
		return html`
			<div id="users">${this.users.map(userId=>html`<app-sidebar-user userId="${userId}"></app-sidebar-user>`)}</div>
			<button @click="${this.addUser}">Nieuw contact</button>
		`
	}
	addUser() {
		const userId=prompt('userId')
		if(userId) db.users.put({id:userId})
	}
}

customElements.define('app-sidebar', appSidebar);
