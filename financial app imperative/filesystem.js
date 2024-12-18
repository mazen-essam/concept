const path = require('path');
const fs = require('fs');
class Filesystem {
  constructor() {
    this.filepath = path.join(__dirname, './financial.json'); // Absolute path to the file
  }

  // Reads the file and parses its content
  readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filepath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err.message); // Print error
          reject(err);
          return;
        }

        if (!data || !data.trim()) {
          console.warn('File is empty. Returning an empty object.'); // File has no content
          resolve({});
          return;
        }

        let parsedData = {}; // Mutable variable
        try {
          parsedData = JSON.parse(data);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError.message);
          reject(parseError);
          return;
        }

        resolve(parsedData);
      });
    });
  }


  // Writes data to the file under a specific option
  writeFile(data, option) {
    return new Promise((resolve, reject) => {
      // Assign unique IDs to the input data
      for (let i = 0; i < data.length; i++) {
        data[i].id = Date.now() + i; // Mutate the objects directly
      }

      // Read the file first
      this.readFile()
        .then((fileData) => {
          let updatedData = {}; // Mutable variable
          if (fileData) {
            updatedData = fileData; // Use existing file content
          }

          // Add or update the specific option
          updatedData[option] = data;

          // Convert back to JSON string
          const jsonData = JSON.stringify(updatedData, null, 2);

          // Write to file
          fs.writeFile(this.filepath, jsonData, 'utf8', (err) => {
            if (err) {
              console.error('Error writing to file:', err.message);
              reject(err);
              return;
            }
            resolve('Data successfully written to file.');
          });
        })
        .catch((readErr) => {
          console.error('Error during file read/write operation:', readErr.message);
          reject(readErr);
        });
    });
  }
}

module.exports = Filesystem;