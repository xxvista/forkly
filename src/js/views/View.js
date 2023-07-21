import icons from 'url:../../img/icons.svg'; // parcel 2

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendreed
   * @param {boolean} [render = true] If false, crate markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is rendered if render = false
   * @this {Object} View instance
   * @author Abdellah Abdelkafi
   * @todo Finish implementition
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElemens = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElemens.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
     <svg>
       <use href="${icons}#icon-loader"></use>
     </svg>
   </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
     <div>
       <svg>
         <use href="${icons}#icon-alert-triangle"></use>
       </svg>
     </div>
     <p>${message}</p>
   </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
     <div>
       <svg>
         <use href="${icons}#icon-smile"></use>
       </svg>
     </div>
     <p>${message}</p>
   </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
