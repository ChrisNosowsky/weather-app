const request = require('request')



const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/2aa76798df1afb5334c9e9bbf8a62416/' + latitude + ',' + longitude

    request({url, json:true}, (error, {body}) => {
        if(error) {
            callback('Unable to connect to weather service!', undefined)
        }
        else if (body.error) {
            callback('Unable to find location. Try another search.', undefined)
        }
        else {
            callback(undefined, body.daily.data[0].summary + " It is currently " + body.currently.temperature + " .There is a " + body.currently.precipProbability * 100 + "% chance of rain.")
        }
    })
}


module.exports = forecast