﻿const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../models/Users');

//Login user function

exports.loginUser = (req, res, next) => {
    users.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'CRYPTAGE_VIVIEN_NOEL',
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};





//Signup user function

exports.signupUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new users({
                email: req.body.email,
                password: hash
            });


            user.save().then(() => {
                res.status(201).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                })
            })
        .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {
            res.status(510).json({ error })
        });
}

