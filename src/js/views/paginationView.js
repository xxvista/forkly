import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup = function () {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    console.log(numPages);
    console.log(this._data.page);

    // Page 1, and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return this.renderNextButton();
    }

    // last page
    if (this._data.page === numPages && numPages > 1) {
      return this.renderPrevButton();
    }

    // other page
    if (this._data.page < numPages) {
      return [this.renderNextButton(), this.renderPrevButton()];
    }

    // Page 1, and there are no other pages
    return '';
  };

  renderPrevButton() {
    return `<button data-goto="${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
               <svg class="search__icon">
                  <use href="${icons}#icon-arrow-left"></use>
                  </svg>
               <span>Page ${this._data.page - 1}</span>
         </button>
      `;
  }

  renderNextButton() {
    return `
        <button data-goto="${
          this._data.page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
  }
}

export default new PaginationView();
