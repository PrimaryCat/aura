// Global Vars
let settings = {
    // Searchbar Settings
    "searchEngine": "google",
    "searchbarPlaceholder": 'Enter command or search term, "au:help" for help.',
    // Calendar Settings
    "clockMode": "24",
    "clockDisplay": "true",
    "dateDisplay": "true",
    "dayForm": "full",
    // Quote Settings
    "quote": "Welcome to Aura",
    "quoteDisplay": "true",
    // Weather Settings
    "tempUnit": "c",
    "tempDisplay": "true",
    "weatherCity": "",
    "weatherKey": "",
    "weatherDisplay": "true",
    "weatherWidgetDisplay": "true",
    // Top Bar Settings
    "barOrder": ["clock", "quote", "weather"],
    "activeOrder": ["clock", "quote", "weather"],
    // Theming Settings
    "background": "#000",
    "foreground": "#fff",
    "accent": "#d6d6d6",
    "image": "Assets/default.jpg",
    "lmBackground": "#fff",
    "lmForeground": "#000",
    "lmAccent": "#d6d6d6",
    "lmImage": "Assets/defaultLight.jpg",
    "currentMode": "dark",
    "autoLightBegin": "0600",
    "autoLightEnd": "1800",
    "autoMode": "true",
    // Misc. Settings
    "displayLinkIndex": "true"
};

let links = [
    ["Source","https://github.com/PrimaryCat/aura"],
    ["Documentation","https://github.com/PrimaryCat/aura/blob/main/Docs/commands.md"],
    ["Themes","https://github.com/PrimaryCat/aura/blob/main/Docs/templates.md"],
    ["Other Projects","https://github.com/PrimaryCat/"],
]

const isBetween = function (value,min,max,inclusive=true){
    let result = false;
    if(min <= value && value <= max){
        result = true;
    }
    if(!inclusive){
        if(value === min || value === max){
            result = false;
        };
    };
    return result;
};

