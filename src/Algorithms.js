// Algorithms to perform searches, filters, etc.

import { ACTIONS, SUPPLIES } from './Data';

/*
  Given some drink recipes and a list of available supplies, return all drink recipes
  that can be made with the supplies.
  Note that some drinks may require multiple of the same supply, and that the input
  array may have multiple of the same supply, indicating the available quantity.

  Parameter format:
  - drinks: array of drink objects:
      {
        name: drink name,
        steps: array of steps (strings) which come from either ACTIONS or SUPPLIES        
      }
  - supplies: array of strings which come from SUPPLIES
  
  Return format:
  - array of drink objects whose recipes can be made with the supplies
*/
export function whatCanIMake(drinks, supplies) {
let make = [];
    if(supplies.length === 0){
      return [];
    }

    drinks.forEach(drink => {
     if(containSupplies(drink, supplies)){
       make.push(drink)
     }
    });

 return make;
}


/*
  Given some drink recipes and a given recipe, return any drink whose recipe matches
  the given recipe.

  Parameter format:
  - drinks: array of drink objects:
      {
        name: drink name,
        steps: array of steps (strings) which come from either ACTIONS or SUPPLIES        
      }
  - recipe: array of strings of steps which come from either ACTIONS or SUPPLIES
  
  Return format:
  - array of drink objects whose recipes can be made with the supplies
*/
export function searchDrinks(drinks, recipe) {
    let drinkSet, recipeSet, comp = [];

    drinks.forEach(drink => {
        drinkSet = new Set(drink.steps);
        recipeSet = new Set(recipe);
        if (drinkSet.size == recipeSet.size) {
            if(compare(drinkSet, recipeSet)){
                comp.push({name:drink.name, steps:drink.steps});
            }
        }
    });
    //console.log(comp.toString());
    return comp;
}

function compare(drinkSet, recipeSet){
  let diff;
  diff = new Set([...drinkSet].filter((x) => recipeSet.has(x)));
  if(diff.size == recipeSet.size){
    return true
  }
    return false;
}

function containSupplies(drink, supplies) {
    for(let i=0; i < supplies.length; i++) {
        if (drink.steps.indexOf(supplies[i]) == -1) {
            return false
        }
    }
  return true;
}


