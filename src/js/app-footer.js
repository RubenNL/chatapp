import {css, LitElement, html} from "lit-element";

export class appFooter extends LitElement {
static get styles(){
	//language=CSS
	return css`
		:host {
			height: 150px;
			background-color: #fff;
			padding: 10px;
			display: block;
			border-radius: 5px; 
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
			text-align: center;
			align-content: center;
		}
		:host > a:nth-child(1){
			width: 50px;
			margin: 0 auto;
			display: block;
		}
		:host > a > img{
			margin: 0 auto;
			display: block;
		}
	`
}

render() {
	return html`
			<a href="/images/github.png"><img src="https://github.com/RubenNL/chatapp" alt="Github link" width="50" height="50" class="align-content-center"/></a>
			<p>© 2020 - Ruben van Dijk</p>
		`;
	}

}

customElements.define('app-footer', appFooter)
