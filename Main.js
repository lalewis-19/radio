
var deviceLon = 40.258060, deviceLat = -74.525917; // location of the device if they share their position with us.
var defR = 80; // default radius km

// use for comaprison
// https://radio-locator.com

// http://cwestblog.com/2012/11/12/javascript-degree-and-radian-conversion/
// Converts from degrees to radians
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

/**
 * class for a radio stations with location, frequency, antenna height, and power.
 */
class RadioStation {
    constructor(freq = 94.5, lon = 39.918162846609455, lat = -75.16113325953484, haat = 100, power = 10000, strength = 0){
        this.freq = freq;
        this.lon = lon;
        this.lat = lat;
        this.haat = haat; // antena height above average terrain
        this.power = power;
        this.strength = strength;
    }
}

// testing code

// get the geo location of the device.
getDeviceLocation();

//radioQuery(deviceLon, deviceLat, defR, function(data){});

//console.log(distance(deviceLon, deviceLat, 40.319370, -74.790500));

//loadRawRadioFile("start_data.txt");


/**
 * saves the device location in deviceLon and deviceLat variables
 */
function getDeviceLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
    } 
}

/**
 * saves the lon, lat position form the position variable returned from the navigator.
 * @param {Variable} position the position value built into javascript idk.
 */
function savePosition(position) {
    deviceLon = position.coords.latitude; 
    deviceLat = position.coords.longitude;
}

/**
 * refreshes the page with the coordinates on the page
 */
function refresh(){
    var lon = document.getElementById("lon-num").value;
    var lat = document.getElementById("lat-num").value;
    if (isNaN(lon))
        lon = deviceLon;
    if (isNaN(lat))
        lat = deviceLat;
    radioQuery(lon, lat, 80, function(data){
        var runnerUps = 4;
        data.sort(compareRadioStrength);
        document.getElementById("result-1").innerHTML = data[0].freq;
        var runnerUpsString = "";
        for (var q = 1; q < runnerUps+1; q++){
            if (q>=data.length)
                break;
            if (q==1)
                runnerUpsString+=data[q].freq;
            else
                runnerUpsString+=" | "+data[q].freq;
        }
        document.getElementById("result-runnerups").innerHTML = runnerUpsString;
    });
    refreshTimeStamp();
}

/**
 * compares radio stations based on signal strength.
 * @param {RadioStation} a the first radio station.
 * @param {RadioStation} b the second radio stataion.
 */
function compareRadioStrength(a, b){
    if (a.strength < b.strength)
        return 1;
    if (a.strength > b.strength)
        return -1;
    return 0;
}

/**
 * refreshs the time stamp on the page to the current time.
 */
