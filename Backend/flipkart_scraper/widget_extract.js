// const cheerio = require('cheerio');
// const fs = require('fs');

// // Assuming you have the HTML content saved in a file (for example, 'page.html')
// fs.readFile('flipkart_page.html', 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading the file:', err);
//         return;
//     }

//     // Load the HTML content into Cheerio
//     const $ = cheerio.load(data);

//     // Extract the JSON from the <script> tag that contains the widget data
//     const scriptTag = $('script[type="application/ld+json"]').html();  // Adjust this if needed

//     if (scriptTag) {
//         try {
//             console.log('Script Tag Found:', scriptTag);  // Log the extracted script tag for debugging

//             // Parse the JSON data
//             const jsonData = JSON.parse(scriptTag);
            
//             if (!jsonData.itemListElement) {
//                 console.error('No itemListElement data found in the parsed JSON.');
//                 return;
//             }

//             // Extract the "itemListElement" data from the JSON
//             const itemListElementData = jsonData.itemListElement;  // Adjust key if needed
//             console.log('Extracted Item List Data:', itemListElementData);  // Log the extracted data

//             // Store the extracted itemListElement data in a JSON file
//             fs.writeFile('itemListData.json', JSON.stringify(itemListElementData, null, 2), (err) => {
//                 if (err) {
//                     console.error('Error writing to the file:', err);
//                 } else {
//                     console.log('Item list data has been saved to itemListData.json');
//                 }
//             });
//         } catch (parseError) {
//             console.error('Error parsing the JSON:', parseError);
//         }
//     } else {
//         console.error('No script tag with JSON data found in the HTML.');
//     }
// });

const fs = require('fs');

function extractBalancedObject(text, startIndex) {
  let braceCount = 0;
  let endIndex = startIndex;
  for (let i = startIndex; i < text.length; i++) {
    if (text[i] === '{') {
      braceCount++;
    } else if (text[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        return text.substring(startIndex, endIndex + 1);
      }
    }
  }
  return null;
}

/**
 * Scans the HTML content (treated as a string) for all occurrences of
 * "widget": { ... } blocks. For each one that contains '"type": "PRODUCT_SUMMARY"',
 * it finds the "data" property and extracts the JSON-like block (without parsing it).
 *
 * Returns an array of string blocks (each representing the extracted data).
 */
function extractWidgetData(htmlContent) {
  const widgetDataArray = [];
  let searchIndex = 0;

  while (true) {

    const widgetKeyIndex = htmlContent.indexOf('"widget":', searchIndex);
    if (widgetKeyIndex === -1) break;

    const widgetObjStart = htmlContent.indexOf('{', widgetKeyIndex);
    if (widgetObjStart === -1) break;

    const widgetObjStr = extractBalancedObject(htmlContent, widgetObjStart);
    if (widgetObjStr) {

      if (widgetObjStr.includes('"type":') && widgetObjStr.includes('"PRODUCT_SUMMARY"')) {

        const dataKeyIndex = widgetObjStr.indexOf('"data":');
        if (dataKeyIndex !== -1) {

          const dataObjStart = widgetObjStr.indexOf('{', dataKeyIndex);
          if (dataObjStart !== -1) {
            const dataObjStr = extractBalancedObject(widgetObjStr, dataObjStart);
            if (dataObjStr) {
              widgetDataArray.push(dataObjStr);
            }
          }
        }
      }
    }
    
    searchIndex = widgetKeyIndex + 1;
  }
  return widgetDataArray;
}

/**
 * Reads the HTML file, uses the extraction logic,
 * and writes the extracted widget data blocks (array of strings)
 * to an output JSON file.
 */
function processHtmlFile(inputPath, outputPath) {
  fs.readFile(inputPath, 'utf8', (err, htmlContent) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return;
    }
    const widgetData = extractWidgetData(htmlContent);
    fs.writeFile(outputPath, JSON.stringify(widgetData, null, 2), (err) => {
      if (err) {
        console.error('Error writing output JSON file:', err);
      } else {
        console.log(`Widget data saved to: ${outputPath}`);
      }
    });
  });
}

// Replace with your HTML file path and desired output path.
const inputFilePath = 'flipkart_page.html';
const outputFilePath = 'widget_data.json';

processHtmlFile(inputFilePath, outputFilePath);
