const express=require('express');
const router=express.Router();
const authMiddleware=require('../middlewares/authMiddleware');
const Notes=require('../models/Notes');
const User=require('../models/User');

router.post('/upload', authMiddleware, async (req, res) => {
    // Check if the user is an admin
    if (req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can post notes' });
    }

    const { title, des, reference } = req.body;
    if(!title || !des )return res.status(401).json({message: 'Please provide Notes details'});

    try {
        const newNote = new Notes({
            title,
            des,
            author: req.user.id,
            reference
        });

        const savedNote = await newNote.save();
        return res.status(201).json({message:"Notes Created" , savedNote});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Route to get notes, returns all notes for regular users and only their own notes for admins
router.get('/', authMiddleware, async (req, res) => {
    try {
        let notes;
        if (req.user.userType === 'admin') {
            notes = await Notes.find({ author: req.user.id }).populate('author', 'name email');
        } else {
            notes = await Notes.find().populate('author', 'name email');
        }
        return res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Route to delete notes, only accessible by admins who are the author of the note
router.delete('/:id', authMiddleware, async (req, res) => {
    // Check if the user is an admin
    if (req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete notes' });
    }

    try {
        const note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the authenticated admin is the author of the note
        if (note.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only delete notes you posted' });
        }

        await note.remove();

        res.json({ message: 'Note deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Route to update notes, only accessible by the author of the note
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, des, reference } = req.body;

    try {
        const note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the authenticated user is the author of the note
        if (note.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only update notes you posted' });
        }

        // Update the note
        note.title = title || note.title;
        note.des = des || note.des;
        note.reference = reference || note.reference;

        const updatedNote = await note.save();

        res.status(200).json({ message: 'Note updated', updatedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports=router;