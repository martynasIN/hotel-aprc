const mongoose = require('mongoose');

const reviewShema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'You must leave rating']
    },
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hotel',
        required: [true, 'You must select a hotel']
    },

    createdAt:{
        type:Date,
        default: Date.now()
    }
})

reviewShema.pre(/^find/, function(next){
    this.populate({
        path:"hotel",
        select: "name"
    })
    next()
})

const Review = mongoose.model('Review', reviewShema);

module.exports = Review