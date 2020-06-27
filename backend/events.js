const express = require('express');

function createRouter(db) {
    const router = express.Router();

    router.get('/usersTBFields', (req, res, next) => {
        if(checkConnection(db).status === fail){
            console.log("Connection failed server down");
            res.status(500).send({status: 'error', message: 'server down'});
        }

        db.query('SELECT * FROM users',async (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(500).send({status: 'error'});
            } else {
                dbFields = await Promise.all(fields.map((field) => { return field.name }));
                res.status(200).send(dbFields);
            }
        });
    });

    return router;
}

function checkConnection(db){
    if(db.state === 'disconnected'){
        return { status: 'fail', message: 'server down'};
    }
}

module.exports = createRouter;