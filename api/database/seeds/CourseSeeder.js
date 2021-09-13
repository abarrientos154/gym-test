'use strict'
var ObjectId = require('mongodb').ObjectId;
/*
|--------------------------------------------------------------------------
| CourseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Course = use("App/Models/Course")
const courseData = [
  {
    _id: new ObjectId('613b6d93606f11371987e2cc'),
    id: 1,
    name: 'Derecho',
    icon: 'gavel'
  },
]

class CourseSeeder {
  async run () {
    for (let i in courseData) {
      let course = await Course.findBy('_id', courseData[i]._id)
      if (!course) {
        await Course.create(courseData[i])
      }
    }
    console.log('Finished Course')
  }
}

module.exports = CourseSeeder
