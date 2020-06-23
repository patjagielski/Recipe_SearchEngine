import axios from 'axios';
import {key, proxy} from '../config';


export default class Search{
    constructor(query){
        this.query = query;
    }
    //every async method returns promise so we must be able to wait for that promise
    async getResults(query){
    try{
    const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
    this.recipes = res.data.recipes;
    //console.log(recipes);
    }catch(error){
        alert(error);
    }
   
    
}
}







