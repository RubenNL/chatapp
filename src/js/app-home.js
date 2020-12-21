import {css, html, LitElement} from 'lit-element';

class AppHome extends LitElement {
	render() {
		//language=HTML
		return html`<h1>Home</h1><br>
		ID: <code>${window.localStorage.getItem('userId')}</code><br>
		public Key: <code>${JSON.parse(window.localStorage.getItem('encryptKey')).n}`;
	}
}

window.customElements.define('app-home', AppHome);
