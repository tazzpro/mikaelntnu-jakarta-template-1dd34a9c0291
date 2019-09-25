import Glide, {Controls, Breakpoints } from 'https://unpkg.com/@glidejs/glide/dist/glide.modular.esm.js'

import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

import { getItemById, items } from './script.mjs';
import { getPhotoURL, buySellable } from './service.mjs';

export class ItemDetailComponent extends LitElement {
    static get styles() {
        return css`
            :host {
              display: flex;
              flex-direction: column;
            }

            .glide__arrow {
                color: black;
                border: 2px solid rgba(0,0,0,0.5)
            }
    
            .box {
                display: flex;
                justify-content: center;           
                min-width: 500px;            
                max-width: 500px;
            }
    
            .box img {
                height: 100%;
                width: 100%;
                object-fit: contain;
            }

            .content {
                display: flex;
                width: 100%;
                height: 100%;
                flex-direction: column;
                align-items: center;
                margin-top: 15px;
            }
    
            #buy {
                width: 85%;
            }
    
            #detail {
                width: 90%;
            }
            
            .glider-container {
                max-width: 500px;
            }            
            
            .glide__slide {
                align-self: center;
            }
        `
    }

    static get properties() {
        return {
            id: {type: String}
        }
    }

    constructor() {
        super();

        if(items && items.length > 0) {
            this.item = items[0];
            this.id = this.item.id;
        }
    }

    renderSlides(photos) {
        let slides = []
        for(let i = 0; i < photos.length; i++) {
            slides.push(html`
                <li class="glide__slide">
                    <div class="box">
                        <img src="${getPhotoURL(photos[i])}">
                    </div>
                </li>`)
        }
        return slides
    }

    render() {
        console.log('Render');
        this.item = getItemById(this.id);
        return html`
            <link rel="stylesheet" href="./styles.css">
            <link rel="stylesheet" href="https://unpkg.com/@glidejs/glide/dist/css/glide.core.min.css">
            <link rel="stylesheet" href="https://unpkg.com/@glidejs/glide/dist/css/glide.theme.min.css">
        
          <div class="glider-container">
              <div class="glide">
               <div class="glide__track" data-glide-el="track">
                    <ul class="glide__slides">
                        ${this.renderSlides(this.item.photos)}
                    </ul>
                </div>        
                <div class="glide__arrows" data-glide-el="controls">
                    <button class="glide__arrow glide__arrow--left" data-glide-dir="<">«</button>
                    <button class="glide__arrow glide__arrow--right" data-glide-dir=">">»</button>
                </div>
            </div>
        </div>
        
        <div class="content">
                <button id="buy" class="button" @click="${this.buy}">Kjøp</button>
                <div id="detail">
                    <h2>${this.item.title}</h2>
                    <b class="price">${this.item.price} kr</b>
                    <p>${this.item.description}</p>
                </div>
        </div>
        `
    }

    buy() {
        buySellable(this.id);
    }

    firstUpdated(changedProperties) {
        this.root = this.shadowRoot.querySelector('.glide');
        new Glide(this.root, {
            gap: 50
        }).mount({ Controls, Breakpoints });
    }
}
customElements.define('fant-itemdetail', ItemDetailComponent);