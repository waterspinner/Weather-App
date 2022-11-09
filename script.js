api = '4bd7b47ded83d8fc3d3409055c606053'

const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const desc = document.querySelector('.desc');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');

window.addEventListener('load', () => {
    let long;
    let lat;
    //accessing geolocation 
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const base = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid='+api+'&units=metric';
           // console.log(base);
            //using fetch to get data
            fetch(base).then((response) => {
                return response.json();
            })
            .then((data) => {
                const {temp} = data.main
                const place = data.name
                const { description, icon } = data.weather[0];
                const { sunrise, sunset } = data.sys;

                const iconURL = 'http://openweathermap.org/img/wn/'+icon+'@2x.png';
                const fahrenheit = (temp * 9) / 5 + 32;

                //converting epoch(Unix) time to GMT
                const sunriseGMT = new Date(sunrise * 1000);
                const sunsetGMT = new Date(sunset * 1000);

                //interacting with DOM to show data
                iconImg.src = iconURL;
                loc.textContent = `${place}`;
                desc.textContent = `${description}`;
                tempC.textContent = `${temp.toFixed(2)} *C`;
                tempF.textContent = `${fahrenheit.toFixed(2)} *F`;
                sunriseDOM.textContent = `${sunriseGMT}`;
                sunsetDOM.textContent = `${sunsetGMT}`;

                console.log(position);
            });
        });
    }
});


console.log(GeolocationPosition);
console.log(GeolocationCoordinates);