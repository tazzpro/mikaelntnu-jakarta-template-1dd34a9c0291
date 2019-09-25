import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import {createUser} from "./service.mjs";


export class CreateUserComponent extends LitElement {
    static get properties() {
        return {
            createuser: {type: Function}
        }
    }

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
        `
    }

    constructor() {
        super();
        this.createuser = () => console.log('Default createuser');
        this.errormessage = '';
    }

    render() {
        return html`
            <link rel="stylesheet" href="styles.css">
            <h2>Create User</h2>
            <div class="login">
                <label for="firstname">Firstname</label>
                <input id="firstname" placeholder="Firstname"/>
    
                <label for="lastname">Lastname</label>
                <input id="lastname" placeholder="Lastname"/>
    
                <label for="street">Street address</label>
                <input id="street" placeholder="Street and number"/>
    
                <label for="city">City</label>
                <input id="city" placeholder="City"/>
    
                <label for="postalcode">Postal code</label>
                <input id="postalcode" placeholder="Postal code"/>
    
                <label for="email">Email address</label>
                <input id="email" placeholder="Email address"/>
    
                <label for="uid">Userid</label>
                <input id="uid" placeholder="Userid"/>
    
                <label for="pwd">Password</label>
                <input id="pwd" type="password" placeholder="Password"/>
            </div>
            <button id="login" class="button" @click="${e=>this.doCreateUser(e)}">Create User</button>
            <div class="errormessage">${this.errormessage}</div>
            `
    }

    doCreateUser(e) {
        createUser({
            firstname: this.renderRoot.getElementById('firstname').value,
            lastname: this.renderRoot.getElementById('lastname').value,
            street: this.renderRoot.getElementById('street').value,
            city: this.renderRoot.getElementById('city').value,
            postalcode: this.renderRoot.getElementById('postalcode').value,
            email: this.renderRoot.getElementById('email').value,
            userid: this.renderRoot.getElementById('uid').value,
            password: this.renderRoot.getElementById('pwd').value
        })
        .then(() => {
            this.errormessage = '';
            this.requestUpdate();
        })
        .catch((e)=> {
            this.errormessage = e;
            this.requestUpdate();
        })
    }
}
customElements.define('fant-createuser', CreateUserComponent);