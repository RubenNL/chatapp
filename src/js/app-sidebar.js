import {LitElement, html, css} from 'lit-element';

export class appSidebar extends LitElement {
	static get styles() {
		// language=css
		return css`
			:host {
			min-height: 300px;
			color: #383838;
			}
			`;
	}

	render() {
		return html`<h2>Menu</h2>`;
	}
}

customElements.define('app-sidebar', appSidebar);