function refreshTimeStamp(){
    var d = new Date();
    var h = d.getHours();
    var dd = "AM";
    if (h >= 12) {
        h = d.getHours() - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    var ts = "Last Updated "+(d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+h+":"+d.getMinutes()+":"+d.getSeconds()+" "+dd;
    document.getElementById("updatetime-p").innerHTML = ts;
}

/**
 * 
 * @param {String} path path to the file with raw data from fcc query.
 */
function loadRawRadioFile(path){
    var request = new XMLHttpRequest();
    // open request
    request.open("GET", path);
    // on status change
    var radios = [];
    request.onreadystatechange = function(){
        if (request.readyState == XMLHttpRequest.DONE){
            var data = request.responseText.split("|");
            var freq, lonD, lonM, lonS, latD, latM, latS, haat, power;
            for (var q = 0; q < data.length; q++){
                // freq
                if ((q - 2) % 38 == 0){
                    freq = parseFloat(data[q]);
                }
                // lon 20
                if ((q - 20) % 38 == 0){
                    lonD = parseInt(data[q]);
                }
                if ((q - 21) % 38 == 0){
                    lonM = parseInt(data[q]);
                }
                if ((q - 22) % 38 == 0){
                    lonS = parseInt(data[q]);
                }
                // lat
                if ((q - 24) % 38 == 0){
                    latD = parseInt(data[q]);
                }
                if ((q - 25) % 38 == 0){
                    latM = parseInt(data[q]);
                }
                if ((q - 26) % 38 == 0){
                    latS = parseInt(data[q]);
                }
                // haat
                if ((q - 16) % 38 == 0){
                    haat = parseInt(data[q]);
                }
                // power 14-15
                if ((q - 16) % 38 == 0){
                    power = parseInt(data[q]);
                }
                // end
                if ((q) % 38 == 0 && q != 0){
                    if (!isNaN(haat) && !isNaN(power)){
                        radios.push(new RadioStation(freq, dmsToCoordinates(lonD, lonM, lonS), 
                                -1*dmsToCoordinates(latD, latM, latS), haat, power));
                    }
                }
            }
        }
    }
    request.send();
}

/**
 * gets all the raios in a circle around the position (lon, lat)
 * @param {Number} lon longitude
 * @param {Number} lat latitude
 * @param {Number} r radius
 * @param {Function} cb callback for when the radio stations have been collected
 */
function radioQuery(lon, lat, r, cb){
    // sending ajax requests:
    // https://openclassrooms.com/en/courses/3523261-use-javascript-in-your-web-projects/3759261-make-your-first-ajax-request
    var request = new XMLHttpRequest();
    // open request
    request.open("GET", "radiostations.json");
    // on status change
    request.onreadystatechange = function(){
        if (request.readyState == XMLHttpRequest.DONE){
            // handle response
            var response = [];
            // parse json data
            var data = JSON.parse(request.responseText).radiostations;
            // loop through all radio stations
            for (var q = 0; q < data.length; q++){
                var dist = distance(lon, lat, data[q].lon, data[q].lat);
                if (dist < r){
                    var rs = new RadioStation(data[q].freq, data[q].lon, data[q].lat, data[q].haat, 
                        data[q].power);
                    rs.strength = signalStrength(rs, lon, lat);
                    response.push(rs);
                }
            }
            cb(response);
        }
    }
    // send request to server
    request.send();
}

/**
 * @returns arbitrary value to measure the strength of a signal.
 * @param {RadioStation} radio the radio station to measure.
 * @param {Number} lon the longitude posisiton of the receiver ie car
 * @param {Number} lat the latitiude position of the receiver ie car
 */
function signalStrength(radio, lon, lat){
    return (antenaHeightFactor(radio.haat)*radio.power)/Math.exp(distance(lon, lat, radio.lon, radio.lat), 2);
}

/**
 * @returns arbitrary equation to get a value for the antenna value the follows a sqrt graph 
 * */
function antenaHeightFactor(haat){
    return .1*Math.sqrt(haat)+1;
}

/**
 * updates the html page lon and lat values with the one used in the js.
 */
function updateHTMLCoordinates(){
    document.getElementById("lon-num").value = deviceLon;
    document.getElementById("lat-num").value = deviceLat;
}

/**
 * @returns the distance between two points in kilometers. 
 * Forumla from https://www.movable-type.co.uk/scripts/latlong.html
 * @param {Number} lon1 longitude of the 1st point
 * @param {Number} lat1 latitude of the 1st point
 * @param {Number} lon2 longitude of the 2nd point
 * @param {Number} lat2 latitude of the 2nd point
 */
function distance(lon1, lat1, lon2, lat2){
    var R = 6371e3; // metres
    var φ1 = Math.radians(lon1);
    var φ2 = Math.radians(lon2);
    var Δφ = Math.radians(lon2-lon1);
    var Δλ = Math.radians(lat2-lat1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    // meters to kilometers
    d = d / 1000;

    return d;
}

/**
 * @returns the longitude or latitude for the dms given
 * @param {Number} degree degree value in dms 
 * @param {Number} minute minute value in dms
 * @param {Number} second second value in dms
 */
function dmsToCoordinates(degree, minute, second){
    // https://www.rapidtables.com/convert/number/degrees-minutes-seconds-to-degrees.html
    return degree+(minute/60)+(second/60);
}

/**
 * @returns array with dms values [0]=degree, [1]=minute, [2]=second
 * @param {Number} coordinate Longitude or Latitude value.
 */
function coordinatesToDMS(coordinate){
    dms = [];
    // https://stackoverflow.com/questions/7641818/how-can-i-remove-the-decimal-part-from-javascript-number
    // https://www.thoughtco.com/decimal-degrees-conversion-1434592
    dms[0] = Math.trunc(coordinate);
    dms[1] = Math.trunc(coordinate-dms[0]*10);
    dms[2] = Math.trunc((coordinate-(dms[1]/10))*100);
    return dms;
}
