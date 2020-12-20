import {css, html, LitElement} from 'lit-element';

class AppTest extends LitElement {
	render() {
		//language=HTML
		return html`<h1>TEST</h1>`;
	}
}

window.customElements.define('app-test', AppTest);
 
