'use strict'
var ObjectId = require('mongodb').ObjectId;
/*
|--------------------------------------------------------------------------
| LicenseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const License = use("App/Models/License")
const licenseData = [
  {
    _id: new ObjectId('6187fd1aff8458493d558f4c'),
    id: 1,
    name: 'Sencillo',
    months: 1,
    monthPrice: 9.99,
    total: 9.99
  },
  {
    _id: new ObjectId('6187fd1aff8458493d558f4e'),
    id: 2,
    name: 'Ahorra un 25%',
    months: 6,
    monthPrice: 7.49,
    total: 44.94
  },
  {
    _id: new ObjectId('6187fd1aff8458493d558f50'),
    id: 3,
    name: 'Ahorra un 50%',
    months: 12,
    monthPrice: 4.99,
    total: 59.88
  },
]

class LicenseSeeder {
  async run () {
    for (let i in licenseData) {
      let license = await License.findBy('_id', licenseData[i]._id)
      if (!license) {
        await License.create(licenseData[i])
      }
    }
    console.log('Finished License')
  }
}

module.exports = LicenseSeeder
