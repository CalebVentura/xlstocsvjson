XLSX = require('xlsx');
const fs = require('fs')

// const xlsFiles = fs.readdirSync("./xls")
// console.log(xlsFiles)

// const inputFilename = './xls/0100438_LM_Monte_Abeto to Open Atocongo_2021-11-07-12-49-16.xls'
// const outputFilename = './csv/0100438_LM_Monte_Abeto to Open Atocongo_2021-11-07-12-49-16.csv'
// const workBook = XLSX.readFile(inputFilename);
// XLSX.writeFile(workBook, outputFilename, { bookType: "csv" });

async function xlstocsv() {

    const xlsFiles = await fs.readdirSync("./xlsFiles")
    //console.log(xlsFiles)

    await xlsFiles.map((xlsFile) => {

        const workBook = XLSX.readFile('./xlsFiles/'+xlsFile);
        XLSX.writeFile(workBook, './csvFiles/'+xlsFile.slice(0,-3)+'csv', { bookType: "csv" });

    })

} xlstocsv()