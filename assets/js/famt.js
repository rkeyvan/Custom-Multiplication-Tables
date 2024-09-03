/******************************************************************************
* file: famt.js
*******************************************************************************
* Description:
*   This script creates the multiplication table based on the user's desired length. 
*   Additionally, it provides the highlighting when the user's cursor hovers over the
*   created table. Lastly, if the user chooses to have "Server" calculate thier desired 
*   multiplication table, this script will pass that data to the back-end script called
*   "famt.php". It will then respond with a html table that javascript will paste to
*   the front-end.
*
******************************************************************************/

/***** GLOBAL ****************************************************************/

// Load the main function that sets up the user interface.
window.addEventListener("load", famtMain);

// Size limit when using Javascript to create multiplication table
const MAX_DIFFERENCE = 50;

/***** END OF GLOBAL *********************************************************/

/***** noColumnHighlight ******************************************************
*
* This function fixes an unintended vertical background color effect. This 
* happens when the user is not hovering over the multiplication table yet the
* last known element that was hovered still contains the background color.
*
* Parameters:
*   ev              -- the hover out element in the the multiplication table
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
function noColumnHighlight(ev){
    var colHighlightEl = document.getElementById("colHighlight");
    var styleSheet = colHighlightEl.sheet;
    if(styleSheet.cssRules.length > 0){
        styleSheet.deleteRule(styleSheet.cssRules.length - 1);
    }
} // end of "noColumnHighlight"

/***** dispColumnHighlight ***************************************************
*
* This function adds a rule to the internal style element to create the 
* vertical background color hover effect in the multiplication table. If a rule 
* already exists, that rule is deleted before add the new rule.
*
* Parameters:
*   ev              -- the hovered element in the the multiplication table
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
function dispColumnHighlight(ev){
    var colHighlightEl = document.getElementById("colHighlight");
    var styleSheet = colHighlightEl.sheet;
    for(let i = 0; i < ev.target.classList.length; ++i){
        if(ev.target.classList[i].match(/col[0-9]*/)){
            if(styleSheet.cssRules.length > 0){
                styleSheet.deleteRule(styleSheet.cssRules.length - 1);
            }
            styleSheet.insertRule("." + ev.target.classList[i] + "{ background-color: #ccc; }", styleSheet.cssRules.length);
        }
    }
} // end of "dispColumnHighlight"

