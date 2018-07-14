var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');

function writeToLog(data) {
    fs.appendFile("log.txt", '\r\n');

    fs.appendFile("log.txt", JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Updated log.txt");
    });
}

function movieSearch(movieName) {

    if (!movieName) {
        movieName = "Mr Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            let jsonData = JSON.parse(body);
            
            output = 
                'Title: ' + jsonData.Title +
                'Year: ' + jsonData.Year +
                'Rated: ' + jsonData.Rated +
                'IMDB Rating: ' + jsonData.imdbRating +
                'Country: ' + jsonData.Country +
                'Language: ' + jsonData.Language +
                'Plot: ' + jsonData.Plot +
                'Actors: ' + jsonData.Actors +
                'IMDb Rating: ' + jsonData.imdbRating + "\n";

            console.log(output);

            fs.appendFile("log.txt", output, function (err) {
                if (err) throw err;
                console.log('Saved to log.txt.');
            });
        }
    });
}

function spotifySearch(songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "The Sign";
    }

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            output = 
                "Song Name: " + "'" + songName.toUpperCase() + "'" +
                "Album Name: " + data.tracks.items[0].album.name +
                "Artist Name: " + data.tracks.items[0].album.artists[0].name +
                "URL: " + data.tracks.items[0].album.external_urls.spotify + "\n";
            console.log(output);

            fs.appendFile("log.txt", output, function (err) {
                if (err) throw err;
                console.log('Saved to log.txt.');
            });
        };
    });
}

function recentTweets() {
    var client = new twitter(keys.twitter);
    var params = { screen_name: 'pressybooboo', count: 20 };

    client.get('statuses/user_timeline', params, function (err, tweets, res) {

        if (!err) {
            let data = [];
            for (let i = 0; i < tweets.length; i++) {
                data.push({
                    'created at: ': tweets[i].created_at,
                    'Tweets: ': tweets[i].text,
                });
            }
            console.log(data);
            writeToLog(data);
        }
    });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);
        writeToLog(data);
        var dataArr = data.split(',')

        if (dataArr.length == 2) {
            choice(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            (dataArr[0]);
        }

    });
}

function choice(caseData, functionData) {
    switch (caseData) {
        case 'spotify-this-song':
            spotifySearch(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        case 'my-tweets':
            recentTweets();
            break;
        case 'movie-this':
            movieSearch(functionData);
            break;
        default:
            console.log('Huh...?');
    }
}

function appStart(argOne, argTwo) {
    choice(argOne, argTwo);
};

appStart(process.argv[2], process.argv[3]);