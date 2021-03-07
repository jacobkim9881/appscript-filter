function parseData(idNum, columnNum) {
  /// CHANGE id FOR PARSING DATA AT A GOOGLE SPREADSHEET ///
let id = '1C2DGt8YiKjUylyivOi8EEtkbKDsc-EPpJFqdqSp7-W8'
var ss = SpreadsheetApp.openById(id);
SpreadsheetApp.setActiveSpreadsheet(ss);
return SpreadsheetApp.getActiveSpreadsheet()
  .getDataRange().getValues();
//let data = SpreadsheetApp.getActiveSpreadsheet()
//  .getDataRange().getValues();
//Logger.log(data[idNum][columnNum]);
//return data[idNum][columnNum];
}

function dataFromSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetIdx = ss.getSheetByName('Parsed_Data').getIndex();
  let parsedSheet = ss.getSheets()[sheetIdx - 1];
  let data = parsedSheet.getDataRange().getValues();
  return data;
}

function createSheet() {
  /// CHANGE id FOR PARSING TARGET SPREADSHEET ///
  id = '10Mz7mPm7_zXodu5ceDbxCyXPqpMR6e0hJMQ94WmL9vE'
  var ss = SpreadsheetApp.openById(id);
  //var templateSheet = ss.getSheetByName('Sales');
  
  /// This is for making a new sheet in current excel ///
  let parsedSheet = ss.getSheetByName('Parsed_Data');

  if (parsedSheet !== null) {
    Logger.log('Already has parsedSheet');    
  } else {
  ss.insertSheet('Parsed_Data');  
  }
  
  let data = parseData();  

  //let sheetData = SpreadsheetApp.getActiveSpreadsheet().getDataRange();
  parsedSheet.clear();
  
  data.length === 1 || data === null ? console.log('There is no data to parse') : false;
  Logger.log('data: ' + data);
  let test = [1, 2]
  
  data.forEach(row => {
    let rowArr = [];
    row.forEach(val => {
      rowArr.push(val);
    })
    console.log(row);
    /// For a new sheet ///
    parsedSheet === null ? console.log('There is no sheet') : false;    
    parsedSheet.appendRow(row);
    
  })
}
