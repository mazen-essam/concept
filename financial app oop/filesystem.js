const fs = require('fs');

class filesystem {
  constructor(filepath) {
    this.filepath = filepath;
  }

  readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filepath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          reject(err);
          return;
        }
        if (!data.trim()) {
          // File is empty
          console.warn('File is empty. Returning an empty object.');
          resolve({});
          return;
        }
  
        try {
          resolve(JSON.parse(data))
        } catch (parseError) {
          reject(`Error parsing JSON: ${parseError}`);
        }
        
      });
    });
  }

  writefile(data, option) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = Date.now() + i; // Incrementing ensures uniqueness
    }
      this.readFile()
      .then(fileData => {
          if (!fileData) {
              fileData = {}; // Initialize if the file is empty
          }
          fileData[option] = data; // Update the specific key
          const jsonData = JSON.stringify(fileData, null, 2);
          fs.writeFile(this.filepath, jsonData, 'utf8', (err) => {
              if (err) {
                  reject(`Error writing to file: ${err}`);
              } else {
                  resolve('Data written to file');
              }
          });
      }).catch(err => reject(`Error reading file: ${err}`));
    });
  }
}

module.exports = filesystem;