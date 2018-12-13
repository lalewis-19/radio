



class RadioStation {
    constructor(){
        this.freq = 94.5;
        this.lon = 39.918162846609455;
        this.lat = -75.16113325953484;
        this.haat = 100; // antena height above average terrain
        this.power = 10000;
    }
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
 * @returns the distance between two points. Forumla from https://www.movable-type.co.uk/scripts/latlong.html.
 * @param {Number} lon1 longitude of the 1st point
 * @param {Number} lat1 latitude of the 1st point
 * @param {Number} lon2 longitude of the 2nd point
 * @param {Number} lat2 latitude of the 2nd point
 */
function distance(lon1, lat1, lon2, lat2){
    var R = 6371e3; // metres
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2-lat1).toRadians();
    var Δλ = (lon2-lon1).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

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
