const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
const app = express();
app.use(express.static('public')); //sets default path to public folder
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.sendFile(__dirname+"/signup.html");
});

app.get('/failure', (req, res) => {
    res.redirect("/");
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname+"/success.html");
});


app.post('/', (req, res) => {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;

    let data = { // creates json data
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data); //parses json data

    const url = "https://us17.api.mailchimp.com/3.0/lists/536695cfb5";
    const options = {
        method: "POST",
        auth: "rizwan:19d042788a4c094d78f7d695bf80d37bd-us17"
    };

    const request = https.request(url, options, (response)=>{

        if (response.statusCode === 200){ //if response code is 200 (success) then sends user to specified page
            res.sendFile(__dirname+"/success.html");
        } else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});








app.listen(process.env.PORT, () => {
    console.log('App listening on port 3000!');
});