const sauces = require('../models/Sauces');
const fs = require('fs');


//Create a sauce

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new sauces({
        ...sauceObject,
        usersLiked: "",
        likes: 0,
        usersDisliked: "",
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => {
            res.status(200).json({ message: 'user saved' })
        })
        .catch(error => res.status(400).json({ error }));
}







//Delete a sauce

exports.deleteSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};



//Display all sauces

exports.displaySauce = (req, res, next) => {
    sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

//Find one specific sauce

exports.findSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then(sauces => {
            res.status(200).json(
                {
                    _id: sauces._id,
                    name: sauces.name,
                    manufacturer: sauces.manufacturer,
                    description: sauces.description,
                    mainPepper: sauces.mainPepper,
                    heat: sauces.heat,
                    userId: sauces.userId,
                    usersLiked: [sauces.usersLiked],
                    likes: sauces.likes,
                    usersDisliked: [sauces.usersDisliked],
                    dislikes: sauces.dislikes,
                    imageUrl: sauces.imageUrl,
                    __v: 0
                }
            )
        })
        .catch(error => res.status(400).json({ error }));
}



//Modify a sauce

exports.modifySauce = (req, res, next) => {
   
    const sauceObject = req.file ?
        {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        : { ...req.body };

    sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
}

//Like a sauce

exports.likeSauce = (req, res, next) => {
    
    sauces.findOne({ _id: req.params.id })
        .then(sauce => {

                //SI L'UTILISATEUR A DEJA DIS OR LIKED LA SAUCE

            let array_like = sauce.usersLiked.split(',');
            let array_dislike = sauce.usersDisliked.split(',');

                if (array_like.find(element => element === req.body.userId) || array_dislike.find(element => element === req.body.userId)) {
                    
                    //REMOVE AN OPINION

                        if (array_like.find(element => element === req.body.userId)) {

                            var filtered = array_like.filter(function (value, index, arr) { return value !== req.body.userId; });

                            let sauceObject = {
                                _id: sauce._id,
                                userId: sauce.userId,
                                name: sauce.name,
                                manufacturer: sauce.manufacturer,
                                description: sauce.description,
                                mainPepper: sauce.mainPepper,
                                heat: sauce.heat,
                                imageUrl: sauce.imageUrl,
                                usersLiked: filtered.toString(),
                                likes: sauce.likes - 1,
                                usersDisliked: sauce.usersDisliked,
                                dislikes: sauce.dislikes,
                            }

                            //console.log('Sauce likes: ' + sauceObject.likes);

                            sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                                .then(() => res.status(200).json({ message: 'Objet modifié (Like)!' }))
                                .catch(error => res.status(400).json({ error }));
                        }

                        else if (array_dislike.find(element => element === req.body.userId)) {
                            var filtered = array_dislike.filter(function (value, index, arr) { return value !== req.body.userId; });

                            let sauceObject = {
                                _id: sauce._id,
                                userId: sauce.userId,
                                name: sauce.name,
                                manufacturer: sauce.manufacturer,
                                description: sauce.description,
                                mainPepper: sauce.mainPepper,
                                heat: sauce.heat,
                                imageUrl: sauce.imageUrl,
                                usersLiked: sauce.usersLiked,
                                likes: sauce.likes,
                                usersDisliked: filtered.toString(),
                                dislikes: sauce.dislikes - 1,
                            }

                            sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                                .then(() => res.status(200).json({ message: 'Objet modifié (Dislike)!' }))
                                .catch(error => res.status(400).json({ error }));
                        }
                    

                    
                }

                //SI L'UTILISATEUR N'A PAS DEJA DIS OR LIKED LA SAUCE

                else {

                    //ADD A LIKE

                    let count = array_like.push(req.body.userId)

                    if (req.body.like == 1) {
                        let sauceObject = {
                            _id: sauce._id,
                            userId: sauce.userId,
                            name: sauce.name,
                            manufacturer: sauce.manufacturer,
                            description: sauce.description,
                            mainPepper: sauce.mainPepper,
                            heat: sauce.heat,
                            imageUrl: sauce.imageUrl,
                            usersLiked: array_like.toString(),
                            likes: sauce.likes + 1,
                            usersDisliked: sauce.usersDisliked,
                            dislikes: sauce.dislikes,
                        }

                        sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Objet modifié (Dislike)!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                
                    
                    //ADD A DISLIKE
                
                    let countdislike = array_dislike.push(req.body.userId);

                    if (req.body.like == -1) {
                        let sauceObject = {
                            _id: sauce._id,
                            userId: sauce.userId,
                            name: sauce.name,
                            manufacturer: sauce.manufacturer,
                            description: sauce.description,
                            mainPepper: sauce.mainPepper,
                            heat: sauce.heat,
                            imageUrl: sauce.imageUrl,
                            usersLiked: sauce.usersLiked,
                            likes: sauce.likes,
                            usersDisliked: array_dislike.toString(),
                            dislikes: sauce.dislikes + 1,
                        }

                        sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Objet modifié (Dislike)!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                }
        })
}