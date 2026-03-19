const btn = document.querySelector('#btnSend');
const input = document.querySelector('#city');
const temperatureBlock = document.querySelector('#temperature_Block');
const temperatureValue = document.querySelector('#temperature');

let ville;
let meteo;


const API_KEY = "cbf870049c917acf659c03e68235276d";

document.addEventListener('DOMContentLoaded', function () {

 temperatureBlock.style.display = 'none';
 console.log("DOM chargé");

 btn.addEventListener('click', function (e) {
 e.preventDefault();

 console.log("Clic détecté");

 const value = input.value.trim();
 console.log(value);

 if (!value) {
 temperatureValue.innerText = "Veuillez entrer une ville.";
 temperatureBlock.style.display = 'block';
 return;
 }

 ville = value;

 getMeteo(ville).then(result => {

 if (!result || result.cod !== 200) {
 temperatureValue.innerText = "Ville non trouvée ou erreur météo.";
 temperatureBlock.style.display = 'block';
 return;
 }

 console.log(result);

 const temp = result.main.temp;
 const description = result.weather[0].description;
 const pays = result.sys.country;

 temperatureValue.innerText =` ${ville} (${pays})  ${temp}°C  ${description}`;

 temperatureBlock.style.display = 'block';
 });
 });
});


async function getMeteo(city) {
 try {
 const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`);

 const json = await response.json();
 return json;

 } catch (error) {
 console.error("Erreur :", error);
 return null;
 }
}