/***** highlightInputErr ********************************************************
*
* This function adds an error class to form inputs based on the data parameter.
*
* Parameters:
*   data        -- an array of named inputs
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
function highlightInputErr(data){
    let colStartEl = document.getElementById('colStart');
    let colEndEl = document.getElementById('colEnd');
    let rowStartEl = document.getElementById('rowStart');
    let rowEndEl = document.getElementById('rowEnd');

    if(data.length > 0){
        for(let i = 0; i < data.length; ++i){
            if(data[i] == 'Column Start'){
                colStartEl.classList.add('famt__input--error');
            }
            if(data[i] == 'Column End'){
                colEndEl.classList.add('famt__input--error');
            }
            if(data[i] == 'Row Start'){
                rowStartEl.classList.add('famt__input--error');
            }
            if(data[i] == 'Row End'){
                rowEndEl.classList.add('famt__input--error');
            }
            if(data[i] == 'Column Difference'){
                colStartEl.classList.add('famt__input--error');
                colEndEl.classList.add('famt__input--error');
            }
            if(data[i] == 'Row Difference'){
                rowStartEl.classList.add('famt__input--error');
                rowEndEl.classList.add('famt__input--error');
            }
        }
    }
} // end of "highlightInputErr"

/***** clearInputErrors ********************************************************
*
* This function removes all error classes in the form inputs.
*
* Parameters:
*   none
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
function clearInputErrors() {
        let colStartEl = document.getElementById('colStart');
        let colEndEl = document.getElementById('colEnd');
        let rowStartEl = document.getElementById('rowStart');
        let rowEndEl = document.getElementById('rowEnd');

        colStartEl.classList.remove('famt__input--error');
        colEndEl.classList.remove('famt__input--error');
        rowStartEl.classList.remove('famt__input--error');
        rowEndEl.classList.remove('famt__input--error');
} // end of "clearInputErrors"

/***** createTablePHP *********************************************************
*
* This function creates the multiplication table using famt.php through the 
* fetch() API. It then recieves the PHP response data to display it.
*
* Parameters:
*   colStart        -- the starting column value
*   colEnd          -- the ending column value
*   rowStart        -- the starting row value
*   rowEnd          -- the ending row value
*   table           -- the HTML table element that will recieve the data
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
async function createTablePHP(colStart, colEnd, rowStart, rowEnd, table){
    var params = 'cMin=' + colStart + '&cMax=' + colEnd + '&rMin=' + rowStart + '&rMax=' + rowEnd;
    var response = await fetch("assets/php/famt.php?" + params);
    var data = await response.text();
    data = JSON.parse(data);
    clearInputErrors();
    if(data['err'].length > 0){
        highlightInputErr(data['err']);
        let text = data['qed'];
        insertErrorMessage(text);
    } else {
        table.innerHTML += data['qed'];
    }
} // end of "createTablePHP"

/***** createTableJS **********************************************************
*
* This function creates the table using Javascript on the client's device.
*
* Parameters:
*   colStart        -- the starting column value
*   colEnd          -- the ending column value
*   rowStart        -- the starting row value
*   rowEnd          -- the ending row value
*   table           -- the HTML table tag that will receive the data
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
async function createTableJS(colStart, colEnd, rowStart, rowEnd, table){
    table.innerHTML += `<thead class="famt__thead"><tr id="tr" class="famt__tr">`;

    var tr = document.getElementById("tr");
    var colCounter = 1;
    var rowCounter = 1;
    tr.innerHTML += `<th class="famt__th famt--js row${rowCounter} col${colCounter}">My<br>Device</th>`;
    ++colCounter;

    // Check whether to increment or decrement starting at $colStart value.
    if(colStart > colEnd){
        for(let i = colStart; i >= colEnd; --i){
            let num = i;
            if(num % 1 != 0){
                num = num.toFixed(1);
            }
            tr.innerHTML += `<th class="famt__th row${rowCounter} col${colCounter}">${num}</th>`;
            ++colCounter;
        } // end of for()
    } else {
        for(let i = colStart; i <= colEnd; ++i){ // idkJS()
            let num = i;
            if(num % 1 != 0){
                num = num.toFixed(1);
            }
            tr.innerHTML += `<th class="famt__th row${rowCounter} col${colCounter}">${num}</th>`;
            ++colCounter;
        } // end of for()
    }

    ++rowCounter;
    table.innerHTML += `</tr></thead>`;
    table.innerHTML += `<tbody id="famtBody" class="famt__tbody">`;
    var tbody = document.getElementById("famtBody");

    if(rowStart > rowEnd){
        for(let j = rowStart; j >= rowEnd; --j){
            colCounter = 1;
            tbody.innerHTML += `<tr id="trCurrent" class="famt__tr">`;

            let trTemp = document.getElementById("trCurrent");

            let num = j;
            if(num % 1 != 0){
                num = num.toFixed(1);
            }
            trTemp.innerHTML += `<th class="famt__th row${rowCounter} col${colCounter}">${num}</td>`;
            colCounter++;

            if(colStart > colEnd){
                for(let k = colStart; k >= colEnd; --k){
                    let num = j * k;
                    if(num % 1 != 0){
                        num = num.toFixed(1);
                    }
                    trTemp.innerHTML += `<td class="famt__td row${rowCounter} col${colCounter}">${num}</td>`;
                    ++colCounter
                } // end of for()
            } else {
                for(let k = colStart; k <= colEnd; ++k){
                    let num = j * k;
                    if(num % 1 != 0){
                        num = num.toFixed(1);
                    }
                    trTemp.innerHTML += `<td class="famt__td row${rowCounter} col${colCounter}">${num}</td>`;
                    ++colCounter
                } // end of for()
            }

            ++rowCounter;
            trTemp.innerHTML += `</tr>`;
            trTemp.removeAttribute("id");
        } // end of for()
        table.innerHTML += `</tbody>`;
    } else {
        for(let j = rowStart; j <= rowEnd; ++j){ // idkJS()
            colCounter = 1;
            tbody.innerHTML += `<tr id="trCurrent" class="famt__tr">`;

            let trTemp = document.getElementById("trCurrent");

            let num = j;
            if(num % 1 != 0){
                num = num.toFixed(1);
            }
            trTemp.innerHTML += `<th class="famt__th row${rowCounter} col${colCounter}">${num}</td>`;
            colCounter++;

            if(colStart > colEnd){
                for(let k = colStart; k >= colEnd; --k){
                    let num = j * k;
                    if(num % 1 != 0){
                        num = num.toFixed(1);
                    }
                    trTemp.innerHTML += `<td class="famt__td row${rowCounter} col${colCounter}">${num}</td>`;
                    ++colCounter
                } // end of for()
            } else {
                for(let k = colStart; k <= colEnd; ++k){
                    let num = j * k;
                    if(num % 1 != 0){
                        num = num.toFixed(1);
                    }
                    trTemp.innerHTML += `<td class="famt__td row${rowCounter} col${colCounter}">${num}</td>`;
                    ++colCounter
                } // end of for()
            }

            ++rowCounter;
            trTemp.innerHTML += `</tr>`;
            trTemp.removeAttribute("id");
        } // end of for()
        table.innerHTML += `</tbody>`; 
    }
} // end of "createTableJS"

/***** chkStartEndDiff ********************************************************
*
* Check if the difference between two variables is greater then the global
* "MAX_DIFFERENCE" constant. If it is then "error style" those inputs and
* return false.
*
* Parameters:
*   start               -- the starting Number value
*   end                 -- the ending Number value
*   startName           -- the start input name
*   endName             -- the end input name
*
* Return:
*   true       -- start and end difference not greater then "MAX_DIFFERENCE"
*   false      -- start and end difference greater then "MAX_DIFFERENCE"
*
******************************************************************************/
function chkStartEndDiff(start, end, startName, endName){

    var diff;
    
    if(start > end){
        diff = (start - end) + 1;;
    } else {
        diff = (end - start) + 1;;
    }

    if(diff > MAX_DIFFERENCE){
        let text = 'The table you are trying to create is too large!<br>The range between ' + startName + ' and ' + endName + ' is <span class="text-underline text-bold">' + 
        diff + '</span><br>Range limit is ' + '<span class="text-underline text-bold">' + MAX_DIFFERENCE + '</span>.';
        insertErrorMessage(text);
        return false;
    }

    return true;
} // end of "chkStartEndDiff"

