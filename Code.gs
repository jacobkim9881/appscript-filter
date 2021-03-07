
function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .createMenu('Filter')
    .addItem('Open', 'openDialog')
    .addToUi();
  createTriggers();    
  createSheet();
}

function sideBar() {
let html = HtmlService
    .createTemplateFromFile('Index')
    .evaluate();
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showSidebar(html);
}

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



function createTriggers() {
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('sideBar')
    .forSpreadsheet(sheet)
    .onEdit()
    .create();
}

function openDialog() {
  let html = HtmlService
    .createTemplateFromFile('Index')
    .evaluate();
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showSidebar(html);
}

function putData(rowIdx) {  
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();

  //// SHOULD CHECK COLUMN NUMBER////
  let idColumn = 3;
  let timeColumn = 2;
  let nameColumn = 1;
  let priceColumn = 5;
  let parseNameColumn = 1;
  let parsePriceColumn = 2;
  //// SHOULD CHECK COLUMN NUMBER////
  
    let idValue = data[rowIdx][idColumn];
    if (idValue) {    
    Logger.log('input id: ' + data[rowIdx][idColumn]);
    var nameRange = sheet.getRange(rowIdx + 1, nameColumn);
    Logger.log('name: ' + nameRange)
    var priceRange = sheet.getRange(rowIdx + 1, priceColumn);
    Logger.log('price: ' + priceRange)
    let parseName = savedData[idValue][parseNameColumn];
    //parseData(idValue, parseNameColumn);
    Logger.log('parsed name: ' + parseName)
    let parsePrice = savedData[idValue][parseNameColumn];
    //parseData(idValue, parsePriceColumn);
    Logger.log('parsed price: ' + parsePrice)
    nameRange.setValue(parseName);
    //priceRange.setValue(parsePriceColumn);
    }

}

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

function loadFilter() {
  return SpreadsheetApp.getActiveSheet()
    .getDataRange().getValues();
}

function showAllRows() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
    sheet.showRows(1, (data.length + 1));

    //Move current cell
var cell = sheet.getRange('B1');
sheet.setCurrentCell(cell);
}

/*
function validateMySpreadsheet() {
  // Set a rule for the cell B4 to be a number between 1 and 100.
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  Logger.log('get data range: ', data);
  
  var cell = SpreadsheetApp.getActive().getRange('B3');

  var rule = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 100)
    .setAllowInvalid(false)
    .setHelpText('Number must be between 1 and 100.')
    .build();
  cell.setDataValidation(rule);
}
*/
