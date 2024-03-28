const placeInput = document.getElementById("search");
const autocompleteDiv = document.getElementById("autocomplete");

placeInput.addEventListener("input", function () {
    const inputText = this.value.trim();
    if (inputText.length > 0) {
        fetchSuggestions(inputText);
    } else {
        clearSuggestions();
    }
});

function fetchSuggestions(inputText) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputText)}&format=json&addressdetails=1&limit=5`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateSuggestions(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function updateSuggestions(suggestions) {
    autocompleteDiv.innerHTML = "";
    suggestions.forEach(suggestion => {
        if (suggestion.address && suggestion.address.city) {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList = "p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700";
            suggestionItem.textContent = suggestion.address.city;
            suggestionItem.addEventListener("click", function () {
                placeInput.value = this.textContent;
                autocompleteDiv.innerHTML = "";
                document.getElementById('autocomplete').classList="hidden"
            });
            autocompleteDiv.appendChild(suggestionItem);
        }
    });
    autocompleteDiv.classList.remove("hidden");
    
}

function clearSuggestions() {
    autocompleteDiv.innerHTML = "";
    autocompleteDiv.classList.add("hidden");
}

function getCoordinates() {
    const placeInputValue = placeInput.value.trim();
    if (placeInputValue !== "") {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeInputValue)}&format=json&limit=1`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    const latitude = data[0].lat;
                    const longitude = data[0].lon;
                    getWeather(latitude,longitude)
                } else {
                    console.log("Coordinates not found for the given place.")
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    } else {
        alert("Please enter a place.")
    }
}
function getWeather(latitude, longitude) {
    const apiKey = 'a3f88c343c2ea090c557927e6ff4aad0';
    const url = `https://open-weather13.p.rapidapi.com/city/latlon/${latitude}/${longitude}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'cd643cf1ebmsh9bf425ace98ee36p1528c6jsn43ed5a04f16d',
            'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
        }
    };
    fetch(url,options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Weather Data:", data);
            const weatherIconElement=document.getElementById('iconweather');
            const main=document.getElementById('main');
            const city=document.getElementById('city');
            const temp=document.getElementById('temp');

            const icon=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            console.log(icon)
            weatherIconElement.src = icon;
            main.innerText=data.weather[0].main;
            city.innerText=data.name;
            temp.innerText="Feels Like "+(data.main.temp- 273.15).toFixed(2)+' C';
            // Handle weather data here
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    getWeather(latitude,longitude)
    
    // You can do something with the coordinates here, such as calling another function
    // or sending them to an API.
}
getCurrentLocation()
function errorCallback(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