/***** removeChildNodes *******************************************************
*
* This function removes any child nodes that a element container has.
*
* Parameters:
*   container       -- the element with supposed child nodes
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
function removeChildNodes(container){
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
} // end of "removeChildNodes"

/***** isNumber ***************************************************************
*
* This function checks if a form input can be converted into a Number data
* type. If the conversion is NaN, add a class with error styling for that
* form input and return false.
*
* Parameters:
*   el          -- the element id of the form input
*   varName     -- the variable name being converted to a Number data type
*                  (varName is only used for debug purposes)
*
* Return:
*   false       -- If conversion has failed
*   Number      -- If conversion succeeded, the element's value
*
******************************************************************************/
function isNumber(el, varName){
    if(isNaN(Number(el.value))){
        return false;
    }

    return Number(el.value);
} // end of "isNumber"

/***** insertErrorMessage *****************************************************
*
* This function creates and inserts an element with and error message.
*
* Parameters:
*   message         -- text containing the error message
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
function insertErrorMessage(message){
    let outputEl = document.getElementById('famtOutput');
    let outputPara = document.getElementById('famtParagraphOutput');
    if(outputPara){
        outputPara.innerHTML += '<br><br>' + message;
    } else {
        let div = document.createElement('DIV');
        div.setAttribute('class', 'famt__info');

        let p = document.createElement('p');
        p.setAttribute('class', 'famt__paragraph famt__paragraph--error');
        p.setAttribute('id', 'famtParagraphOutput');
        p.innerHTML = message;
        div.appendChild(p);
        outputEl.appendChild(div);
    }
} // end of "insertErrorMessage"

/***** chkTableInputs *********************************************************
*
* This function checks if the number inputs to create the table are valid. It
* tries to convert into a number type, otherwise "chkTableInputs" will console log
* an error returning undefined. If all inputs are successfully number types
* then create the table using Javascript or PHP.
*
* Parameters:
*   ev              -- submit button event
*
* Return:
*   undefined       -- early exit due to input error(s)
*
******************************************************************************/
async function chkTableInputs(ev){
    ev.preventDefault();
    ev.stopPropagation();

    clearInputErrors();

    var famtOutput = document.getElementById("famtOutput");

    // Check if the table wrapper/container has any elements in it to remove.
    if(famtOutput.hasChildNodes()){
        removeChildNodes(famtOutput);
    }

    // Check if inputs: convert to Number type or Boolean false.
    var colStart = isNumber(document.getElementById('colStart'), "colStart");
    var colEnd = isNumber(document.getElementById('colEnd'), "colEnd");
    var rowStart = isNumber(document.getElementById('rowStart'), "rowStart");
    var rowEnd = isNumber(document.getElementById('rowEnd'), "rowEnd");

    var err = [];
    
    // If inputs are not numbers, display error to user 
    if(colStart === false){
        err.push("Column Start");
        let text = '<span class="text-underline text-bold">Column Start</span> input is not a number!';
        insertErrorMessage(text);
    }
    if(colEnd === false){
        err.push("Column End");
        let text = '<span class="text-underline text-bold">Column End</span> input is not a number!';
        insertErrorMessage(text);
    }
    if(rowStart === false){
        err.push("Row Start");
        let text = '<span class="text-underline text-bold">Row Start</span> input is not a number!';
        insertErrorMessage(text);
    }
    if(rowEnd === false){
        err.push("Row End");
        let text = '<span class="text-underline text-bold">Row End</span> input is not a number!';
        insertErrorMessage(text);
    }

    if(document.getElementById("myDevice").checked){ // If "My Device" is checked
        // Check if the difference between the starting and ending values
        // are no greater than MAX_DIFFERENCE.
        let validColDiff = chkStartEndDiff(colStart, colEnd, "Column Start", "Column End");
        let validRowDiff = chkStartEndDiff(rowStart, rowEnd, "Row Start", "Row End");

        if(validColDiff === false){
            err.push("Column Difference");
        }

        if(validRowDiff === false){
            err.push("Row Difference");
        }
    }

    if(err.length > 0){
        highlightInputErr(err);
        return;
    }

    famtOutput.innerHTML += `<table class="famt__table famt__table--output" id="famtTableOutput" ></table>`;

    var table = document.getElementById("famtTableOutput");

    // Check if the table should be created with Javascript or PHP.
    if(document.getElementById("myDevice").checked){ // Create table using Javacript
        createTableJS(colStart, colEnd, rowStart, rowEnd, table)
        .then(() => {
            // Add vertical hover event
            let famtTableOutput = document.getElementById("famtTableOutput");
            famtTableOutput.addEventListener("mouseover", dispColumnHighlight, false);
            famtTableOutput.addEventListener("mouseleave", noColumnHighlight, false);
        })
        .catch(err => console.error(err));
    } else { // Create table using PHP
        createTablePHP(colStart, colEnd, rowStart, rowEnd, table)
        .then(() => {
            // Add vertical hover event
            let famtTableOutput = document.getElementById("famtTableOutput");
            famtTableOutput.addEventListener("mouseover", dispColumnHighlight, false);
            famtTableOutput.addEventListener("mouseleave", noColumnHighlight, false);
        })
        .catch(err => console.error(err));
    }
} // end of "chkTableInputs"

/***** famtMain ***************************************************************
*
* This is the first function that is called when the script is loaded. It makes 
* sure that the "famtForm" ID is in the HTML page and then attaches the "chkTableInputs" 
* function to the "Submit" button which will handle the creation of multiplication tables.
*
* Parameters:
*   none
*
* Return:
*   undefined       -- no return statement
*
******************************************************************************/
function famtMain(){
    var famtForm = document.getElementById("famtForm");
    if(famtForm){
        famtForm.addEventListener("submit", chkTableInputs);
    } else {
        console.log('ERROR: famt.js did not find an form element with the id of "famtForm".');
    }
} // end of "famtMain"
