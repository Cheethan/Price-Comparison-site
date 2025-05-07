const fs = require('fs');

function cleanData(jsonFilePath) {
  // Read and parse the JSON file
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing the JSON:', parseErr);
      return;
    }

    console.log('Parsed Data:', parsedData);

    if (!parsedData.products || !Array.isArray(parsedData.products)) {
      console.error("The 'products' field is missing or not an array.");
      return;
    }

    let cleanedData = parsedData.products.map(product => {
      return {
        title: products.value.titles.title || '',
        subtitle: products.value.titles.subtitle || '',
        superTitle: products.value.titles.superTitle || '',
        price: products.value.pricing.prices[1]?.value || null,
        oldPrice: products.value.pricing.prices[0]?.value || null,
        discount: products.value.pricing.discountAmount || null,
        availability: products.value.availability.displayState || 'UNKNOWN',
        rating: products.value.rating?.average || null,
        reviewCount: products.value.rating?.reviewCount || 0,
        images: products.value.media.images.map(image => image.url)
      };
    });


    console.log(cleanedData);

    fs.writeFile('cleaned_data.json', JSON.stringify(cleanedData, null, 2), err => {
      if (err) {
        console.error('Error writing the file:', err);
      } else {
        console.log('Cleaned data saved to cleaned_data.json');
      }
    });
  });
}

cleanData('data.json');
