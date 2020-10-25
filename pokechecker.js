// TODO: prototipo? const type = import('./type.js'); --defer?? await??
// TODO: strongAtk = coverage, weakDef = para def type :D
// TypeFactory?
// HTML references
let $primaryType,$secondaryType,$typePickerContainer;
let $teamList;
let $addBtn, $clrBtn, $pokeNameInput;
let selectingTypeShell;
let debug;

let pokeTypes = ["Normal", "Fighting", "Flying", "Water", "Fire", "Grass", "Electric", "Ground", "Rock",
"Dragon", "Steel", "Fairy", "Psychic", "Ghost", "Dark", "Bug", "Ice", "Poison"];
let teamListArray;
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

//#region Team selector
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
    if (!element.classList.contains(classname)){
        element.classList.add(classname);
    } else {
        element.classList.remove(classname);
    }
}
function removeTypeStyles(element){
    pokeTypes.forEach(type => element.classList?.remove(type));
}
function clearTypeShells(){
    $primaryType.innerText = "NONE";
    $secondaryType.innerText = "NONE";
    removeTypeStyles($primaryType);
    removeTypeStyles($secondaryType);
}
function togglePopupVisibility(){
    toggleStyle($typePickerContainer,'is-invisible');
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
function onClick_addBtn(){
    // If name is empty assign a random name (con el teamlist array.length)
    // Add to team list
    // Reset the name input and the type shells
    ;debugger
    //$pokeNameInput.value
    // should have at least one type
    let newPokeName = $pokeNameInput.value;
    let htmlPokeRow = skeletonHtmlPokeRow();
    htmlPokeRow = htmlPokeRow.replaceAll('templatePokemonName',newPokeName);
    let firstType = $primaryType.innerText;
    if (firstType != undefined && firstType != "NONE") {
        htmlPokeRow = htmlPokeRow.replace('templateFirstType is-hidden','templateFirstType');
        htmlPokeRow = htmlPokeRow.replaceAll('templateFirstType',firstType);
    }
    let secondType = $secondaryType.innerText;
    if (secondType != undefined && secondType != "NONE") {
        htmlPokeRow = htmlPokeRow.replace('templateSecondType is-hidden','templateSecondType');
        htmlPokeRow = htmlPokeRow.replaceAll('templateSecondType',secondType);
    }
    ;debugger
    $teamList.innerHTML += htmlPokeRow;
    clearInputs();
    updateTeamList();
}
function skeletonHtmlPokeRow(){
    return '<li class="added-pokemon columns">'
    +'<!-- /// Pokemon /// -->'
    +'<div class="column is-two-fifths addedPokemonName" title="templatePokemonName" data-field="pokeName">'
    + 'templatePokemonName'
    +'</div>'
    +'<div class="column is-two-fifths pokeTypesWrapper" data-field="typeWrapper">'
    +  '<div class="pokeType templateFirstType is-hidden" data-field="firstType">'
    +    'templateFirstType'
    +  '</div>'
    +  '<div class="pokeType templateSecondType is-hidden" data-field="secondType">'
    +    'templateSecondType'
    +  '</div>'
    +'</div>'
    +'<div class="column is-one-fifth deleteBtnWrapper btn">'
    +  '<div class="deleteBtn"><i class="fas fa-minus-circle fa-lg"></i></div>'
    +'</div>'
  +'</li>'
}

function clearInputs(){
    clearTypeShells();
    $typePickerContainer.classList.add('is-invisible');
    $pokeNameInput.value = "";
}
// }}}}} 
function teamListHandler(e){
    // Delete btn - remove the row
    if (e.path.find((x)=>x.classList?.contains("deleteBtn"))!==undefined){
        let row = e.path.find((x)=> x.localName == "li");
        row.remove();
        updateTeamList();
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
        removeTypeStyles(selectingTypeShell);
        selectingTypeShell.classList.add(type);
        selectingTypeShell.innerText=type;
    }
    selectingTypeShell = null;
    togglePopupVisibility();
}
//#endregion
//#region Team analytics
function mapHtmlListToPokeList(htmlList){
    let pokeList = [];
    for (let i = 0; i < htmlList.length; i++) {
        let newPoke = new Object({"pokeName":"","primaryType":"","secondaryType":""});
        for (let j = 0; j < htmlList[i].children.length; j++) {
            let div = htmlList[i].children[j]
            switch (div.attributes["data-field"]?.nodeValue) {
                case "pokeName":
                    newPoke.pokeName = div.innerText;
                    break;
                case "typeWrapper":
                    if (div.children[0].innerText !== "templateFirstType" && div.children[0].innerText !== "") {
                        newPoke.primaryType = div.children[0].innerText
                    }
                    if (div.children[1].innerText !== "templateSecondType" && div.children[1].innerText !== "") {
                        newPoke.secondaryType = div.children[1].innerText
                    }
                    break;
            }         
        }
        if (newPoke.primaryType != "" || newPoke.secondaryType !="") {
            pokeList.push(newPoke);
        }
    }
    console.groupCollapsed('PokeList (from mapHtmlListToPokeList)');
    console.dir(pokeList);
    console.groupEnd();
    return pokeList;
}
function updateTeamList(){
    // recalculate teamList array
    ;debugger
    teamListArray = mapHtmlListToPokeList($teamList.children);
}
//#endregion

//#region Main method / OnReady / initialize
$primaryType = document.querySelector('#'+primaryTypeShellState.id);
$secondaryType = document.querySelector('#'+secondaryTypeShellState.id);
$typePickerContainer = document.querySelector('#'+typePickerPopupState.id);
$addBtn = document.querySelector('#addBtn');
$clrBtn = document.querySelector('#clrBtn');
$pokeNameInput = document.querySelector('#pokeNameInput');

$primaryType.addEventListener('click', onClick_PrimaryTypeShell);
$secondaryType.addEventListener('click', onClick_SecondaryTypeShell);
$addBtn.addEventListener('click' ,onClick_addBtn);
$clrBtn.addEventListener('click', clearInputs);


$teamList = document.querySelector('#teamList');
$teamList.addEventListener('click', teamListHandler);
$typePickerContainer.addEventListener('click', typePickerHandler);

updateTeamList();
//#endregion