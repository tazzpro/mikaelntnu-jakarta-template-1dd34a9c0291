import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import Navigo from 'https://unpkg.com/navigo@7.1.2/lib/navigo.es.js'
import {LoginComponent} from './login.mjs';
import {NewItemComponent} from './newitem.mjs';
import {CreateUserComponent} from './createuser.mjs';
import {ItemsViewComponent} from './items.mjs';
import {ItemDetailComponent} from './itemdetail.mjs';
import {addSellable,loadSellables} from "./service.mjs";

// From https://gist.github.com/jed/982883
export function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

export function getItemById(id) {
    return items.find(item =>Number(item.id) === Number(id));
}

export let items = [];

class Fant extends LitElement {
    static get properties() {
        return {
            route: {type: Object}
        };
    }

    constructor() {
        super();
        this.router = new Navigo('/', true, '#!')
        this.router
            .on('login', () => this.route = html`<fant-login></fant-login>`)
            .on('createuser', () => this.route = html`<fant-createuser .createuser="${e=>this.onCreateUser(e)}"></fant-createuser>`)
            .on('items', () => this.route = html`<fant-items .add=${e=>this.onItemAdd()} .select=${e=>this.onItemSelect(e)}></fant-items>`)
            .on('item/:id', (params) => this.route = html`<fant-itemdetail id="${params.id}"></fant-itemdetail>`)
            .on('new', () => this.route = html`<fant-newitem .newItem="${item=>this.onNewItemAdded(item)}"></fant-newitem>`)
            .on('*', () => this.route = html`<fant-login></fant-login>`);
        this.router.resolve();

        this.user = null;

        /* Add global event listeners */
        addEventListener('login',(event) => this.onLogin(event));
        addEventListener('user-created',(event) => this.onLogin(event));
        addEventListener('sellable-loaded',(sellables) => this.onSellablesLoaded(sellables));
    }

    render() {
        return html`
            <link rel="stylesheet" href="styles.css">
            <div class="header">
                <h1 @click="${e=>this.naviagteHome()}">Fant</h1>
                <div style="flex-grow: 1"></div>
                <div class="login-link" @click="${this.doLogin}">
                    ${this.user === null ? html`Logg inn`: html`${this.user}`}                    
                </div>
            </div> 
            <div class="container">
                ${this.route}
            </div>
        `
    }

    /**
     * Handle events from fant-login
     *
     * @param changedProperties
     */
    updated(changedProperties) {
        let login = this.shadowRoot.querySelector('fant-login');
        if(login) {
            login.addEventListener('login',(event) => {this.onLogin(event)});
            login.addEventListener('createuser',e => this.onCreateUserClicked());
            return;
        }

        let newItem = this.shadowRoot.querySelector('fant-newitem');
        if (newItem) {
            newItem.addEventListener('cancel', (event) => this.onCancelNewItem(event));
            newItem.addEventListener('add', (event) => this.onAddNewItem(event));
        }
    }

    /**
     *
     * @param changedProperties
     */
    firstUpdated(changedProperties) {
        console.log('firstUpdated');
        loadSellables().catch(e=>console.error('Failed to load sellables: ' + e));
    }

    doLogin() {
        this.router.navigate('/login');
    }

    onLogin(event) {
        this.user = event.detail.userid;
        this.router.navigate('/items');
    }

    onCreateUser(userdetails) {
        this.user = userdetails.userid;
        this.router.navigate('/items');
    }

    naviagteHome() {
        this.router.navigate('/items');
    }

    onItemSelect(id) {
        this.router.navigate('/item/' + id);
    }


    onSellablesLoaded(sellables) {
        console.log('onSellablesLoaded: ' + JSON.stringify(sellables.detail));
        items =  sellables.detail;

        let itemsCompoent = this.shadowRoot.querySelector('fant-items');
        if (itemsCompoent) {
            itemsCompoent.requestUpdate();
        }
    }

    /**
     * Event handler for '+'
     */
    onItemAdd() {
        this.router.navigate('/new');
    }

    onCreateUserClicked(event) {
        this.router.navigate('/createuser');
    }

    onCancelNewItem(event) {
        this.router.navigate('/');
    }

    onAddNewItem(event) {
        console.log('Event handler for global "add" event Remove ME');
    }

    onNewItemAdded(item) {
        addSellable(item).then(value => {
            items =  items = [...items, value];
            let itemsCompoent = this.shadowRoot.querySelector('fant-items');
            if (itemsCompoent) {
                itemsCompoent.requestUpdate();
            }
        });
        this.router.navigate('/items');
    }
}
customElements.define('my-fant', Fant);