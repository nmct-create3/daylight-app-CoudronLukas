// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const time = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + time.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + time.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

let itBeNight = () => {
	document.querySelector('html').classList.add('is-night');
};

let itBeDay = () =>{
	document.querySelector('html').classList.add('is-day');
};

// 5 TODO: maak updateSun functie

//const UpdateSun = (sunElement,left,bottom,now) =>{

//}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
const placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const sun = document.querySelector('.js-sun');
	const minutesleft = document.querySelector('.js-time-left');

	// Bepaal het aantal minuten dat de zon al op is.
	const now = new Date();
	const sunriseData = new Date(sunrise*1000);

	// 09:49
	//const minutesSunUp = (now.getHours()*60 + now.getMinutes()) - (sunrise.getHours()*60 + now.getMinutes());
	const minutesSunUp = (now.getHours()*60 + now.getMinutes()) - (sunriseData.getHours()*60 + now.getMinutes());
	console.log(minutesSunUp);
	const percentage = (100/totalMinutes) * minutesSunUp;
	const sunLeft = percentage /100 * minutesSunUp;
	const sunBottom = percentage < 50 ? percentage *2 : (100 - percentage) * 2;
	//korte if else
	// condition ? true : false;
	console.log(percentage);

	//UpdateSun(sun, sunLeft, sunBottom,now);

	sun.style.left = `${sunLeft}%`;
	sun.style.bottom = `${sunBottom}%`;
	console.log(sunBottom);
	console.log(sunLeft);
	const currentTimeStamp = `${now.getHours().Tostring().padStart(2,'0')}:${now.getMinutes().Tostring().padStart(2,'0')}`;
	console.log(currentTimeStamp);
	sun.setAttribute('data-time',currentTimeStamp);



	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	minutesleft.innerText = totalMinutes - minutesSunUp;
	const t = setInterval(() =>{
		if(minutesSunUp < 0 || minutesSunUp > totalMinutes){
			clearInterval(t);
			itBeDay();
		}
		else if(minutesSunUp<0){
			// TODO: enable night mode
			itBeNight();
		}
		else{
			const now = new Date();
			const sunLeft = (100/totalMinutes);
			const bottom = left < 50 ? left * 2: (100-left*2);
		}


		minutesleft.innerText = totalMinutes - minutesSunUp;
	})
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	console.log("queryResponse");
	// We gaan eerst een paar onderdelen opvullen
	var op = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	var neer = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector('.js-location').innerText = `${queryResponse.city.name},${queryResponse.city.country}`;
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	document.querySelector('.js-sunrise').innerText = op;
	document.querySelector('.js-sunset').innerText = neer;
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	const timeDifference = ((queryResponse.city.sunset - queryResponse.city.sunrise) /60); //tijd in api is in seconden dus / 60 ==> minuten / 3600 ==> uren
	console.log(op);
	console.log(timeDifference);
	placeSunAndStartMoving(timeDifference,queryResponse.city.sunrise);

};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
	const data = await fetch( `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6345ee3617dfa325a4465271b1490987&units=metric&lang=nl&cnt=1`)
		.then((r) => r.json())
		.catch((err) => console.error('an error'));
	console.log(data);
	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
	showResult(data);
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
