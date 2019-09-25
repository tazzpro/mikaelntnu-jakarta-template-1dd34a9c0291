import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import {login}  from "./service.mjs";

export class LoginComponent extends LitElement {
    static get styles() {
        return css`
            :host {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            
            .button {
                width: 85%; 
                margin-bottom: 5px;           
            }
            
            a:not([href]) {
                cursor: pointer;
                color: blue;
                text-decoration: underline;
            }
        `
    }

    constructor() {
        super();
        this.errormessage = '';
    }

    render() {
        return html`
            <link rel="stylesheet" href="styles.css">
            <h2>Login</h2>
            <div class="login">
                <label for="uid">User Id:</label>
                <input id="uid" placeholder="Userid"/>
                <label for="pwd">Password:</label>
                <input id="pwd" type="password" placeholder="Password"/>
            </div>
            <button class="button" @click="${this.onLogin}">Login</button>
            <a @click="${this.createNewUser}"">Create new user</a>
            <br>
            <div class="errormessage">${this.errormessage}</div>
         `;
    }

    onLogin() {
        const userid = this.shadowRoot.getElementById('uid').value;
        const password = this.shadowRoot.getElementById('pwd').value;
        login(userid, password)
            .then(() => {
                this.errormessage = '';
                this.requestUpdate();
            })
            .catch((e) => {
                this.errormessage = e;
                this.requestUpdate();
            });
    }

    createNewUser() {
        this.dispatchEvent(new CustomEvent('createuser'));
    }
}
customElements.define('fant-login', LoginComponent);