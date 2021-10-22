const mongoose = require('mongoose');

/**
 * Race Event Schema
 * @type {Model}
 */
const raceEventSchema = mongoose.Schema({
  event: {
    type: String
  },
  horse: {
    id: {
      type: Number
    },
    name: {
      type: String
    },
  },
  time: {
    type: Number
  },
});

module.exports = mongoose.model('race_event', raceEventSchema);
