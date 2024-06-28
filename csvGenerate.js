const fs = require("fs");

const generateCSVContent = () => {
  let csvContent = "email,name\n";
  for (let i = 1; i <= 1000000; i++) {
    csvContent += `user${i}@example.com,User ${i}\n`;
  }
  return csvContent;
};

const csvData = generateCSVContent();

fs.writeFile("large_data.csv", csvData, (err) => {
  if (err) {
    console.error("Error writing CSV file:", err);
  } else {
    console.log("CSV file generated successfully.");
  }
});
