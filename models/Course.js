const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add a number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Static method to get average of course tuition
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {}
};

// Call getAverageCost After Save
CourseSchema.post('save', function() {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost Before remove
CourseSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
