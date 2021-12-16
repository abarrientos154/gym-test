'use strict'
var ObjectId = require('mongodb').ObjectId;
/*
|--------------------------------------------------------------------------
| CommunitySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Community = use("App/Models/Community")
const communityData = [
  {
      "community_id": 1,
      "name": "Andalucía"
    },
    {
      "community_id": 2,
      "name": "Aragón"
    },
    {
      "community_id": 3,
      "name": "Asturias, Principado de"
    },
    {
      "community_id": 4,
      "name": "Balears, Illes"
    },
    {
      "community_id": 5,
      "name": "Canarias"
    },
    {
      "community_id": 6,
      "name": "Cantabria"
    },
    {
      "community_id": 7,
      "name": "Castilla y León"
    },
    {
      "community_id": 8,
      "name": "Castilla.La Mancha"
    },
    {
      "community_id": 9,
      "name": "Cataluña"
    },
    {
      "community_id": 10,
      "name": "Comunitat Valenciana"
    },
    {
      "community_id": 11,
      "name": "Extemadura"
    },
    {
      "community_id": 12,
      "name": "Galicia"
    },
    {
      "community_id": 13,
      "name": "Madrid, Comunidad de "
    },
    {
      "community_id": 14,
      "name": "Murcia, Región de"
    },
    {
      "community_id": 15,
      "name": "Navarra, Comunidad Foral de"
    },
    {
      "community_id": 16,
      "name": "País Vasco"
    },
    {
      "community_id": 17,
      "name": "Rioja, La"
    },
    {
      "community_id": 18,
      "name": "Ceuta"
    },
    {
      "community_id": 19,
      "name": "Melilla"
    }
  /* {
    _id: new ObjectId('60912d97556b217e7c8a0d62'),
    id: 1,
    name: 'Andalucía'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d64'),
    id: 2,
    name: 'Aragón'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d66'),
    id: 3,
    name: 'Canarias'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d68'),
    id: 4,
    name: 'Cataluña'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d6a'),
    id: 5,
    name: 'Ceuta'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d6c'),
    id: 6,
    name: 'Comunidad de Madrid'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d6e'),
    id: 7,
    name: 'Comunidad Valenciana'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d70'),
    id: 8,
    name: 'Euskadi'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d72'),
    id: 9,
    name: 'Galicia'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d74'),
    id: 10,
    name: 'Islas Baleares'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d76'),
    id: 11,
    name: 'Melilla'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d78'),
    id: 12,
    name: 'Principado de Arturias'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d7a'),
    id: 13,
    name: 'Region de Murcia'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d7c'),
    id: 14,
    name: 'Cantabria'
  } */
]

class CommunitySeeder {
  async run () {
    for (let i in communityData) {
      let community = await Community.findBy('community_id', communityData[i].community_id)
      if (!community) {
        await Community.create(communityData[i])
      }
    }
    console.log('Finished Community')
  }
}

module.exports = CommunitySeeder
