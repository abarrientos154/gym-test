'use strict'
var ObjectId = require('mongodb').ObjectId;

/*
|--------------------------------------------------------------------------
| PlaceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Place = use("App/Models/Place")
const placeData = [
  {
      "ID": 1,
      "community_id": 1,
      "name": "Almeria"
    },
    {
      "ID": 2,
      "community_id": 1,
      "name": "Cádiz"
    },
    {
      "ID": 3,
      "community_id": 1,
      "name": "Córdoba"
    },
    {
      "ID": 4,
      "community_id": 1,
      "name": "Granada"
    },
    {
      "ID": 5,
      "community_id": 1,
      "name": "Huelva"
    },
    {
      "ID": 6,
      "community_id": 1,
      "name": "Jaén"
    },
    {
      "ID": 7,
      "community_id": 1,
      "name": "Málaga"
    },
    {
      "ID": 8,
      "community_id": 1,
      "name": "Sevilla"
    },
    {
      "ID": 9,
      "community_id": 2,
      "name": "Huesca"
    },
    {
      "ID": 10,
      "community_id": 2,
      "name": "Teruel"
    },
    {
      "ID": 11,
      "community_id": 2,
      "name": "Zaragoza"
    },
    {
      "ID": 12,
      "community_id": 3,
      "name": "Asturias"
    },
    {
      "ID": 13,
      "community_id": 4,
      "name": "Balears, Illes"
    },
    {
      "ID": 14,
      "community_id": 5,
      "name": "Palmas, Las"
    },
    {
      "ID": 15,
      "community_id": 5,
      "name": "Santa Cruz de Tenerife"
    },
    {
      "ID": 16,
      "community_id": 6,
      "name": "Cantabria"
    },
    {
      "ID": 17,
      "community_id": 7,
      "name": "Ávila"
    },
    {
      "ID": 18,
      "community_id": 7,
      "name": "Burgos"
    },
    {
      "ID": 19,
      "community_id": 7,
      "name": "León"
    },
    {
      "ID": 20,
      "community_id": 7,
      "name": "Palencia"
    },
    {
      "ID": 21,
      "community_id": 7,
      "name": "Salamanca"
    },
    {
      "ID": 22,
      "community_id": 7,
      "name": "Segovia"
    },
    {
      "ID": 23,
      "community_id": 7,
      "name": "Soria"
    },
    {
      "ID": 24,
      "community_id": 7,
      "name": "Valladolid"
    },
    {
      "ID": 25,
      "community_id": 7,
      "name": "Zamora"
    },
    {
      "ID": 26,
      "community_id": 8,
      "name": "Albacete"
    },
    {
      "ID": 27,
      "community_id": 8,
      "name": "Ciudad Real"
    },
    {
      "ID": 28,
      "community_id": 8,
      "name": "Cuenca"
    },
    {
      "ID": 29,
      "community_id": 8,
      "name": "Guadalajara"
    },
    {
      "ID": 30,
      "community_id": 8,
      "name": "Toledo"
    },
    {
      "ID": 31,
      "community_id": 9,
      "name": "Barcelona"
    },
    {
      "ID": 32,
      "community_id": 9,
      "name": "Girona"
    },
    {
      "ID": 33,
      "community_id": 9,
      "name": "Lleida"
    },
    {
      "ID": 34,
      "community_id": 9,
      "name": "Tarragona"
    },
    {
      "ID": 35,
      "community_id": 10,
      "name": "Alicante/Alacant"
    },
    {
      "ID": 36,
      "community_id": 10,
      "name": "Castellón/Castelló"
    },
    {
      "ID": 37,
      "community_id": 10,
      "name": "Valencia/València"
    },
    {
      "ID": 38,
      "community_id": 11,
      "name": "Badajoz"
    },
    {
      "ID": 39,
      "community_id": 11,
      "name": "Cáceres"
    },
    {
      "ID": 40,
      "community_id": 12,
      "name": "Coruña, A"
    },
    {
      "ID": 41,
      "community_id": 12,
      "name": "Lugo"
    },
    {
      "ID": 42,
      "community_id": 12,
      "name": "Ourense"
    },
    {
      "ID": 43,
      "community_id": 12,
      "name": "Pontevedra"
    },
    {
      "ID": 44,
      "community_id": 13,
      "name": "Madrid"
    },
    {
      "ID": 45,
      "community_id": 14,
      "name": "Murcia"
    },
    {
      "ID": 46,
      "community_id": 15,
      "name": "Navarra"
    },
    {
      "ID": 47,
      "community_id": 16,
      "name": "Araba/Álava"
    },
    {
      "ID": 48,
      "community_id": 16,
      "name": "Bizkaia"
    },
    {
      "ID": 49,
      "community_id": 16,
      "name": "Gipuzkoa"
    },
    {
      "ID": 50,
      "community_id": 17,
      "name": "Rioja, La"
    },
    {
      "ID": 51,
      "community_id": 18,
      "name": "Ceuta"
    },
    {
      "ID": 52,
      "community_id": 19,
      "name": "Melilla"
    }
]

class PlaceSeeder {
  async run () {
    for (let i in placeData) {
      let place = await Place.findBy('ID', placeData[i].ID)
      if (!place) {
        await Place.create(placeData[i])
      }
    }
    console.log('Finished Place')
  }
}

module.exports = PlaceSeeder
