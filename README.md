# Real-Time-Web

<details>
  <summary> Chat app</summary>
  In week 1 was het de bedoeling een chat app te bouwen. Dit is goed gelukt en ik heb hierbij een basis gelegd voor mijn Eindopdracht.
</details>

## Eindopdracht
[live demo](https://final-assignment-zarjxmiosj.now.sh/login)

### Concept
Het idee is om een soort discussie app te bouwen. Het idee is als volgt: de gebruiker registreert en kiest een gebruikersnaam. Vervolgens 'joined' de gebruiker een van de vele 'rooms' met elk een eigen categorie, bijvoorbeeld sport. Al deze chatrooms halen ook tweets op uit de twitter api. Iedereen kan deze tweets zien en tegelijkertijd ook met elkaar discusieren. Daarnaast kan je ook je eigen zoekterm maken en er voor zorgen dat de api tweets 'trackt' aan de hand van jouw zoekterm. Dus, discusieren maar!

### Data life cycle
Helaas moeten jullie het qua kwaliteit met deze tekening doen, mijn adobe licentie is verlopen en ik blijf immers maar gewoon een arme zangeres.

<img src="https://github.com/japgroevemaker/real-time-web-1819/blob/master/Final-assignment/img/data_life_cycle.jpg" width="40%"/>

### Twitter API
Ik gebruik de twitter api. Ik gebruik de twitter API client [twit](https://www.npmjs.com/package/twit).

Deze configureer je op de volgende manier.
```js
let Twit = require('twit');

let T = new Twit({
  consumer_key:         'roz8tFgK8w9elwL1K8dmpZSl',
  consumer_secret:      'mrIwaSIUK9LcIT5wYiujA2WNXWMJPvoupqHRVnf3TXMsPY78',
  access_token:         '741148952851034112-ETDOWGB8P1fkOLcf02Y28szagRBSs',
  access_token_secret:  'aB3fNVspjonDDXUVERns9ElHnPebJ9eQ3G8LeTTzRML',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})
```
Deze gegevens kan je verkrijgen als je een developer account bij twitter aanmaakt.

### Socket.io
De app heb ik gebouwd met [socket.io](https://socket.io/). Socket zorgt ervoor dat er een real-time verbinding wordt gemaakt tussen de Server-side javascript en de Client-side javascript. Hieronder zal ik beknopt uitleggen hoe makkelijk het is om socket te gebruiken.

```js
const io = socket();

io.on('connection', function(socket){

})
```
en de real-time verbinding is gemaakt! Vervolgens kan je binnen deze functie helemaal los gaan als het op real-time aankomt. Hieronder laat ik zien hoe je tweets uit de twitter api server-side binnenhaalt en real-time serveert via clientside javascript.


```js
let stream = T.stream('statuses/filter', {track: 'trump'})
```
Je maakt een nieuwe stream aan op je server, deze stream pakt alle tweets met het woord `trump` er in.

```js
stream.on('tweet', function(tweet){
  socket.emit('tweet', tweet)
});
```
Hierboven "pass" je de tweets als het waren door naar de clientside javascript. Hij zegt hier dat alle binnengekomen tweets uitgezonden (emit) moeten worden.
```js
socket.on('tweet', function(stream){

})
```
Vervolgens laat je de clientside javascript als het ware luisteren naar of er nieuwe tweets binnenkomen. Best simpel toch!

### Wat wil ik nog toevoegen?
- [ ] Database toevoegen(google firebase)
- [x] Express-sessions
- [ ] Form validation
- [ ] Styling verbeteren
- [ ] Gebruikers die hun eigen 'room' kunnen aanmaken
