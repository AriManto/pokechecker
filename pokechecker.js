// TODO: prototipo? const type = import('./type.js'); --defer?? await??
// TODO: strongAtk = coverage, weakDef = para def type :D
// TypeFactory?

/* Classes declaration */
class PokeType {
    constructor() {
        this.name = "";
        this.foreColor = "#000000";
        this.bgColor = "#CCCCCC";
        this.weakDef = [];
        this.strongAtk = [];
    }
}
class Pokemon {
    constructor() {
        this.name = "";
        this.primaryType = null;
        this.secondaryType = null;
    }
}
/* Factories */
class PokemonFactory {
    constructor() {
        this.createNewPokemon = () => { return new Pokemon()};
    }
}
class PokeTypeFactory {
    constructor() {
        this.createNewPokemon = () => { return new PokeType()};
    }
}
/* States */
let primaryTypeShellState = {
    "id": "primaryTypeShell",
    "state": "new", // new, active
    "typeName": "NONE",
    "transitionState": () => {
    }
}
let secondaryTypeShellState = {
    "id": "secondaryTypeShell",
    "state": "new",
    "typeName": "NONE",
    "transitionState": () => {
    }
}
let typePickerPopupState = {
    "id": "typePickerPopupContainer",
    "state": "new", // new, open, closed
    "transitionState": () => {
    }
}

//primaryTypeShellState.transitionState(); --works

// }}}}} Fetch data from JSON and parse to PokeType
/*let typesJson; 
fetch('./types.json').then(
    (res) => {
        typesJson=res.json();
        console.dir(typesJson);
    }
);*/



// }}}}} Populate the TypeShellPopup with PokeTypes

// }}}}} TypePicked event listener:
/*
    
*/

// }}}}} Bind the popup click event listeners to the popup container 



// }}}}} Event handler de click de primaryType y secondaryType
/*
function onClick_currentPokemonTypeShell() {
    this.setState("Active");
    this.transitionPopupState();
}
    > hacer una variable "global" que marque cual tipo está seleccionado --state???????
    > cambiar estado propio a activo, y estado del popup
*/

// }}}}} Event handler de popup
/*
function onSelectPopupType(typeName){
    current
}
*/

// }}}}} 

// }}}}}  document on ready // main method