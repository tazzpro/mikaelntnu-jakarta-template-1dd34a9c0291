/**
 * Functions in service.mjs implements calls to the server and is used by the UI
 *
 * Classes used:
 *
 * Sellable: {
 *  id: numeric,
 *  title: string,
 *  price: numeric ,
 *  description: string,
 *  seller: User,
 *  buyer: User,
 *  photos[] : Array of Photo
 * }
 *
 * Photo: {
 *  id: numeric,
 *  subpath: string
 * }
 *
 * User: {
 *   firstname: string,
 *   lastname: string,
 *   street: string,
 *   city: string,
 *   postalcode: string,
 *   email: string,
 *   userid: string,
 *   password: string
 * }
 *
 */

/**
 * Log user on to the system.
 *
 * @param userid
 * @param password
 * @returns {Promise<void>}
 */
export async function login(userid, password) {
    //throw "Error logging inn";
    dispatchEvent(new CustomEvent('login',{detail: {userid: userid, password: password}, bubbles: true}));
}

/**
 * Log user out of the system
 *
 * @returns {Promise<void>}
 */
export async function logout() {
    console.log('Service.logout()');
    dispatchEvent(new CustomEvent('logout',{bubbles: true}));
}

/**
 * Creates a new user.
 *
 * @param user
 * @returns {Promise<void>}
 */
export async function createUser(user) {
    const response = await fetch('api/sellable');
    const message = await response.json();
    dispatchEvent(new CustomEvent('user-created', {detail: message, bubbles: true}));
}

/**
 * Loads list of sellables as an array. Structure of Sellable as b
 *
 * @returns {Promise<void>}
 */
export async function loadSellables() {
    const response = await fetch('api/fant');
    const sellables = await response.json();
    dispatchEvent(new CustomEvent('sellable-loaded', {detail: sellables, bubbles: true}));
}

/**
 * Create a new Sellable. The logged in user will end up as owner. An event 'sellable-added' is
 * dispatched on successful creation with the new Sellable as detail.
 *
 * @param title
 * @param price
 * @param description
 * @param photos
 * @returns {Promise<any>}
 */
export async function addSellable({title, price, description, photos}) {
    const data = new FormData();
    data.append('title',title);
    data.append('description',description);
    data.append('price',price);
    for(let file of photos) {
        data.append('files',file);
    }

    const response = await fetch('api/fant/create', {method: 'POST',body: data});
    const sellable = await response.json();
    dispatchEvent(new CustomEvent('sellable-added', {detail: sellable, bubbles: true}));
    return sellable;
}


/**
 * Buys an existing Sellable. The logged in user will be marked as the buyer. The event 'sellable-updated' with the
 * updated Sellable as detail is dispatched on success.
 *
 * @param id
 * @returns {Promise<any>}
 */
export async function buySellable(id) {
    console.log('buySellable(' + id + ')');
    const response = await fetch('api/fant/buy/' + id, {method: 'PUT'});
    const sellable = await response.json();
    dispatchEvent(new CustomEvent('sellable-updated', {detail: sellable, bubbles: true}));
    return sellable;
}


/**
 * Translate a Photo object to an URL
 *
 * @param photo
 * @returns {string}
 */
export function getPhotoURL(photo) {
    return photo === null ? '' : 'api/fant/photo/' + photo.subpath;
}


/**
 * Translate the first Photo object of an Sellable to an URL
 *
 * @param sellable
 * @returns {string}
 */
export function getFirstPhotoURL(sellable) {
    let result = '';

    if(sellable.photos && sellable.photos.length > 0) {
        result = getPhotoURL(sellable.photos[0]);
    }

    return result;
}

