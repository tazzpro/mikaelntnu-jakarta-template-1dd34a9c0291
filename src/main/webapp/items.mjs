import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import {items} from './script.mjs';
import {getFirstPhotoURL}  from "./service.mjs";

export class ItemsViewComponent extends LitElement {
    static get properties() {
        return {
            add: {type: Function},
            select: {type: Function}
        }
    }

    static get styles() {
        return css`
            :host {
              display: flex;
              flex-direction: column;
            }
            
            .price {
                font-size: 1.2em;            
            }
        `
    }

    constructor() {
        super();

        this.add = () => console.log('Default add method');
        this.select = (id) => console.log('Default on select ' + id);
    }

    render() {
        return html`
            <link rel="stylesheet" href="styles.css">
            <h2 class="title">Items for sale</h2>
            <div id="items">
                ${items.map(item => html`
                    <a class="item" @click="${() => this.select(item.id)}">
                        <div class="img-wrapper">
                            <img src="${getFirstPhotoURL(item)}">
                        </div>
                        <div>
                            <h2>${item.title}</h2>
                            <b class="price">${item.price} kr</b>
                            <p>${item.description}</p>
                        </div>
                    </a>
                `)}
            </div>
            <button class="add-new" @click="${this.add}">+</button>
        `
    }
}
customElements.define('fant-items', ItemsViewComponent);