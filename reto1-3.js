const express = require('express');
const app = express();

class Professional {

    name;
    age;
    genre;
    heigth;
    hairColor;
    eyeColor;
    race;
    isRetired;
    nationality;
    oscarsNumber;
    profession;

    constructor (name, age, genre, height, hairColor,
                eyeColor, race, isRetired, 
                nationality, oscarsNumber, profession)
    {
        this.name = name;
        this.age = age;
        this.genre = genre;
        this.heigth = height;
        this.hairColor = hairColor;
        this.eyeColor = eyeColor;
        this.race =race;
        this.isRetired = isRetired;
        this.nationality = nationality;
        this.oscarsNumber = oscarsNumber;
        this.profession = profession;
    };

    printProfesional()
    {
        const myProfessional = ("The name is: "+ this.name +
                                      "\nThe age is: " + this.age +
                                      "\nThe genre is: " + this.genre +
                                      "\nThe heigth: " + this.heigth+
                                      "\nThe color of the hair is: " +this.hairColor +
                                      "\nThe color of the eyes are: " + this.eyeColor + 
                                      "\nThe race is: " + this.race +
                                      "\nIs retired?: " + this.isRetired +
                                      "\nThe nationality is: " + this.nationality +
                                      "\nThe profession is " + this.profession);
        return myProfessional;
    };
};

function constructProfessional (inJson) {
    newprofessional = new Professional(inJson.name, inJson.age,
        inJson.genre, inJson.heigth,
        inJson.hairColor, inJson.eyeColor,
        inJson.race, inJson.isRetired,
        inJson.nationality, inJson.oscarsNumber,
        inJson.profession);

        return newprofessional;
};

function getProfIdByName (arrayProf, name) {
    let index = 0;
    while(index < arrayProf.length &&
        arrayProf[index].name !== name)
    {
        index++;
    };
    if (index === arrayProf.length)
    {
        index = -1;
    }
    // console.log(index);
    return index;
};

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((request, respond, next) =>
{
    console.log('Sucessfully conected to the server!');
    next();
});

let arrayProfessionals = [];

app.get('/professionals', (request, response) => {
    let answer;
    if (arrayProfessionals.length == 0)
    {
        answer = {error: true, code: 200,
                  msg: 'No professionals registered.',
                  prof: arrayProfessionals};
    }
    else
    {
        answer = {error: false, code: 200,
                  msg: 'professional registered',
                  prof: arrayProfessionals};
    };
    console.log('Client request:', request.method,
    '=> Server response status:', response.statusCode);
    response.send(answer);
});

app.get('/professionals/:id', (request, response) => {
    let answer;
    if (arrayProfessionals.length == 0 || 
        arrayProfessionals.length < request.params.id ||
        request.params.id == 0)
    {
        answer = {error: true, code: 200,
                  msg: 'Professional not registered.',
                  prof: 'Total ids: ' + arrayProfessionals.length};
    }
    else
    {
        answer = {error: false, code: 200,
                  msg: 'Professional identified',
                  prof: arrayProfessionals[request.params.id - 1]};
    };
    console.log('Client request:', request.method +'_params',
    '=> Server response status:', response.statusCode);
    response.send(answer);
});

app.post('/professionals', (request, response) =>
{
    let answer;
    profId = getProfIdByName(arrayProfessionals, request.body.name);
    if (profId == -1)
    {
        arrayProfessionals.push(constructProfessional(request.body));
        answer        = {error: false, code: 200,
                        msg: 'New professional created:',
                        prof: arrayProfessionals[arrayProfessionals.length-1]};
    }
    else
    {
        answer        = {error: true, code: 200,
                        msg: 'Professional already exists',
                        prof: arrayProfessionals[profId]};
    }
    console.log('Client request:', request.method,
    '=> Server response status:', response.statusCode);
    response.send(answer);
});

app.put('/professionals', (request, response) =>
{
    let answer;
    profId = getProfIdByName(arrayProfessionals, request.body.name);
    if (profId !== -1)
    {
        for (let featToChange in request.body) {
            arrayProfessionals[profId][featToChange] = request.body[featToChange];
        }
        answer = {error: false, code: 200, msg: 'Professional data updated.',
        prof: arrayProfessionals[profId]};
    }
    else
    {
        answer = {error: true, code: 200, msg: 'Professional not registered.'};
    };
    console.log('Client request:', request.method,
    '=> Server response status:', response.statusCode);
    response.send(answer);
});

app.delete('/professionals', (request, response) =>
{
    let answer;
    profId = getProfIdByName(arrayProfessionals, request.body.name);
    if (profId !== -1)
    {
        arrayProfessionals.splice(profId, 1);
        answer        = {error: false, code: 200, msg: 'Professional deleted.',
                        prof: arrayProfessionals};
    }
    else
    {
        answer        = {error: true, code: 200, msg: 'Professional not found.',
                        prof: arrayProfessionals};
    };
    console.log('Client request:', request.method,
    '=> Server response status:', response.statusCode);
    response.send(answer);
});

app.use((request, response, next) => {
    respuesta = {error: true, code: 404, msg: 'URL not found'};
    response.status(404).send(respuesta);
});

app.listen(3000);














// Profesional examples:
// let prof1 = {"name": "Brad Pitt", "age": 57, "genre": "male", "heigth": 180, "hairColor": "blonde", "eyeColor": "blue", "race": "caucasian", "isRetired": false, "nationality": "EEUU", "oscarsNumber": 0, "profession": ["actor", "productor"]}
// let prof2 = {"name": "Jessica Chastain", "age": 43, "genre": "female", "heigth": 163, "hairColor": "red", "eyeColor": "blue", "race": "caucasian", "isRetired": false, "nationality": "EEUU", "oscarsNumber": 0, "profession": ["actor", "productor"]}
// let prof3 = {"name": "Idris Elba", "age": 49, "genre": "male", "heigth": 190, "hairColor": "black", "eyeColor": "black", "race": "african-american", "isRetired": false, "nationality": "UK", "oscarsNumber": 0, "profession": ["actor", "productor"]}
// let prof4 = {"name": "Regina King", "age": 50, "genre": "female", "heigth": 160, "hairColor": "black", "eyeColor": "black", "race": "african-american", "isRetired": false, "nationality": "EEUU", "oscarsNumber": 1, "profession": ["actor", "productor"]}
// let prof5 = {"name": "Anthony Hopkins", "age": 83, "genre": "male", "heigth": 175, "hairColor": "white", "eyeColor": "blue", "race": "caucasian", "isRetired": false, "nationality": "UK", "oscarsNumber": 2, "profession": ["actor", "productor", "director", "compositor"]}
// let prof6 = {"name": "Helen Miren", "age": 73, "genre": "female", "heigth": 163, "hairColor": "blonde", "eyeColor": "blue", "race": "caucasian", "isRetired": false, "nationality": "UK", "oscarsNumber": 1, "profession": ["actor"]}
// let prof7 = {"name": "Antonio de la Torre", "age": 53, "genre": "male", "heigth": 173, "hairColor": "black", "eyeColor": "blue", "race": "caucasian", "isRetired": false, "nationality": "Spain", "oscarsNumber": 0, "profession": ["actor"]}
// let prof8 = {"name": "Elena Anaya", "age": 46, "genre": "female", "heigth": 165, "hairColor": "black", "eyeColor": "black", "race": "caucasian", "isRetired": false, "nationality": "Spain", "oscarsNumber": 0, "profession": ["actor"]}