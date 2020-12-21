import {LitElement, html, css} from 'lit-element';

export class appSidebarUser extends LitElement {
	static get properties() {
		return {
			userId: {type:String},
			name: {type:String},
			lastMessage: {type:String}
		}
	}
	firstUpdated() {
		db.users.get(this.userId).then(user=>{
			this.name=user.name;
		})
		db.users.hook('updating',(modifications,primKey,obj,transaction)=>{
			if(primKey!=this.userId) return
			if(modifications.name) this.name=modifications.name;
			if(modifications.lastMessage) this.lastMessage=lastMessage;
		})
	}
	render() {
		return html`<a router-link href="/chat/${this.userId}"><h3>${this.name||this.userId}</h3></a>`;
	}
}

customElements.define('app-sidebar-user', appSidebarUser);
