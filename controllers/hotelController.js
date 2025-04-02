const Hotel = require('./../models/hotelModel')
const APIFeatures = require('./../utilities/apiTools');

exports.getAllHotels = async (req,res)=>{
    try{
        const hotelsData = new APIFeatures(Hotel.find(), req.query)
        .filter()
        .sort()
        .limitfields()
        .paginate()
        const hotels = await hotelsData.query;
        res.status(200).json({
            results: hotels.length,
            data: {
                hotels
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'Failed',
            message: err
        })
    }
}

exports.getHotel = async (req, res)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        })
    }catch(err){
        res.status(404).json({
            status: "Failed",
            message: err
        })
    }
}

exports.updateHotel = async (req, res) =>{
    try{
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            message: err
        })
    }
}

exports.deleteHotel = async (req, res)=>{
    try{
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data:null
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            message: err
        })
    }
}


exports.createHotel = async (req, res) =>{
   try{
      const newHotel = await Hotel.create(req.body);
      res.status(201).json({
        status: 'success',
        data: newHotel
      })
   }catch(err){
      res.status(400).json({
        status: 'Failed',
        message: err
      })
   }
   
}