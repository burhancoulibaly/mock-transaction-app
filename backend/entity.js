const pool = require("./db");

let tableInstances = {};

class Entity {
    constructor(table) {
        // if(tableInstances[table]){
        //     return tableInstances[table];
        // }

        this._entity = table;
        tableInstances[table] = this._entity;

        return{
            setEntity(table){
                // if(tableInstances[table]){
                //     delete tableInstances[table];
                //     this._entity = tableInstances[table];
                //     return this._entity;
                // }

                delete tableInstances[table];
                this._entity = table;
                tableInstances[table] = this._entity;
            },
            insertRow(args){
                return new Promise((resolve,reject) => {
                    pool.getConnection(function(err, db) {
                        if(err) reject(err);

                        //insert row using args object for fields;
                        //INSERT INTO table_name VALUES (value1, value2, value3, ...);
                        let sql = `INSERT INTO ${tableInstances[table]} VALUES (`;
                        
                        args.map((val, i) => {
                            sql += val.toString();
    
                            if(i < args.length-1){
                                sql += ", ";
                            }
                        });
    
                        sql += ");";
    
                        db.query(sql, function(err, result){
                            if(err) reject(err);
    
                            resolve(result);
                            return;
                        });
    
                        db.release();
                    })
                })
            },
            getRow(primaryKey, value){
                return new Promise((resolve,reject) => {
                    pool.getConnection(function(err, db) {
                        if(err) reject(err);  
                        //return row from table
                        //SELECT * FROM table_name WHERE condition...;
                        let sql = `SELECT * FROM ${tableInstances[table]} WHERE ${primaryKey} = ${value}`;

                        db.query(sql, function(err, result){
                            if(err) reject(err);

                            resolve(result);
                            return;
                        });

                        db.release();
                    })
                })
            },
            getRows(field, value){
                return new Promise((resolve,reject) => {
                    pool.getConnection(function(err, db) {
                        //returns rows in entity where search value is equal to field value in entity
                        
                        db.release();
                    })
                })
            },
            getColumns(field){
                return new Promise((resolve,reject) => {
                    pool.getConnection(function(err, db) {
                        //returns all values for a specific column in an entity
                        
                        db.release();
                    })
                })
            },
            getAll(){
                return new Promise((resolve,reject) => {
                    pool.getConnection(function(err, db) {
                        //returns all rows and columns
                        
                        db.release();
                    })
                })
            },
            editRow(searchPrimKey, searchValue, editField, editValue){
                let row = getRow(searchPrimKey, searchValue);
                return new Promise((resolve,reject) => {
                    pool.getConnection(function(err, db) {
                        //edits a field in the row, returns array [success/error, results(error/row that was changed)]
                       
                        db.release();
                    })
                })
            },
            deleteValue(searchPrimKey, searchValue, editField, editValue){
                let row = getRow(searchPrimKey, searchValue);
                return new Promise((resolve,reject) => {
                    pool.getConnection(function(err, db) {
                        //deletes a field in the row, returns array [success/error, results(error/row that was changed)]
                       
                        db.release();
                    })
                })
            },
            deleteRow(searchPrimKey, searchValue){
                return new Promise((resolve,reject) => {
                    pool.getConnection(function(err, db) {
                        //gets rows that match given args if more than one row returns error to be more specific else,
                        //deletes row and returns success/error

                        db.release();
                    })
                })
            }
        };
    };
};

module.exports = Entity;