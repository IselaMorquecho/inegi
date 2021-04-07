const axios = require('axios').default;
const fs = require('fs');
const URL_ESTATAL = "https://gaia.inegi.org.mx/wscatgeo/mgee/";
const URL_MUNICIPAL = "https://gaia.inegi.org.mx/wscatgeo/mgem/";
const URL_LOCALIDADES = "https://gaia.inegi.org.mx/wscatgeo/localidades/";

let fetchData = require('../utils/fetchData');

generateData = async () => {
    let estados = [];
    let municipios = [];
    let localidades = [];

    let dataEstados = await fetchData(URL_ESTATAL);
    estados = dataEstados.map((estado)=>{
        return {
            "clave": estado.cve_agee,
            "valor": estado.nom_agee
        }
    });
    console.log(`Numero de estados ${estados.length}`);
    writeFile('estados.json',estados);

    municipios = await generateMunicipios(estados); 
    console.log(`Numero de municipios ${municipios.length}`);
    writeFile('municipios.json',municipios);
    
    localidades = await generateLocalidades(municipios);
    console.log(`Numero de localidades ${localidades.length}`);
    writeFile('localidades.json',localidades);
    
};

async function generateMunicipios(estados) {
    return new Promise(async (resolve, reject) =>{
        try{
            let municipiosEstado = [];
            for(const estado of estados){
                let data = await fetchData(URL_MUNICIPAL+estado.clave);
                municipiosEstado = municipiosEstado.concat(data.map((municipio) => {
                    return {
                     "cve_agee": municipio.cve_agee,   
                     "clave": municipio.cve_agem,
                     "valor": municipio.nom_agem
                    }
                    }));
            };
            resolve(municipiosEstado);
        }catch(error){
            reject(error)
        }
    });
}

async function generateLocalidades(municipios) {
    return new Promise(async (resolve, reject) =>{
        try{
            let localidadesMunicipio = [];
            for(const municipio of municipios){
                let url = URL_LOCALIDADES + municipio.cve_agee + municipio.clave;
                let data = await fetchData(url);
                localidadesMunicipio = localidadesMunicipio.concat(data.map((localidad) => {
                    return {
                     "cve_agee": localidad.cve_agee,   
                     "cve_agem":localidad.cve_agem,
                     "clave": localidad.cve_loc,
                     "valor": localidad.nom_loc
                    }
                    }));
            };
            resolve(localidadesMunicipio);
        }catch(error){
            reject(error)
        }
    });
}

const writeFile = (fileName, registros) => {
    let data = JSON.stringify(registros);
    fs.writeFileSync(fileName, data);
}

generateData();

