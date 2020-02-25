// Global app controller
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import Search from './models/Search';


/*
**Global state of the app**
-Search object
-Current recipe object
-Shopping list object 
-Liked recipes
*/

const state ={};



/*
///////SEARCH CONTROLLER////////
*/
const CtrlSearch = async () =>{
    //1) get query from view
    const query = searchView.getInput();

//    console.log(query);
    
    if(query){
        //2)New Search object and add to state
        state.search = new Search(query);
        
        //3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try{
         //4) Search for recipes
        //we wait since we get a promise from the function
        await state.search.getResults();
        
        
        //5) render results on UI
        clearLoader();
        searchView.renderResults(state.search.recipes);   
        }catch(err){
            alert('Something went wrong with the search');
            clearLoader();
        }
    }
}



elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    CtrlSearch();
    
});

    



elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline');
    if(btn ){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);

    }
});

/*
//////RECIPE CONTROLLER//////
*/

const controlRecipe = async () =>{
    //Get ID from url
    const id = window.location.hash.replace('#', '');
   
    
    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        //Create new recipe object
        state.recipe = new Recipe(id);
        
        //Highlight selected search item
        if(state.search) searchView.highlightSelected(id);
        
        
        try{
        //Get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredient();
        
        //Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        
        //Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe,
                                state.likes.isLiked(id));
        }catch(error){
            alert('Something went wrong with gettin the recipe');
        }
       
        
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
//^-- same thing as below
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/*
//////LIST CONTROLLER//////////
*/

const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
        console.log(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});




/*
//////LIKE CONTROLLER//////////
*/


const controlLike = ()=> {
    if(!state.likes) state.likes = new Like();
    const currentID = state.recipe.id;
    
    
    //User has not liked the recipe
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike = state.likes.addLikes(
            currentID, 
            state.recipe.title,
            state.recipe.author, 
            state.recipe.img);
        //Toggle the like button
        likeView.toggleLikeBtn(true);
        
        //Add like to UI list
        likeView.renderLike(newLike);
        
    //User has liked the recipe    
    }else{
        
        //Remove like to the state
        state.likes.deleteLike(currentID);
        
        //Toggle the like button
        likeView.toggleLikeBtn(false);
        
        //Remove like to UI list
        likeView.deleteLike(currentID);
        
    }
    likeView.toggleLikeMenu(state.likes.getNumLikes());
};


//Restore liked recipes on page load
window.addEventListener('load', ()=>{
    state.likes = new Like();
    
    //Restore likes
    state.likes.readStorage();
    
    //toggle like menu button
    likeView.toggleLikeMenu(state.likes.getNumLikes());
    
    //Render the existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like));
});





//Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease , .btn-decrease *')){
        //button decrease is clicked
        if(state.recipe.servings > 1){
         state.recipe.updateServings('dec');
         recipeView.updateServingIng(state.recipe);
        }
    }else if(e.target.matches('.btn-increase , .btn-increase *')){
        //button increase is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingIng(state.recipe);
        
        //Add ingredients to shopping list
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
        
        //like controller
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
    
    
});









