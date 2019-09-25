import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import { uuidv4 } from './script.mjs';

export class NewItemComponent extends LitElement {
    static get properties() {
        return {
            title: {type: String},
            price: {type: Number},
            description: {type: String},
            photos: {type: Array},
            newItem: {type: Function}
        };
    }

    constructor() {
        super();

        this.title = '';
        this.price = '';
        this.description = '';
        this.photos = [];
        this.newItem = e => console.log('Default new item ' + e);
        this.selected = new Map();
    }

    render() {
        return html`
            <link rel="stylesheet" href="styles.css">
            <link rel="stylesheet" href="newitem.css">
            <div class="flexc">
                <label for="title">Title</label>
                <input id="title" value="${this.title}"/>
                <label for="price">Price</label>
                <input id="price" type="number" value="${this.price}"/>
                <label for="description">Description</label>
                <textarea id="description" rows="5">${this.description}</textarea>
                <label for="images">Images</label>
                <div id="images">
                    <div id="thumbnails">${this.photos.map(i => html`
                        <div class="thumbnail" @click="${e => this.onThumbnailClick(e.target)}"><img src="${i}"></div>
                    `)}</div>
                    <div class="button-group">
                        <input id="image-input" type="file" accept="image/*" multiple @change=${e => this.onImageChange(e.target.files)}"/>
                        <button id="addimage" class="button" @click="${this.addImage}">Add Images</button>
                        <button id="deleteimage" class="button" @click="${this.deleteImages}" disabled="true">Delete Images</button>
                    </div>
                </div>
        
                <div class="add-cancel">
                    <button id="additem" class="button" @click="${this.fireAddItemEvent}">Add Item</button>
                    <button id="cancelitem" class="button" @click="${this.fireCancelEvent}">Cancel</button>
                </div>
            </div>
        `;
    }

    addImage() {
        this.renderRoot.getElementById('image-input').click();
    }

    deleteImages() {
        let thumbnails = this.renderRoot.getElementById('thumbnails');
        for(const key of this.selected.keys()) {
            thumbnails.removeChild(key);
        }
        this.selected.clear();
        this.updateDeleteButton();
    }

    onImageChange(files) {
        if(files && files[0]) {
            for(let file of files) {
                let obj = new FileReader();
                obj.onload = data => {
                    this.photos = [...this.photos, data.target.result];
                };
                obj.readAsDataURL(file);
            }
        }
    }

    onThumbnailClick(img) {
        let thumb = img.closest('.thumbnail');
        if(this.selected.has(thumb)) {
            thumb.classList.remove('thumbnail-selected');
            this.selected.delete(thumb);
        } else {
            thumb.classList.add('thumbnail-selected');
            this.selected.set(thumb,true);
        }

        this.updateDeleteButton();
    }

    updateDeleteButton() {
        this.renderRoot.getElementById('deleteimage').disabled = this.selected.size === 0;
    }

    fireCancelEvent() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    setValues(item) {
        this.title = item.title;
        this.price = item.price;
        this.description = item.description;
        this.photos = item.photos;
    }

    fireAddItemEvent() {
        let event = new CustomEvent('add', {
            detail: {
                id: uuidv4(),
                photos: this.renderRoot.getElementById('image-input').files,
                title: this.renderRoot.getElementById('title').value,
                price: parseFloat(this.renderRoot.getElementById('price').value),
                description: this.renderRoot.getElementById('description').value
            }
        });
        this.dispatchEvent(event);
        this.newItem(event.detail);
    }
}
customElements.define('fant-newitem',NewItemComponent);