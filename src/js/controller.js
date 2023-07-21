import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import searchView from './views/searchView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable'; // Polyfilling everything else
import 'regenerator-runtime/runtime'; // Polyfilling async await
import bookMarksView from './views/bookMarksView.js';
// import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update resultsView to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // Update bookmarks
    bookMarksView.update(model.state.bookmarks);

    // 1. loading recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3. Rendering search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // Render the pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1. Rendering new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // 2. updare recepie view
  recipeView.update(model.state.recipe);

  // 3. remove bookmark
  bookMarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderMessage();
    //Render bookmark view
    bookMarksView.render(model.state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2.5 * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRenderer(controlRecipes);
  recipeView.addHandlerUpdateServigns(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHendlerUpload(controlAddRecipe);
};
init();
