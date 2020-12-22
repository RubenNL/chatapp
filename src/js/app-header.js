import {css, html, LitElement} from 'lit-element';
import db from './db.js';
class AppHeader extends LitElement {
	render() {
		//language=HTML
		return html`
			<a router-link href="/">
				<img src="/images/logo_512px.png" alt="" width="100px" height="100px">
				<div class="logo-title">
					<h1>Chatapp</h1>
					<h3>gemaakt door Ruben van Dijk.</h3>
				</div>
			</a><button @click="${this.deleteAll}">delete alles(reload nodig!)</button>`;
	}
	deleteAll() {
		db.delete().then(() => {
			window.localStorage.clear();
			alert('alles verwijderd!')
		}).catch((err) => {
			console.error("Could not delete database",err);
			alert('error deleting!')
		});
	}
	static get styles() {
	//language=CSS
	return css`
		a {
			display: flex;
			color: inherit; /* blue colors for links too */
			text-decoration: inherit; /* no underline */
		}
		.logo-title > * {
			text-align: left;
		}
		.logo-title > h3 {
			font-size: 16px;
			margin-top: 1px;
		}
		.logo-title > h1 {
			margin-bottom: 1px;
			font-size: 19px;
		}
		.logo-title {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		@media only screen and (max-width: 470px) {
			.logo-title {
			display: none;
			}
		}
	`
	}
}

window.customElements.define('app-header', AppHeader);
