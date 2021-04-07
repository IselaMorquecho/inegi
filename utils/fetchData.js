const axios = require ('axios').default;

fetchData = (url) => {
    return new Promise((resolve, reject)=>{
        axios.get(url).then(response => {
            resolve(response.data.datos)
        }).catch(error => {
            reject(error);
        })
    })  
}

module.exports=fetchData;
