## Appscript Filter
This repository is codes from Apps script to filter data at Google SpreadSheet.
You can test the repo at [here](https://docs.google.com/spreadsheets/d/10Mz7mPm7_zXodu5ceDbxCyXPqpMR6e0hJMQ94WmL9vE/edit#gid=0 ).

### How this script works
You can filter the sheet in the [link](https://docs.google.com/spreadsheets/d/10Mz7mPm7_zXodu5ceDbxCyXPqpMR6e0hJMQ94WmL9vE/edit#gid=0) when open Filter tab which is made from apps script. The HTML file opened by the filter tab parses data from sheet and filters data by executing `google.script.run` to send data to filter.

Second, this backups data from [other sheet](https://docs.google.com/spreadsheets/d/1_FbqHapL9_cDH716es2YA3I2_QjBHEKWJAFvraMBPoI/edit#gid=0) and pastes data into new sheet in [the source link](https://docs.google.com/spreadsheets/d/10Mz7mPm7_zXodu5ceDbxCyXPqpMR6e0hJMQ94WmL9vE/edit#gid=0).

### How filtering data works
When opening the sheet, by on event onOpen is excuted and create Filter menu.

``` javascript
function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .createMenu('Filter')
    .addItem('Open', 'openDialog')
    .addToUi();
  //createTriggers();    
  createSheet();
}
```

By onOpen, Index.html is executed to run HTML file on the sheet to show filter UI.

```javascript
function openDialog() {
  let html = HtmlService
    .createTemplateFromFile('Index')
    .evaluate();
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showSidebar(html);
}
```

On Index.html date column is parsed and maaped. <? ?> in HTML makes .html file possible to load functions and data in apps script.

```html

    <? var data = loadFilter();
       let arr = [];?>
       <table>
      <? for (var i = 0; i < data.length; i++) { 
    let time = new Date(data[i][2]);
    let dateString = data[i][2].toString();
    let isString = isNaN(time.getFullYear());    
    let month, date;
    if (arr.indexOf(dateString) === -1 && !isString) {      
        arr.push(dateString);
        month = time.getMonth() + 1;
        date = time.getDate() + 1;         
    };?>    
              <? if(typeof month !== 'undefined') {  ?>
        <tr>
          <td>
            <button class='btn'>
              <?= month + '/' + date ?>
            </button>
          </td>          
        </tr>
            <? 
            } else { 
            } 
          } ?>
```

By clicking .btn classes texts in the button tag get sent into apps script by `google.script.run.filterBtn`.

```javascript
    buttons.forEach( bt => {    
      bt.onclick = function(e) {
        google.script.run.filterBtn(e.target.innerText);
      }
    });
```

In filterBtn function the sheet is parsed and find same value for the event value from .html file by for loop.

```javascript
function filterBtn(e) {  
  var sheet =  SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  // Passing only two arguments returns a "range" with a single cell.
  var drawings = SpreadsheetApp.getActiveSheet().getDrawings();

  //// SHOULD CHECK COLUMN NUMBER FOR DATE////
  let timeColumn = 2;
  let barNum = 0;
  //// SHOULD CHECK COLUMN NUMBER FOR DATE////


  let arr = [];
  for (var i = 0; i < data.length; i++) {
    //sheet.appendRow(['', '', '', data[i][1]]);    
    let time = new Date(data[i][timeColumn]);
    let month = time.getMonth() + 1;
    let day = time.getDate() + 1;    
    let eventValue = e.indexOf('/') !== -1 ? e.split('/') : e;
    let isEventDate = typeof eventValue === 'object' ? true : false;
    let eMonth = isEventDate ? parseInt(eventValue[0]) : '';
    let eDay = isEventDate ? parseInt(eventValue[1]) : '';

      var eventChecker = sheet.getRange(arr.length + 1, 9);
      eventChecker.setValue(month == eMonth);
    //Assign filtering to show filtered rows
    if(month !== eMonth && barNum !== i || day !== eDay && barNum !== i ) {
      var hidenRow = sheet.getRange(i + 1, 1);
      sheet.hideRow(hidenRow);
      
    } else if (month === eMonth && day === eDay ||  barNum === i) {
      var unHidenRow = sheet.getRange(i + 1, 1);
      sheet.unhideRow(unHidenRow);
    }

    let isString = isNaN(time.getFullYear());
    //Logger.log(getDate)
    //Logger.log(isString)
    if (!arr.indexOf(data[i][timeColumn]) || !isString) {
      arr.push(data[i][timeColumn]);
      /*
      var range = sheet.getRange(arr.length + 1, 4);
      range.setValue(data[i][timeColumn]);
      */

      ////Hide this////
      //Test function to check event value      
      /*
      var eventChecker = sheet.getRange(arr.length + 1, 9);
      eventChecker.setValue(isEventDate);
      */
    }

  }
  Logger.log(arr);
}
```

### ETC
#### Variables
Variables should be placed in each functions not out of each function in .gs file. If variables out of functions then on event functions or other functions couldn't execute. 
#### Executing functions
Don't execute functions in .gs files. Then functions are not executed.
#### google.script functions
`google.script` methods makes .html file possible to execute funtions in .gs files or close HTML or do other things.
#### on event methods in .gs files
Just naming functions for `on` + event names, the functions are executed on each event. This is same to createTimeDrivenTriggers.

### How auto putting data works
On some column by editing data .gs puts data in same row.

```javascript

function onEdit() {
  var sheet = SpreadsheetApp.getActiveSheet();
  let currentCell = sheet.getCurrentCell();  

  /// SET COLUMN VALUE ///
  let idColumn = 'D'
  let dateColumn = 'C'
  let nameColumn = 2;
  let priceColumn = 5;
  let filterRow = 1;
  let parseNameColumn = 1;
  let parsePriceColumn = 2;
  /// SET COLUMN VALUE ///  
  let a1Notation = currentCell.getA1Notation().match(/[A-Z]+|\d+/g);  
  let currentVal = sheet.getRange(currentCell.getA1Notation()).getValue();
  let colIdx = a1Notation[0];
  let rowIdx = parseInt(a1Notation[1]) - 1;
  let nameRange = sheet.getRange(rowIdx + 1, nameColumn);
  let priceRange = sheet.getRange(rowIdx + 1, priceColumn);
  Logger.log('row idx: ' + rowIdx);
  Logger.log('type of row idx: ' + typeof rowIdx);  
  let isFilterName = typeof currentVal === 'string' ? true : false;
  let parsedOne = dataFromSheet();  
  
  //Logger.log(a1Notation)
  //Logger.log('typeof val: ' + typeof currentVal);
  //&& typeof currentVal === 'number'
  //nameRange.setValue(isFilterName) 
  
  if (colIdx === idColumn && !isFilterName) {
    //Logger.log('value: ' + currentVal)
    nameRange.setValue(a1Notation[0] + a1Notation[1]);
    nameRange.setValue(parsedOne[currentVal][parseNameColumn]); 
    priceRange.setValue(parsedOne[currentVal][parsePriceColumn]); 
  }   
}

```

Data to parse are loaded by the function 

```javascript
  let parsedOne = dataFromSheet();  
```

```javascript
function dataFromSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetIdx = ss.getSheetByName('Parsed_Data').getIndex();
  let parsedSheet = ss.getSheets()[sheetIdx - 1];
  let data = parsedSheet.getDataRange().getValues();
  return data;
}
```

### ETC
#### Variables
Variables should be assinged in each function to execute or to parse data.

### How backup works
Executing backup function on time based is written in trigger tab at apps script.

```javascript
function createTimeDrivenTriggers() {
  // Trigger backup data every day.
  ScriptApp.newTrigger('backupDoubleCheck')
      .timeBased()
      .everyDays(1)
      .create();
}
```

Data are loaded from [source sheet](https://docs.google.com/spreadsheets/d/10Mz7mPm7_zXodu5ceDbxCyXPqpMR6e0hJMQ94WmL9vE/edit#gid=0) and put into [here](https://docs.google.com/spreadsheets/d/1_FbqHapL9_cDH716es2YA3I2_QjBHEKWJAFvraMBPoI/edit#gid=0).

```javascript

function backupSheet() {
  /// CHANGE id FOR BACK-UP SPREADSHEET ///
  let id = '1_FbqHapL9_cDH716es2YA3I2_QjBHEKWJAFvraMBPoI'
  var ss = SpreadsheetApp.openById(id);
  let backupSheets = ss.getSheets();
  let sourceSheet = loadSourceSheet();  

  for (let i = 0; i < sourceSheet.length; i++) {
    let sheet = sourceSheet[i];
    let sheetName = sheet.getSheetName();
    let parsedSheet = ss.getSheetByName(sheetName);
    let data = sheet.getDataRange().getValues();
    if (parsedSheet === null) {
      ss.insertSheet(sheetName);
    } 

    parsedSheet.clear();

    console.log(parsedSheet)   
    
  data.forEach(row => {
    let rowArr = [];
    row.forEach(val => {
      rowArr.push(val);
    })
    //console.log(row);
    /// For a new sheet ///
    parsedSheet === null ? console.log('There is no sheet') : false;    
    parsedSheet.appendRow(row);
    
  })
  }
}

function backupDoubleCheck() {
  try {
    backupSheet();
  } catch(err) {
    backupSheet();
  }
}
```

### ETC
#### Variables
Same like above other.
#### Loading sheets
Sheets from other spread sheet can be loaded.

```javascript

function loadSourceSheet() {
  /// CHANGE id FOR PARSING SOURCE SPREADSHEET ///
  id = '10Mz7mPm7_zXodu5ceDbxCyXPqpMR6e0hJMQ94WmL9vE';
  var ss = SpreadsheetApp.openById(id);
  let sheets = ss.getSheets();
  return sheets;
}
```


