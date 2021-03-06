//food2fork does not work so go back to lecture 139 to get the correct API
import {elements} from './base';
export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
};
export const clearResults = () =>{
    elements.searchResultList.innerHTML = ' ';
    elements.searchResPages.innerHTML = ' ';
};

export const highlightSelected = id =>{
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href*="?#${id}"]`).classList.add('results__link--active');
};



//keeping titles in one line
export const limitRecipeTitle = (title, limit = 17) =>{
    const tempArr = [];
    if(title.length>limit){
        //do something
        title.split(' ').reduce((acc, cur)=>{
            if(acc + cur.length<= limit){
                tempArr.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${tempArr.join(' ')}...`;
        
    }
    return title;
}
//^--this is how limitRecipe works
/*
string: Pasta with Tomato sauce
acc: 0 -> acc+cur.length = 5 -> tempArr['Pasta','']
acc: 5 -> acc+cur.length = 9 -> tempArr['Pasta','with']
acc: 9 -> acc+cur.length = 15 -> tempArr['Pasta','with', 'Tomato']
acc: 15 -> acc+cur.length = 20 -> tempArr['Pasta','with', 'Tomato']
finish
*/


const renderRecipe = recipe => {
    const markup = `
                <li>
                    <a class="results__link" href="?#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>

`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

//type can be previous or next
const createBtn = (page, type) => `

                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page+1}>
                    <span>Page ${type === 'prev' ? page -1: page+1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if(page === 1 && pages>1){
        //button to go to te next page 
        button = createBtn(page, 'next');
       }else if(page <pages){
           //both next and prev buttons
           button = `
                    ${createBtn(page, 'next')}
                    ${createBtn(page, 'prev')}
`;
       } else if(page == pages && pages > 1){
           //only go back a page
           button = createBtn(page, 'prev');
       }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render current page results
    const start = (page - 1) *resPerPage;
    const end = page * resPerPage;
    
    recipes.slice(start, end).forEach(renderRecipe);
    //render pagination btns
    renderButtons(page, recipes.length, resPerPage);
}






















