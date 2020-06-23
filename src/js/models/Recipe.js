import axios from 'axios';
import {key, proxy} from '../config';

export default class Recipe{
    constructor(id){
        this.id = id;
    }
    
    
    async getRecipe(){
    try{
        const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
        this.title = res.data.recipe.title;
        this.author = res.data.recipe.publisher;
        this.img = res.data.recipe.image_url;
        this.url = res.data.recipe.source_url;
        this.ingredients = res.data.recipe.ingredients;
        
        
    }catch(error){
        alert(error);
    }
}
    
    calcTime(){
        //TODO make this dynamic
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }
    
    calcServings(){
        this.servings = 4;
        
    }
    
    
    parseIngredient(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces' ,'ounce' ,'teaspoon','teaspoons', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) =>{
                ingredient = ingredient.replace(unit, unitShort[i]);
            });
            
            //2)Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); 
            
            //3)Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            //for each element we check if that element is in the units array
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            
            let objIng;
            if(unitIndex > -1){
                ///There is a unit
                //Case when theres two elemts before unit && case where there is one element before unit
                //EX 4 1/2 cups, arrCount is [4, 1/2]
                //EX 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }else{
                    //EX 4 1/2 cups, arrCount is [4, 1/2] --> eval(4+1/2) = 4.5
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                
                 objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
                
                
            }else if(parseInt(arrIng[0], 10)){
                //There is NO unit but 1st element is number     
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                //There is no unit and no numver in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
                 }
             return objIng;
            
        });
        this.ingredients = newIngredients;
    }

    
    updateServings(type){
        //Servings
        const newServings = type === 'dec' ? this.servings-1 : this.servings+1;
        
        //Ingredients
        this.ingredients.forEach(ing =>{
            ing.count *=(newServings/this.servings);
        });
        
        this.servings = newServings;
    }
    
}