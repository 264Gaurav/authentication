const mongoose =require('mongoose');

const NotesSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        des:{
            type:String,
            required:true
        },
        
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reference:{
            type:String
        }, 
        // confirm_note: {
        //     type: String,
        //     required: true,
        //     enum: ["approved", "rejected", "pending"],
        //     default: "pending"
        // },        
       
        date: {
            type: Date,
            default: Date.now
        },
    }, {timestamps:true}
)



const Notes=mongoose.model('Notes',NotesSchema);
module.exports=Notes;