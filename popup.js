const btn = document.querySelector('#btnSend');
const input = document.querySelector('#city');
const qualityBlock = document.querySelector("#quality_block");
const qualityValue = document.querySelector("#quality_value");
const temperatureValue = document.querySelector("#temperature");
const temperatureBlock = document.querySelector("#temperature_Block");

let latitudeME ;
let longitudeME;
let ville;
let meteo;



document.addEventListener('DOMContentLoaded', function() {
    qualityBlock.style.display = 'none';

    console.log("DOM chargé");

    btn.addEventListener('click', function(e) {
        e.preventDefault();

        console.log("Clic détecté");
        console.log(input);
        const value = input.value;
        console.log(value)
        ville = value;

        
        getEval(value).then(result => {//appel de la fonction getEval pour la qualité de l'air

            if(result === null || !result){
                qualityValue.innerText = "Ville non trouvée ou erreur lors de la récupération de la qualité de l'air.";
                qualityBlock.style.display = 'block';
                return;
            }

            console.log(result);

            qualityValue.innerText = "La qualité de l'air dans la ville de "+ value + "  est de : "+result.data.aqi;

            if(result.data.aqi <= 50){
                qualityBlock.classList.add("good")
            
            } else if(result.data.aqi > 50 && result.data.aqi <= 100){
                qualityBlock.classList.add("middle")
            
            }  else if(result.data.aqi > 100 && result.data.aqi <= 150){
                qualityBlock.classList.add("bad")
            
            } else if(result.data.aqi > 150){
                qualityBlock.classList.add("verybad")
            
            }
            qualityBlock.style.display = 'block';
            
        });

        getMeteo(value).then(temperature =>{//appel de la fonction getMeteo pour la meteo de la ville

            if(temperature === null || !temperature){ 
                temperatureValue.innerText = "Ville non trouvée ou erreur lors de la récupération de la météo.";
                temperatureBlock.style.display = 'block';
                return;
            }

            console.log("temperature : " + temperature);

            temperatureValue.innerText = " La temperature actuelle dans la ville de " + value + " est de "+ temperature + " °C";

            
            if(temperature <= 15){
                temperatureBlock.classList.add("good")
            
            } else if(temperature > 15 && temperature <= 25){
                temperatureBlock.classList.add("middle")
            
            }  else if(temperature> 25 && temperature <= 30){
                temperatureBlock.classList.add("bad")
            
            } else if(temperature > 30){
                temperatureBlock.classList.add("verybad")
            
            }
            temperatureBlock.style.display = 'block';
            




        });

    });

});



async function getEval(city){// function async 
    try {
    const response  = await fetch(`http://api.waqi.info/feed/${city}/?token=d54f331bbdec85f5a765262651c8af1ca2bdcf01`)

    const json = await response.json() //convertit la réponse en JSON
    return json;
    
    } catch (error) {
        console.error("Erreur : ", error);
        return null;
    } 
    }
    

    
    async function getMeteo(ville) {// function async
        try {
    
            // Géocodage : obtenir latitudeME et longitudeME
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ville}`);
            const data = await response.json();//conversion de la reponse en json
    
            if(!data.results || data.results.length === 0){//vérification si la ville est trouvée
                console.log("Ville non trouvée");
                return null;
            }
    
            latitudeME = data.results[0].latitude;
            longitudeME = data.results[0].longitude;
    
            // Récupérer la météo
            const meteoResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitudeME}&longitude=${longitudeME}&hourly=temperature_2m`);
             meteo = await meteoResponse.json();//conversion de la reponse en json
    
            // Retourner la température actuelle
            console.log(meteo.hourly.temperature_2m[0]) 
            return meteo.hourly.temperature_2m[0];
          
    
        } catch(err) {
            console.error("Erreur météo :", err);
            return null;
        }
    }
 