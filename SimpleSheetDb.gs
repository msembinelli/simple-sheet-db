var SimpleSheetDb = function(sheetName, userPassword) {
  this.sheetName = sheetName;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (sheet == null) {
    ss.insertSheet(sheetName);
  }
  
  sheet = ss.getSheetByName(sheetName);
  sheet.hideSheet();
  
  this.sheet = sheet;
  this.userPassword = userPassword;
  
  this.simpleSheetDbWrite = function(key, value) {
    if (!key) {
      return false;
    }
    var codedString = encryptMessage(value, this.userPassword);
    // If the key already exists, update the value
    var row = this.simpleSheetDbGetRow(key);
    if (row) {
      this.sheet.getRange(row, 2).setValue(codedString);
      return true;
    }
    var new_row = [key, codedString];
    this.sheet.appendRow(new_row);
    return true;
  }
  
  this.simpleSheetDbRead = function(key) {
    if (!key) {
      return false;
    }
    // If the key exists, return the value
    var row = this.simpleSheetDbGetRow(key);
    if (!row) {
      return false
    }

    return decryptMessage(this.sheet.getRange(row, 2).getValue(), this.userPassword);
  }
  
  this.simpleSheetDbDelete = function(key) {
    if (!key) {
      return false;
    }
    // If the key exists, delete the row
    var row = this.simpleSheetDbGetRow(key);
    if (!row) {
      return false
    }
    this.sheet.deleteRow(row);
  }
  
  this.simpleSheetDbGetRow = function(key) {
    if (!key) {
      return false;
    }
    // Search and return the row index that contains the key value pair
    try {
      var columnValues = this.sheet.getRange(1, 1, this.sheet.getLastRow()).getValues();
      for (var i=0; i<columnValues.length; i++) {
        if (columnValues[i] == key) {
          return i + 1;
        }
      }
    }
    catch(e) {
      return false;
    }
    return false;
  }

}