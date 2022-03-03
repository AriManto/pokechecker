// TODO: prototipo? const type = import('./type.js'); --defer?? await??
// TODO: strongAtk = coverage, weakDef = para def type :D
// TypeFactory?
// HTML references
let $primaryType, $secondaryType, $typePickerContainer;
let $teamList;
let $addBtn, $clrBtn, $pokeNameInput;
let selectingTypeShell;
let $defTypesCountList;
let $defWeakList;
let debug;
// Model entities
let teamListArray;
let defTypesCountListArray;
let pokeDef_allDefBehaviorListArray;
let teamDefWeakListArray;
//#region 
// Data - fetched from JSON
let pokeTypes;
let initialListArray;
//#endregion
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
        this.createNewPokemon = () => { return new Pokemon() };
    }
}
class PokeTypeFactory {
    constructor() {
        this.createNewPokemon = () => { return new PokeType() };
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
let fetcher;
// }}}}} Fetch data from JSON and parse to PokeType
async function asyncLoadTypes(){
    fetcher = await fetch('./types.json')
    .then(res => {
            return res.json();
        })
    .then(data => {
        pokeTypes = [...data];
    });
    fetcher = await fetch('./initialList.json')
    .then(res => {
            return res.json();
        })
    .then(data => {
        initialListArray = [...data];
    });
    initializeTeamList();
    updateTeamListEntity();
}

//#region Team selector
function handlePopupState() {
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
    if (!element.classList.contains(classname)) {
        element.classList.add(classname);
    } else {
        element.classList.remove(classname);
    }
}
function removeTypeStyles(element) {
    pokeTypes.forEach(type => element.classList?.remove(type.typeName));
}
function clearTypeShells() {
    $primaryType.innerText = "NONE";
    $secondaryType.innerText = "NONE";
    removeTypeStyles($primaryType);
    removeTypeStyles($secondaryType);
}
function togglePopupVisibility() {
    toggleStyle($typePickerContainer, 'is-invisible');
}

function onClick_PrimaryTypeShell() {
    selectingTypeShell = $primaryType;
    togglePopupVisibility();
}
function onClick_SecondaryTypeShell() {
    selectingTypeShell = $secondaryType;
    togglePopupVisibility();
}
function onClick_addBtn() {
    // If name is empty assign a random name (con el teamlist array.length)
    let newPokeName = $pokeNameInput.value;
    let firstType = $primaryType.innerText;
    let secondType = $secondaryType.innerText;

    let isNewPokeValid = true;
    let errorMsg ="";
    
    if (newPokeName == ""){
        isNewPokeValid = false;
        errorMsg += "Pokemon name cannot be blank. \n";
    }
    if (firstType == "NONE" && secondType == "NONE"){
        isNewPokeValid = false;
        errorMsg += "Select at least one type.";
    }

    if (isNewPokeValid){
        let htmlPokeRow = mapPokeToRow(newPokeName, firstType, secondType);
        htmlPokeRow = htmlPokeRow.replaceAll('templatePokemonName', newPokeName);
        $teamList.innerHTML += htmlPokeRow;
        updateTeamListEntity();
    }
    else {
        alert(errorMsg);
    }

    clearInputs();
}
function mapPokeToRow(name, firstType, secondType) {
    let htmlPokeRow = skeletonHtmlPokeRow();
    htmlPokeRow = htmlPokeRow.replaceAll('templatePokemonName', name);
    if (firstType != undefined && firstType != "NONE") {
        htmlPokeRow = htmlPokeRow.replace('templateFirstType is-hidden', 'templateFirstType');
        htmlPokeRow = htmlPokeRow.replaceAll('templateFirstType', firstType);
    }
    if (secondType != undefined && secondType != "NONE") {
        htmlPokeRow = htmlPokeRow.replace('templateSecondType is-hidden', 'templateSecondType');
        htmlPokeRow = htmlPokeRow.replaceAll('templateSecondType', secondType);
    }
    return htmlPokeRow;
}
function skeletonHtmlPokeRow() {
    return `<li class="added-pokemon columns">
    <!-- /// Pokemon /// -->
    <div class="column is-two-fifths addedPokemonName" title="templatePokemonName" data-field="pokeName">
    templatePokemonName
    </div>
    <div class="column is-two-fifths pokeTypesWrapper" data-field="typeWrapper">
     <div class="pokeType templateFirstType is-hidden" data-field="firstType">
       templateFirstType
     </div>
     <div class="pokeType templateSecondType is-hidden" data-field="secondType">
        templateSecondType
      </div>
    </div>
    <div class="column is-one-fifth deleteBtnWrapper btn">
      <div class="deleteBtn"><i class="fas fa-minus-circle fa-lg"></i></div>
    </div>
  </li>`
}
function initializeTeamList() {
    initialListArray.forEach((poke) => {
        let htmlPokeRow = mapPokeToRow(poke.name, poke.primaryType, poke.secondaryType);
        $teamList.innerHTML += htmlPokeRow;
    })
}

function clearInputs() {
    clearTypeShells();
    $typePickerContainer.classList.add('is-invisible');
    $pokeNameInput.value = "";
    ;debugger
}
function teamListHandler(e) {
    // Delete btn - remove the row
    if (e.path.find((x) => x.classList?.contains("deleteBtn")) !== undefined) {
        let row = e.path.find((x) => x.localName == "li");
        row.remove();
        updateTeamListEntity();
    }
    // Click on a type - open or close details
    if (e.path.find((x) => x.classList?.contains("pokeType")) !== undefined) {
        let type = e.path.find((x) => x.classList.contains("pokeType")).innerText;
    }
}
function typePickerHandler(e) {
    // Assign selected type to the 
    if (e.path.find((x) => x.classList?.contains("pokeType")) !== undefined) {
        let type = e.path.find((x) => x.classList.contains("pokeType")).innerText;
        removeTypeStyles(selectingTypeShell);
        selectingTypeShell.classList.add(type);
        selectingTypeShell.innerText = type;
    }
    selectingTypeShell = null;
    togglePopupVisibility();
}
//#endregion
//#region Team analytics
function mapHtmlListToPokeList(htmlList) {
    let pokeList = [];
    for (let i = 0; i < htmlList.length; i++) {
        let newPoke = new Object({ "pokeName": "", "primaryType": "", "secondaryType": "" });
        for (let j = 0; j < htmlList[i].children.length; j++) {
            let div = htmlList[i].children[j]
            switch (div.attributes["data-field"]?.nodeValue) {
                case "pokeName":
                    newPoke.pokeName = div.innerText;
                    break;
                case "typeWrapper":
                    if (div.children[0].innerText.trim() !== "templateFirstType" && div.children[0].innerText !== "") {
                        newPoke.primaryType = div.children[0].innerText
                    }
                    if (div.children[1].innerText.trim() !== "templateSecondType" && div.children[1].innerText !== "") {
                        newPoke.secondaryType = div.children[1].innerText
                    }
                    break;
            }
        }
        if (newPoke.primaryType != "" || newPoke.secondaryType != "") {
            pokeList.push(newPoke);
        }
    }
    console.groupCollapsed('PokeList (from mapHtmlListToPokeList)');
    console.dir(pokeList);
    console.groupEnd();
    return pokeList;
}
function updateTeamListEntity() {
    // recalculate teamList array from entity to view
    updateTeamListView();
    ;debugger
    updateDefTypesCount();
    updatePokeDef_allDefBehaviorListArray();
    // TODO: team weak (x2,x4), team resist (x2,x4), team immunities 
    
    // updateDefWeakList();


}
function updatePokeDef_allDefBehaviorListArray(){
    pokeDef_allDefBehaviorListArray = calculatePokeDefBehavior();
    console.groupCollapsed("pokeDefBehaviorList");
    console.dir(pokeDef_allDefBehaviorListArray);
    console.groupEnd();
    ;debugger
}
function calculatePokeDefBehavior() {
    let pokeDefBehaviorList = [];
    teamListArray.forEach((poke) => {
        // Pokename, x2 weaknesses[types]: x4 weaknesses[types]
        let pokeDefBehavior = new Object({"pokeName":poke.pokeName,"x4weak":[],"x2weak":[],"immune":[],"x2resist":[],"x4resist":[]});
        let primaryType = pokeTypes.find(x => x.typeName == poke.primaryType);
        let secondaryType = pokeTypes.find(x => x.typeName == poke.secondaryType);
        let weakArray = [];
        let resistArray = [];
        let immuneArray = [];
        let aggregateArray = [];

        if (primaryType != undefined) {
            defBehaviorByType(primaryType,'weakDef',weakArray);
            defBehaviorByType(primaryType,'resistDef',resistArray);
            defBehaviorByType(primaryType,'immuneDef',immuneArray);   
        if (secondaryType != undefined) {
            defBehaviorByType(secondaryType,'weakDef',weakArray);
            defBehaviorByType(secondaryType,'resistDef',resistArray);
            defBehaviorByType(secondaryType,'immuneDef',immuneArray); 
        }
        // TODO: fix this part so the hacks are not needed for neutrality and immunity
        // Perhaps "group by" the aggregateArray?
        // Aggreggate the individual types
        weakArray.forEach((weakness) => {
            if (!aggregateArray.find((x) => x.typeName == weakness)){
                aggregateArray.push(new Object({"typeName":weakness.typeName,"dmgBehavior":-weakness.count}))
            }
            else {
                aggregateArray.find((x) => x.typeName == weakness.typeName).dmgBehavior-=weakness.count;
            }
        });
        resistArray.forEach((resistance) => {
            if (!aggregateArray.find((x) => x.typeName == resistance)){
                aggregateArray.push(new Object({"typeName":resistance.typeName,"dmgBehavior":+resistance.count}))
            }
            else {
                aggregateArray.find((x) => x.typeName == resistance).dmgBehavior+=resistance.count;
            }
        });
        immuneArray.forEach((immunity) => {
            if (!aggregateArray.find((x) => x.typeName == immunity)){
                aggregateArray.push(new Object({"typeName":immunity.typeName,"dmgBehavior":+100}))
            }
            else {
                aggregateArray.find((x) => x.typeName == immunity).dmgBehavior=100;
            }
        });
        let dmgBehField = 0;
        // Convert the aggreggate to final behavior object
        aggregateArray.forEach((agg) => {
            switch (agg.dmgBehavior) {
                case -2: dmgBehField = 'x4weak';
                    break;
                case -1: dmgBehField = 'x2weak';
                    break;
                case 1: dmgBehField = 'x2resist';
                    break;
                case 2: dmgBehField = 'x4resist';
                    break;
                case 100: dmgBehField = 'immune';
                    break;
                default: break;
            }
            pokeDefBehavior[dmgBehField].push(agg.typeName);
        });
        // Hack for neutrality
        pokeDefBehavior.x2weak?.forEach((weak) => {
            if (pokeDefBehavior.x2resist.find((res) => res == weak)){
                let neutralType = weak;
                pokeDefBehavior.x2resist = pokeDefBehavior.x2resist.filter( res => res != neutralType);
                pokeDefBehavior.x2weak = pokeDefBehavior.x2weak.filter( weak => weak != neutralType);
            }
        });
        // Hack for immunity
        pokeDefBehavior.immune?.forEach((immunity) => {
            pokeDefBehavior.x2resist = pokeDefBehavior.x2resist.filter( x2res => x2res != immunity);
            pokeDefBehavior.x2weak = pokeDefBehavior.x2weak.filter( x2weak => x2weak != immunity);
            pokeDefBehavior.x4resist = pokeDefBehavior.x4resist.filter( x4res => x4res != immunity);
            pokeDefBehavior.x4weak = pokeDefBehavior.x4weak.filter( x4weak => x4weak != immunity);

            
        });
        pokeDefBehaviorList.push(pokeDefBehavior);
    }
    });
    return pokeDefBehaviorList;
}
function defBehaviorByType(pokeType, field, array){
    pokeType[field]?.forEach((opponentType) => {
        if (!array.find((x) => x.typeName == opponentType)){
            array.push(new Object({"typeName":opponentType,"count":1}))
        }
        else {
            array.find((x) => x.typeName == opponentType).count+=1;
        }
    });
}


function updateTeamListView(){
    teamListArray = mapHtmlListToPokeList($teamList.children);
}
function updateDefTypesCount(){
    defTypesCountListArray = orderDefTypesDescending(calculateTeamTypesCount());
    $defTypesCountList.innerHTML = mapDefTypesCountToHTML(defTypesCountListArray);
}
function updateDefWeakList(){
    //get from DefBehavior
    teamDefWeakListArray = calculateTeamDefWeakList();
    ;debugger
    $defWeakList.innerHTML = mapTeamDefWeakListToHTML(teamDefWeakListArray);
    ;debugger
}

function mapDefTypesCountToHTML(countArray) {
    let HTMLcountList = "";
    countArray.forEach((typeCount) => {
        if (typeCount.count > 0) {
            HTMLcountList += `<li>
                <span class="pokeType ${typeCount.type}">${typeCount.type}</span>
                <span class="count">${typeCount.count}</span>
            </li>`
        }
    });
    return HTMLcountList;
}
function mapTeamDefWeakListToHTML(teamDefWeakList){
    let HTMLDefWeakList = "";
    if(teamDefWeakList.length > 0){

        teamDefWeakList.forEach((defWeak) => {
            HTMLDefWeakList += `<li>
            <span class="pokeType ${defWeak.typeName}">${defWeak.typeName}</span>`;
            if (defWeak.x4 > 0) {
                HTMLDefWeakList += `<span class="x4weak">X4:</span><span class="count">${defWeak.x4}</span>`
            }
            if (defWeak.x2 > 0) {
                HTMLDefWeakList += `<span class="x2weak">X2:</span><span class="count">${defWeak.x2}</span>`
            }
            HTMLDefWeakList += '</li>'; 
        });
    }
    return HTMLDefWeakList;
}

function calculateTeamTypesCount() {
    defTypesCountListArray = [];
    pokeTypes.forEach((type) => {
        let typeCount = new Object({ "type": type.typeName, "count": 0 });
        defTypesCountListArray.push(typeCount);
    });
    teamListArray.forEach((poke) => {
        let primaryType = poke.primaryType;
        let secondaryType = poke.secondaryType;
        if (primaryType != undefined && primaryType != "") {
            defTypesCountListArray.find((x) => x.type == primaryType).count += 1;
        }
        if (secondaryType != undefined && secondaryType != "") {
            defTypesCountListArray.find((x) => x.type == secondaryType).count += 1;
        }
    })
    //TODO: remove items with count o
    console.groupCollapsed("Type count list");
    console.dir(defTypesCountListArray);
    console.groupEnd();
    ;debugger
    return defTypesCountListArray;
}
function calculateTeamDefWeakList() {
    teamDefWeakListArray = [];
    pokeTypes.forEach((type) => {
        let typeDefWeak= new Object({ "type": type.typeName, "x2": 0 , "x4": 0, "xHalf":0, "xQuarter":0, "xImmune":0});
        defTypesCountListArray.push(typeDefWeak);
    });
    // typeName, x2, x4
    /*
    pokeDefWeakListArray.forEach(pokeDefWeak => {
        if (pokeDefWeak.x2) {
            pokeDefWeak.x2.forEach(x2weak => {
                
            });
        }
        if (pokeDefWeak.x4) {

        }

    });*/
}

function orderDefTypesDescending(arr = defTypesCountListArray) {
    let orderedArray = [...arr];
    for (let i = 0; i < orderedArray.length; i++) {
        for (let j = 0; j < orderedArray.length - i - 1; j++) {
            if(orderedArray[j].count < orderedArray[j+1].count){
                let temp = orderedArray[j];
                orderedArray[j] = orderedArray[j+1];
                orderedArray[j + 1] = temp;
            } else if (orderedArray[j].count == orderedArray[j+1].count){
                if (orderedArray[j].type.charAt(0) > orderedArray[j+1].type.charAt(0)) {
                    let temp = orderedArray[j];
                    orderedArray[j] = orderedArray[j+1];
                    orderedArray[j + 1] = temp;
                }
            }
        }
    }
    return orderedArray;
}
//#endregion

//#region Main method / OnReady / initialize
asyncLoadTypes(); // Load types from JSON and initialize teamList
$pokeNameInput = document.querySelector('#pokeNameInput');
$addBtn = document.querySelector('#addBtn');
$clrBtn = document.querySelector('#clrBtn');
$typePickerContainer = document.querySelector('#' + typePickerPopupState.id);
$primaryType = document.querySelector('#' + primaryTypeShellState.id);
$secondaryType = document.querySelector('#' + secondaryTypeShellState.id);
$teamList = document.querySelector('#teamList');
$defTypesCountList = document.querySelector('#def-types-count');
$defWeakList = document.querySelector('#def-weak-list');

$primaryType.addEventListener('click', onClick_PrimaryTypeShell);
$secondaryType.addEventListener('click', onClick_SecondaryTypeShell);
$addBtn.addEventListener('click', onClick_addBtn);
$clrBtn.addEventListener('click', clearInputs);


$teamList.addEventListener('click', teamListHandler);
$typePickerContainer.addEventListener('click', typePickerHandler);


// Analysis
//#endregion