// Searchbar Logic
const searchLogic = (() => {
    // DOM Vars
    const searchBar = document.getElementById("searchbar");
    const searchBarDecoration = document.getElementById("searchbarDecoration");
    const errorMsg = document.getElementById("errorMessage");


    // DOM Methods
    searchBar.onkeydown = (event) => onKey(event);

    // Utility Vars
    let cmdMode = false;

    const _cmdParser = function(input, startIndex, endIndex = 1){
        let parsed = "";
        for(let i = startIndex; i < input.length - endIndex; i++){
            parsed += input[i];
            if(i < input.length - 1 - endIndex){
                parsed += " ";
            };
        };
        return parsed;
    };

    const _cmdCheck = function(input){
        if(/^![wgd] /.test(input) && cmdMode === false){
            switch(input.charAt(1)){
                case "w":
                    _search(input.slice(3),"wikipedia");
                    return;
                case "g":
                    _search(input.slice(3),"google");
                    return;
                case "d":
                    _search(input.slice(3),"duckduckgo");
                    return;
            }
        };
        if(/^!l /.test(input) && cmdMode === false){
            const linkIndex = parseInt(input.slice(3));
            if(isNaN(linkIndex)){
                errorMessage = "The link index must be a number.";
                errorMsg.innerHTML = errorMessage;
                searchBar.focus();
                return;
            }
            else if(isBetween(linkIndex,1,links.length)){
                window.location = links[linkIndex-1][1];
                return;
            }
            else{
                errorMessage = "Link " + linkIndex + " doesn't exist.";
                errorMsg.innerHTML = errorMessage;
                searchBar.focus();
                return;
            };
        };
        if(/^au:/.test(input) || cmdMode === true){
            let errorMessage = "";
            let commandList;
            if(cmdMode === true){
                commandList = input.split(" ");
            }
            else{
                commandList = input.slice(3).split(" ");
            };
            if(commandList.length > 0){
                switch(commandList[0]){
                    // Calendar Commands
                    case "clock-mode":
                    case "cm":
                        if(settings["clockMode"] === "24"){
                            settings["clockMode"] = "12";
                        }
                        else{
                            settings["clockMode"] = "24";
                        };
                        break;
                    
                    case "date-form":
                    case "df":
                        if(settings["dayForm"] === "full"){
                            settings["dayForm"] = "short";
                        }
                        else{
                            settings["dayForm"] = "full";
                        };
                        break;
                    
                    case "calendar-display":
                    case "cd":
                        if(commandList.length === 3){
                            const components = [];
                            switch(commandList[1]){
                                case "c":
                                    components.push("clockDisplay");
                                    break;
                                case "d":
                                    components.push("dateDisplay");
                                    break;
                                case "a":
                                    components.push("clockDisplay");
                                    components.push("dateDisplay");
                                    break;
                                default:
                                    errorMessage = "Invalid component argument.";
                                    break;
                            };
                            if(components === []){
                                break;
                            }
                            else{
                                if(commandList[2] === "true" || commandList[2] === "false"){
                                    components.forEach(component => {
                                        settings[component] = commandList[2];
                                    });
                                    topBar.refresh();
                                }
                                else{
                                    errorMessage = "Invalid visibility argument."
                                };
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[cd || calendar-display] <component> <visibility>"'
                        };
                        break;
                    
                    // Quote commands
                    case "quote-set":
                    case "qs":
                        if(commandList.length >= 2){
                            const quote = _cmdParser(commandList, 1, 0);
                            settings["quote"] = quote;
                            topBar.updateQuote();
                            break;
                        }
                        else{
                            errorMessage = 'Usage: "au:[qs || quote-set] <quote text>"'
                        }
                        break;
                    
                    case "quote-display":
                    case "qd":
                        if(settings["quoteDisplay"] === "true"){
                            settings["quoteDisplay"] = "false";
                            topBar.updateQuote("");
                            topBar.refresh();
                        }
                        else{
                            settings["quoteDisplay"] = "true";
                            topBar.updateQuote(settings["quote"]);
                            topBar.refresh();
                        }
                        break;

                    // Weather commands
                    case "weather-setup":
                    case "ws":
                        if(commandList.length >= 3){
                            const cityName = _cmdParser(commandList, 1);
                            settings["weatherCity"] = cityName;
                            settings["weatherKey"] = commandList[commandList.length-1];
                            weatherWidget.setWeather();
                        }
                        else{
                            errorMessage = 'Usage: "au:[ws || weather-setup] <city name> <API key>"'
                        }
                        break;
                    
                    case "weather-display":
                    case "wd":
                        if(commandList.length === 3){
                            let component = "";
                            switch(commandList[1]){
                                case "t":
                                    component = "temp";
                                    break;
                                case "s":
                                    component = "status";
                                    break;
                                case "a":
                                    component = "widget";
                                    break;
                                default:
                                    errorMessage = "Invalid component argument.";
                                    break;
                            };
                            if(component === ""){
                                break;
                            }
                            else{
                                if(commandList[2] === "true" || commandList[2] === "false"){
                                    switch(component){
                                        case "temp":
                                            settings["tempDisplay"] = commandList[2];
                                            break;
                                        case "status":
                                            settings["weatherDisplay"] = commandList[2];
                                            break;
                                        case "widget":
                                            settings["weatherWidgetDisplay"] = commandList[2];
                                            break;
                                    };
                                weatherWidget.setWeather();
                                topBar.refresh();
                                }
                                else{
                                    errorMessage = "Invalid visibility argument."
                                };
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[wd || weather-display] <component> <visibility>"'
                        };
                        break;
                    
                    case "weather-unit":
                    case "wu":
                        if(settings["tempUnit"] === "c"){
                            settings["tempUnit"] = "f";
                        }
                        else{
                            settings["tempUnit"] = "c";
                        }
                        weatherWidget.setWeather();
                        break;
                    
                    // Top bar commands
                    case "topbar-arrange":
                    case "ta":
                        if(commandList.length === 4){
                            const sortedArray = [];
                            for(let i = 1; i < 4; i++){
                                if(commandList[i] === "clock" || commandList[i] === "quote" || commandList[i] === "weather"){
                                    sortedArray.push(commandList[i]);
                                };
                            };
                            if(sortedArray.length === 3){
                                settings["barOrder"] = sortedArray;
                                topBar.refresh();
                            }
                            else{
                                errorMessage = 'Accepted widget names are "clock", "quote" and "weather".'
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[ta || topbar-arrange] <first widget> <second widget> <third widget>"'
                        }
                        break;

                    // Searchbar commands
                    case "search-engine":
                    case "se":
                        if(commandList.length === 2){
                            switch(commandList[1]){
                                case "duckduckgo":
                                case "google":
                                case "wikipedia":
                                    settings["searchEngine"] = commandList[1];
                                    break;
                                default:
                                    errorMessage = "Missing or unrecognized search engine."
                                    break;
                            }
                        }
                        else{
                            errorMessage = 'Usage: "au:[se || search-engine] <search engine>"'
                        }
                        break;
                    
                    case "search-placeholder":
                    case "sp":
                        if(commandList.length >= 2){
                            const placeholder = _cmdParser(commandList, 1, 0);
                            settings["searchbarPlaceholder"] = placeholder;
                            DOMLogic.refresh();
                            break;
                        }
                        else{
                            errorMessage = 'Usage: "au:[sp || search-placeholder] <placeholder text>"'
                        }
                        break;
                    
                    // Link List Commands
                    case "link-add":
                    case "la":
                        if(commandList.length >= 3){
                            const linkName = _cmdParser(commandList, 1);
                            errorMessage = DOMLogic.addLink(linkName, commandList[commandList.length-1]);
                        }
                        else{
                            errorMessage = 'Usage: "au:[la || link-add] <link name> <link URL>"'
                        }
                        break;

                    case "link-remove":
                    case "lr":
                        if(commandList.length === 2){
                            const linkIndex = parseInt(commandList[1]);
                            if(isNaN(linkIndex)){
                                errorMessage = "The link index must be a number."
                            }
                            else{
                                errorMessage = DOMLogic.removeLink(linkIndex);
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[lr || link-remove] <link index>"'
                        }
                        break;

                    case "link-set":
                    case "ls":
                        if(commandList.length >= 4){
                            const linkIndex = parseInt(commandList[1]);
                            if(isNaN(linkIndex)){
                                errorMessage = "The link index must be a number."
                            }
                            else{
                                let component;
                                switch(commandList[2]){
                                    case "a":
                                        component = _cmdParser(commandList, 3);
                                        errorMessage = DOMLogic.setLink(linkIndex, "a", [component, commandList[commandList.length-1]]);
                                        break;
                                    case "n":
                                        component = _cmdParser(commandList, 3, 0);
                                        errorMessage = DOMLogic.setLink(linkIndex, "n", component)
                                        break;
                                    case "u":
                                        component = commandList[3];
                                        errorMessage = DOMLogic.setLink(linkIndex, "u", component);
                                        break;
                                    default:
                                        errorMessage = 'Accepted component arguments are "a", "n" and "u".';
                                        break;
                                };
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[ls || link-set] <link index> <link component> <link name> <link URL>"'
                        }
                        break;
                    
                    case "link-swap":
                    case "lw":
                        if(commandList.length === 3){
                            const firstIndex = parseInt(commandList[1]) - 1;
                            const secondIndex = parseInt(commandList[2]) - 1;
                            if(isNaN(firstIndex) || isNaN(secondIndex)){
                                errorMessage = "Both arguments need to be numbers."
                            }
                            else{
                                errorMessage = DOMLogic.swapLinks(firstIndex, secondIndex);
                            }
                        }
                        else{
                            errorMessage = 'Usage: "au:[lw || link-swap] <link index> <link index>"'
                        };
                        break;
                    
                    case "link-insert":
                    case "li":
                        if(commandList.length === 3){
                            const firstIndex = parseInt(commandList[1]) - 1;
                            const secondIndex = parseInt(commandList[2]) - 1;
                            if(isNaN(firstIndex) || isNaN(secondIndex)){
                                errorMessage = "Both arguments need to be numbers."
                            }
                            else{
                                errorMessage = DOMLogic.insertLink(firstIndex, secondIndex);
                            }
                        }
                        else{
                            errorMessage = 'Usage: "au:[li || link-insert] <link index> <insert index>"'
                        };
                        break;
                    
                    case "links-display-index":
                    case "ldi":
                        if(settings["displayLinkIndex"] === "true"){
                            settings["displayLinkIndex"] = "false";
                            DOMLogic.refresh();
                        }
                        else{
                            settings["displayLinkIndex"] = "true";
                            DOMLogic.refresh();
                        };
                        break;
                    
                    case "links-export":
                    case "exl":
                        settingsLogic.exportManager("links");
                        break;
                    
                    case "links-import":
                    case "iml":
                        settingsLogic.importManager("links");
                        break;

                    // Settings Commands
                    case "settings-save":
                    case "ss":
                        settingsLogic.save();
                        break;

                    case "settings-load":
                    case "sl":
                        settingsLogic.load();
                        break;

                    case "settings-reset":
                    case "sr":
                        settingsLogic.reset();
                        break;
                    
                    case "settings-export":
                    case "exs":
                        settingsLogic.exportManager("settings");
                        break;
                    
                    case "settings-import":
                    case "ims":
                        settingsLogic.importManager("settings");
                        break;
                    
                    case "theme-export":
                    case "ext":
                        settingsLogic.exportManager("theme");
                        break;
                    
                    // Theming Commands                    
                    case "color-background":
                    case "cb":
                        if(commandList.length === 2){
                            if(settings["currentMode"] === "dark"){
                                settings["background"] = commandList[1];
                            }
                            else{
                                settings["lmBackground"] = commandList[1];
                            };
                            DOMLogic.refresh();   
                        }
                        else{
                            errorMessage = 'Usage: "au:[cb || color-background] <CSS color>"'
                        }
                        break;

                    case "color-foreground":
                    case "cf":
                        if(commandList.length === 2){
                            if(settings["currentMode"] === "dark"){
                                settings["foreground"] = commandList[1];
                            }
                            else{
                                settings["lmForeground"] = commandList[1];
                            };
                            DOMLogic.refresh();
                        }
                        else{
                            errorMessage = 'Usage: "au:[cf || color-foreground] <CSS color>"'
                        }
                        break;

                    case "color-accent":
                    case "ca":
                        if(commandList.length === 2){
                            if(settings["currentMode"] === "dark"){
                                settings["accent"] = commandList[1];
                            }
                            else{
                                settings["lmAccent"] = commandList[1];
                            };
                            DOMLogic.refresh();
                        }
                        else{
                            errorMessage = 'Usage: "au:[ca || color-accent] <CSS color>"'
                        }
                        break;

                    case "image-set":
                    case "is":
                        if(commandList.length === 2){
                            if(settings["currentMode"] === "dark"){
                                settings["image"] = commandList[1];
                            }
                            else{
                                settings["lmImage"] = commandList[1];
                            };
                            DOMLogic.refresh();
                        }
                        else{
                            errorMessage = 'Usage: "au:[is || image-set] <image URL>"'
                        }
                        break;
                    
                    case "image-clear":
                    case "ic":
                        settings["image"] = "Assets/default.jpg";
                        settings["lmImage"] = "Assets/defaultLight.jpg";
                        DOMLogic.refresh();
                        break;
                    
                    case "darkmode":
                    case "dm":
                        settings["currentMode"] = "dark";
                        DOMLogic.refresh();
                        break;

                    case "lightmode":
                    case "lm":
                        settings["currentMode"] = "light";
                        DOMLogic.refresh();
                        break;

                    case "lightmode-auto":
                    case "lma":
                        if(commandList.length > 1){
                            switch(commandList[1]){
                                case "true":
                                    if(commandList.length === 2){
                                        settings["autoMode"] = commandList[1];
                                        break;
                                    }
                                    else if(commandList.length === 4){
                                        const lmBegin = parseInt(commandList[2]);
                                        const lmEnd = parseInt(commandList[3]);
                                        if (isNaN(lmBegin) || isNaN(lmEnd)) {
                                            errorMessage = "Hours provided must be numbers.";
                                        }
                                        else if (isBetween(lmBegin,0,2400) && isBetween(lmEnd,0,2400)) {
                                            settings["autoMode"] = commandList[1];
                                            settings["autoLightBegin"] = commandList[2];
                                            settings["autoLightEnd"] = commandList[3];
                                        }
                                        else{
                                            errorMessage = "Hours provided must be between 0000 and 2400";
                                        };
                                        break;
                                    }
                                    else{
                                        errorMessage = "You must provide a beginning and an end hour for auto-lightmode in 24 hour format.";
                                        break;
                                    };
                                case "false":
                                    settings["autoMode"] = commandList[1];
                                    break;
                                default:
                                    errorMessage = 'State can be set to "true" or "false" only.';
                                    break;
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[lma || lightmode-auto] <state> <lightmode begin hour> <lightmode end hour>"'
                        };
                        break;
                    
                    // Utility Commands
                    case "message-clear":
                    case "mc":
                        errorMessage = "";
                        break;

                    case "terminal-mode":
                    case "tm":
                        cmdMode = !cmdMode;
                        if(cmdMode === true){
                            searchBarDecoration.innerText = "$";
                            searchBarDecoration.style.fontSize = "16px";
                            searchBar.setAttribute("placeholder","Enter command...");
                        }
                        else{
                            searchBarDecoration.innerText = ">";
                            searchBarDecoration.style.fontSize = "12px";
                            searchBar.setAttribute("placeholder",settings["searchbarPlaceholder"]);
                        };
                        break;
                    
                    case "help":
                    case "h":
                        errorMessage = 'Please refer to the <a href="https://github.com/KazaKazan/aura/blob/main/Docs/commands.md">documentation</a> for help.'
                        break;

                    default:
                        errorMessage = 'Command not recognized "' + commandList[0] + '".'
                        break;
                }
            }
            else{
                errorMessage = 'Usage: "au:<command> <parameters>"'
            };
            errorMsg.innerHTML = errorMessage;
            searchBar.focus();
        }
        else{
            _search(input);
        };
    };
     
    const _search = function (term,engine=settings["searchEngine"]) {
        let url;
        term = term.split(" ");
        switch(engine){
            case "google":
                url = "https://www.google.com/search?q=";
                break;
            case "duckduckgo":
                url = "https://duckduckgo.com/?q=";
                break;
            case "wikipedia":
                url = "https://wikipedia.org/w/index.php?search="
                break;
        }
        for (let i = 0; i < term.length; i++){
            url += term[i];
            url += "+";
        };
        window.location.href = url;
    };

    const onKey = function (key) {
        if (key.keyCode === 13){
            input = searchBar.value;
            searchBar.value = "";
            searchBar.blur();
            _cmdCheck(input);
        };
    };

    return{
        onKey
    };
})();

// Top Bar Logic
const topBar = (() => {

    // DOM vars
    const topBarDiv = document.getElementById("topBar");
    const clockContaier = document.getElementById("clockContainer");
    const quoteContaier = document.getElementById("quoteContainer");
    const weatherContaier = document.getElementById("weatherContainer");
    const firstDivider = document.getElementById("firstDivider");
    const secondDivider = document.getElementById("secondDivider");

    // Other vars
    let visibleWidgetCount;
    let visibleWidgets = [];

    const _getVisibility = function () {
        visibleWidgetCount = 0;
        visibleWidgets = [];
        if(settings["clockDisplay"] === "true" || settings["dateDisplay"] === "true"){
            visibleWidgetCount += 1;
            visibleWidgets.push("clock");
        };
        if(settings["quoteDisplay"] === "true"){
            visibleWidgetCount += 1;
            visibleWidgets.push("quote");
        };
        if(settings["weatherWidgetDisplay"] === "true"){
            visibleWidgetCount += 1;
            visibleWidgets.push("weather");
        };
    };

    const _reorder = function () {
        settings["activeOrder"] = settings["barOrder"];
        const sortedArray = [];
        settings["activeOrder"].forEach(element => {
            if(visibleWidgets.includes(element)){
                sortedArray.push(element);
            };
        });
        settings["activeOrder"].forEach(element => {
            if(!visibleWidgets.includes(element)){
                sortedArray.push(element);
            };
        });
        settings["activeOrder"] = sortedArray;
        for(let i = 0; i < 3; i++){
            let element;
            let order;
            switch(settings["activeOrder"][i]){
                case "clock":
                    element = clockContaier;
                    break;
                case "quote":
                    element = quoteContaier;
                    break;
                case "weather":
                    element = weatherContaier;
                    break;
            };
            switch(i){
                case 0:
                    order = "topFirst";
                    break;
                case 1:
                    order = "topSecond";
                    break;
                case 2:
                    order = "topThird";
                    break;
            };
            element.className = order;
        };
    };

    const _rearrange = function () {
        switch(visibleWidgetCount){
            case 1:
                topBarDiv.style.gridTemplateColumns = "0 0 100% 0 0";
                topBarDiv.style.gridTemplateAreas = '"second fDivider first sDivider third"';
                firstDivider.innerText = "";
                secondDivider.innerText = "";
                break;
            case 2:
                topBarDiv.style.gridTemplateColumns = "50% 0 0 0 50%";
                topBarDiv.style.gridTemplateAreas = '"first fDivider third sDivider second"';
                firstDivider.innerText = "";
                secondDivider.innerText = "";
                break;
            case 3:
                topBarDiv.style.gridTemplateColumns = "32% 2% 32% 2% 32%";
                topBarDiv.style.gridTemplateAreas = '"first fDivider second sDivider third"';
                firstDivider.innerText = "|";
                secondDivider.innerText = "|";
                break;
        };
    };

    const refresh = function () {
        _getVisibility();
        _reorder();
        _rearrange();
    };

    const updateQuote = function () {
        if(settings["quoteDisplay"] === "true"){
            quoteContaier.innerText = settings["quote"];
        }
        else{
            quoteContaier.innerText = "";
        };
    };

    const updateClock = function (timeString) {
        clockContaier.innerText = timeString;
    };

    const updateWeather = function (weatherString) {
        weatherContaier.innerText = weatherString;
    };

    return{
        refresh,
        updateQuote,
        updateClock,
        updateWeather
    }
})();

const weatherWidget = (() => {

    const _capitalizeText = function (stringToCapitalize) {
        const words = stringToCapitalize.toLowerCase().split(" ");
        let returnString = "";
        words.forEach(word => {
            returnString += word[0].toUpperCase() + word.substring(1) + " ";
        });
        return  returnString;
    };

    const _getData = async function () {
        const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${settings["weatherCity"]}&limit=1&appid=${settings["weatherKey"]}`;
        const response = await fetch(geoURL);
        const coordData = await response.json();
        return coordData[0];
    };

    const _getWeather = async function () {
        const coordData = await _getData();
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordData["lat"]}&lon=${coordData["lon"]}&appid=${settings["weatherKey"]}`;
        const response = await fetch(weatherURL);
        const weatherData = await response.json();
        return {
            "tempKelvin": weatherData["main"]["temp"],
            "weatherStatus": weatherData["weather"][0]["description"]
        };
    };

    const _tempConvert = function (tempString) {
        const tempFloat = parseFloat(tempString);
        let tempText;
        if(settings["tempUnit"] === "c"){
            tempText = Math.round(tempFloat - 273.15) + "°C";
        }
        else{
            tempText = Math.round(((tempFloat - 273.15) * 1.8) + 32) + "°F";
        };
        return tempText;
    };

    const _createText = async function () {
        const data = await _getWeather();
        let text = "";
        if(settings["tempDisplay"] === "true"){
            text += _tempConvert(data["tempKelvin"]);
        };
        if(settings["weatherDisplay"] === "true"){
            if(settings["tempDisplay"] === "true"){
                text += " - ";
            };
            text += _capitalizeText(data["weatherStatus"]);
        };
        return text;
    };

    const setWeather = async function () {
        if(settings["weatherWidgetDisplay"] === "true"){
            if(settings["weatherKey"] != "" && settings["weatherCity"] != ""){
                const weatherText = await _createText();
                topBar.updateWeather(weatherText);
            };
        }
        else{
            topBar.updateWeather("");
        };
    };

    return{
        setWeather
    }
})();

// Clock Logic
const clock = (() => {
    // Naming Vars
    const days = ["Sunday", "Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    // Private Functions
    const _checkTime = function (time,checkHour=false){
        if (checkHour === true) {
            if (time > 12 && settings["clockMode"] === "12") {
                time -= 12;
            };
        };

        if (time < 10) {
            time = "0" + time;
        };
        return time;
    };

    // Public Functions
    const displayTime = function () {
        let clockText = "";
        const today = new Date();
        if(settings["dateDisplay"] === "true"){
            let day = days[today.getDay()];
            if(settings["dayForm"] === "short"){
                day = day.slice(0,3);
            };
            clockText += day + ", " + months[today.getMonth()] + " " + today.getDate()
        };
        if(settings["dateDisplay"] === "true" && settings["clockDisplay"] === "true"){
            clockText += " - " ;
        };
        let h = today.getHours();
        let m = today.getMinutes();
        if(settings["clockDisplay"] === "true"){
            clockText += _checkTime(h, true) + ":" + _checkTime(m);;
            if(settings["clockMode"] === "12"){
                if(h > 12){
                    clockText +=  " PM";
                }
                else{
                    clockText +=  " AM";
                };
            }
        };
        topBar.updateClock(clockText);
        if(settings["autoMode"] === "true"){checkLightMode(h+String(m).padStart(2,"0"))};
        setTimeout(displayTime, 1000);
    };

    const checkLightMode = function (currentTime){
        if(isBetween(parseInt(currentTime),parseInt(settings["autoLightBegin"]),parseInt(settings["autoLightEnd"]))){
            if(settings["currentMode"] === "dark"){
                settings["currentMode"] = "light";
                DOMLogic.refresh();
            };
        }
        else{
            if(settings["currentMode"] === "light"){
                settings["currentMode"] = "dark";
                DOMLogic.refresh();
            };
        };
    };

    return{
        displayTime,
        checkLightMode
    };
})();

// DOM Manipulator
const DOMLogic = (() => {
    //DOM Vars
    const linkContainer = document.getElementById("linkContainer");
    const imageElement = document.getElementById("image");
    const searchBar = document.getElementById("searchbar");
    const settingsWindow = document.getElementById("popupWindow");

    const refresh = function () {
        // Re-create links
        linkContainer.innerHTML = "";
        links.forEach(link => {
            newLink = document.createElement("a");
            newLink.setAttribute("tabindex","-1");
            newLink.setAttribute("href",link[1]);
            if(settings["displayLinkIndex"] === "true"){
                newLink.innerText = links.indexOf(link) + 1 + ") ";
            }
            else{
                newLink.innerText = "";
            };
            newLink.innerText += link[0];
            linkContainer.appendChild(newLink);
        });
        // Set page colors and the image
        if(settings["currentMode"] == "dark"){
            document.documentElement.style.setProperty("--background", settings["background"]);
            document.documentElement.style.setProperty("--foreground", settings["foreground"]);
            document.documentElement.style.setProperty("--accent-one", settings["accent"]);
            imageElement.setAttribute("src",settings["image"]);
        }
        else{
            document.documentElement.style.setProperty("--background", settings["lmBackground"]);
            document.documentElement.style.setProperty("--foreground", settings["lmForeground"]);
            document.documentElement.style.setProperty("--accent-one", settings["lmAccent"]);
            imageElement.setAttribute("src",settings["lmImage"]);
        }
        // Set searchbar placeholder
        searchBar.setAttribute("placeholder",settings["searchbarPlaceholder"])
    };

    const addLink = function (linkName, linkURL) {
        links.push([linkName,linkURL]);
        refresh();
        return "";
    };

    const removeLink = function (index) {
        if(links.length > 0){
            if(index === -1){
                links = [];
                refresh();
                return "";
            };
            if(isBetween(index,0,links.length)){
                links.splice(index - 1,1);
                refresh();
                return "";
            }
            else{
                return "Link " + index + " doesn't exist.";
            };
        };
        return "There's nothing to remove."
    };

    const setLink = function (index, component, arguments) {
        if(isBetween(index,0,links.length)){
            switch(component){
                case "a":
                    if(arguments.length === 2 && arguments[0] !== ""){
                        links[index-1] = arguments;
                        break;
                    }
                    return "A display name and a link must be supplied.";
                case "n":
                    links[index-1][0] = arguments;
                    break;
                case "u":
                    links[index-1][1] = arguments;
                    break;
            }
            refresh();
            return "";
        }
        return "Link " + index + " doesn't exist."
    };

    const swapLinks = function (fIndex, sIndex){
        if(isNaN(fIndex) || isNaN(sIndex)){
            return "Both arguments need to be numbers.";
        }
        else{
            if(isBetween(fIndex,0,links.length) && isBetween(sIndex,0,links.length)){
                [links[fIndex], links[sIndex]] = [links[sIndex], links[fIndex]];
                refresh();
                return "";
            }
            else{
                return "Argument(s) out of list range.";
            };
        };
    };

    const insertLink = function (lIndex, iIndex){
        if(links.length > 0){
            if(isBetween(lIndex,0,links.length-1)){
                const link = links[lIndex];
                links.splice(lIndex, 1);
                links.splice(iIndex, 0, link);
                refresh()
                return "";
            }
            else{
                return "Link " + (lIndex + 1) + " doesn't exist.";
            };
        };
        return "The link list is empty."
    };

    const toggleSettings = function () {
        settingsWindow.classList.toggle("hidden");
    };

    return{
        refresh,
        addLink,
        removeLink,
        setLink,
        swapLinks,
        insertLink,
        toggleSettings
    };
})();

// Saving and loading functions for the settings and the links
const settingsLogic = (() => {
    // DOM vars
    const settingsTitle = document.getElementById("popupTitle");
    const settingsField = document.getElementById("exportImport");
    const settingsButton = document.getElementById("settingsButton");

    const save = function () {
        window.localStorage.setItem("settings",JSON.stringify(settings));
        window.localStorage.setItem("links",JSON.stringify(links));
    };
    
    const load = function () {
        let storedSettings = window.localStorage.getItem("settings");
        if(storedSettings !== null){
            settingStorage = JSON.parse(storedSettings);
            for (const [key, value] of Object.entries(settingStorage)) {
                if(settings.hasOwnProperty(key)){
                    settings[key] = value;
                };
              };
        };
        linkStorage = JSON.parse(window.localStorage.getItem("links"));
        if(linkStorage !== null){
            links = linkStorage;
        };
        clock.checkLightMode;
        DOMLogic.refresh();
    };

    const reset = function () {
        window.localStorage.clear();
        location.reload();
    };

    const exportManager = function (mode) {
        settingsButton.onclick = () => DOMLogic.toggleSettings();
        settingsTitle.innerText = "Please save the below text.";
        if(mode==="links"){
            settingsField.value = JSON.stringify(links);
        }
        else if(mode==="theme"){
            let theme = {};
            theme["background"] = settings["background"];
            theme["foreground"] = settings["foreground"];
            theme["accent"] = settings["accent"];
            theme["image"] = settings["image"];
            theme["lmBackground"] = settings["lmBackground"];
            theme["lmForeground"] = settings["lmForeground"];
            theme["lmAccent"] = settings["lmAccent"];
            theme["lmImage"] = settings["lmImage"];
            settingsField.value = JSON.stringify(theme);
        }
        else{
            settingsField.value = JSON.stringify(settings);
        };
        DOMLogic.toggleSettings();
    };

    const importManager = function (mode) {
        settingsButton.onclick = () => _importer(mode);
        settingsField.value = "";
        if(mode==="links"){
            settingsTitle.innerText = "Please input your links below.";
        }
        else{
            settingsTitle.innerText = "Please input your settings below.";  
        };
        DOMLogic.toggleSettings();
    };

    const _importer = function (mode) {
        console.log("hey!");
        if(settingsField.value !== ""){
            if(mode === "links"){
                links = JSON.parse(settingsField.value);
            }
            else{
                settingStorage = JSON.parse(settingsField.value);
                for (const [key, value] of Object.entries(settingStorage)) {
                    if(settings.hasOwnProperty(key)){
                        settings[key] = value;
                    };
                  };
            }
            DOMLogic.toggleSettings();
            DOMLogic.refresh();
        }
        else{
            DOMLogic.toggleSettings();
        }
    };

    return{
        save,
        load,
        reset,
        exportManager,
        importManager
    };
})();

// Start
settingsLogic.load();
DOMLogic.refresh();
topBar.updateQuote();
topBar.refresh();
clock.displayTime();
weatherWidget.setWeather();
