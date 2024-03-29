import { readdirSync } from 'fs'
import {EventsLoaded} from '../events/system/systemlogs.js'
const eventsFilesNames = readdirSync('./src/events/').filter(fileName => fileName.endsWith('.js'))
const eventsFilesFunctions = readdirSync('src/events/functions/').filter(fileName => fileName.endsWith('.js'))

for (const eventFileName of eventsFilesNames)
  import(`../events/${eventFileName}`)

for (const eventFileName of eventsFilesFunctions) {
  import(`../events/functions/${eventFileName}`)
}
console.log(`${[...eventsFilesNames, ...eventsFilesFunctions].length} Events | OK`)
EventsLoaded()