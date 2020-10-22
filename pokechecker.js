// TODO: prototipo? const type = import('./type.js'); --defer?? await??
// TODO: strongAtk = coverage, weakDef = para def type :D
// TypeFactory?
// HTML references
let $primaryType,$secondaryType,$typePickerContainer;
let $teamList;
let $addBtn, $clrBtn;
let selectingTypeShell;
let debug;

let pokeTypes = ["Normal", "Fighting", "Flying", "Water", "Fire", "Grass", "Electric", "Ground", "Rock",
"Dragon", "Steel", "Fairy", "Psychic", "Ghost", "Dark", "Bug", "Ice", "Poison"];
//#region Classes
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
//#endregion
//#region Factories 
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
//#endregion
//#region States
/* States */
let primaryTypeShellState = {
    "id": "primaryTypeShell",
    "state": "new", // new, active, selecting
    "typeName": "NONE",
    "transitionState": () => {
    }
}
let secondaryTypeShellState = {
    "id": "secondaryTypeShell",
    "state": "new", // new, active, selecting
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
//#endregion
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
function handlePopupState () {
    switch (this.togglePopupState.state) {
        case 'new':
            break;
        case 'open':
            break;
        case 'closed':
            break;
        default:
            console.log("Popup State not implemented")
    }
}

function toggleStyle(element, classname) {
    // llamar al toggle del state del popup, 
    //el popup se deberia encargar del hidden
    if (!element.classList.contains(classname)){
        element.classList.add(classname);
    } else {
        element.classList.remove(classname);
    }
}
function removeTypeStyles(element){
    pokeTypes.forEach(type => selectingTypeShell.classList?.remove(type));
}
function togglePopupVisibility(){
    toggleStyle($typePickerContainer,'is-invisible');
    console.log(selectingTypeShell);
}
// }}}}} Event handler de click de primaryType y secondaryType
function onClick_PrimaryTypeShell(){
    selectingTypeShell = $primaryType;
    togglePopupVisibility();
}
function onClick_SecondaryTypeShell(){
    selectingTypeShell = $secondaryType;
    togglePopupVisibility();
}
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
function teamListHandler(e){
    // Delete btn - remove the row
    if (e.path.find((x)=>x.classList?.contains("deleteBtn"))!==undefined){
        let row = e.path.find((x)=> x.localName == "li");
        row.remove();
    }
    // Click on a type - open or close details
    if (e.path.find((x)=>x.classList?.contains("pokeType"))!==undefined){
        let type = e.path.find((x)=> x.classList.contains("pokeType")).innerText;
        console.log(type)
    }
    debug = e;
}
function typePickerHandler(e){
    // Assign selected type to the 
    if (e.path.find((x)=>x.classList?.contains("pokeType"))!==undefined){
        let type = e.path.find((x)=> x.classList.contains("pokeType")).innerText;
        console.log(type)
        removeTypeStyles(selectingTypeShell);
        selectingTypeShell.classList.add(type);
        selectingTypeShell.innerText=type;
    }
    selectingTypeShell = null;
    togglePopupVisibility();
}
// }}}}}  document on ready // main method
//#region Main method / OnReady / initialize
$primaryType = document.querySelector('#'+primaryTypeShellState.id)
$secondaryType = document.querySelector('#'+secondaryTypeShellState.id)
$typePickerContainer = document.querySelector('#'+typePickerPopupState.id)
$primaryType.addEventListener('click', onClick_PrimaryTypeShell);
$secondaryType.addEventListener('click', onClick_SecondaryTypeShell);

$teamList = document.querySelector('#teamList');
$teamList.addEventListener('click', teamListHandler);
$typePickerContainer.addEventListener('click', typePickerHandler);
//#endregion