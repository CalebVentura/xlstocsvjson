const csvtojson = require('csvtojson')
const fs = require('fs')

let datosx = []

async function formarJson(datosx) {

    const csvFilePaths = await fs.readdirSync("./prueba")

    await csvFilePaths.map((csvFilePath) => {

        csvFilePath = './prueba/' + csvFilePath
        csvtojson()
            .fromFile(csvFilePath)
            .then((res) => {

                for (let row of res) {
                    if(csvFilePath.includes('_2021')){
                        row['idu'] = csvFilePath.slice(9, -24)
                    }else{
                        row['idu'] = csvFilePath.slice(9, -4)
                    }                    
                    delete row['Order No.']
                    delete row['Port Mode']
                    delete row['Encapsulation Type']
                    delete row['Working Mode']
                    delete row['Max Frame Length (bytes)']
                    delete row['Auto-Negotiation Ability']
                    delete row['Logical Port Attribute']
                    delete row['Running Status']
                    delete row['Traffic Policing Status']
                    delete row['Traffic Policing Period(min)']
                    datosx = datosx.concat(row)
                }
                //console.log(datosx)
                fs.writeFileSync('puertosPrueba.json', JSON.stringify(datosx), 'utf-8', (e) => {
                    if (e) { console.log(e) }
                })
            })

    })

} formarJson(datosx)






