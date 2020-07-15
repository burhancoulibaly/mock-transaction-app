const pool = require("./db");

let tableInstances = {class: this};

class Entity {
    constructor(table) {
        if(tableInstances[table]){
            return tableInstances[table];
        }

        this._entity = table;
        tableInstances[table] = this;
        
        return tableInstances[table];
    }

    setEntity(table){
        if(tableInstances[table]){
            delete tableInstances[table];
            this._entity = table;
            return tableInstances[table];
        }

        delete tableInstances[table];
        this._entity = table;
        tableInstances[table] = this._entity;
    };

    insertRow(args){
        //using arrow functions to keep this._entity in scope;
        return new Promise((resolve,reject) => {
            pool.getConnection(async(err, db) => {
                if(err) reject(err);
                
                //insert row using args object for fields;
                //INSERT INTO table_name VALUES (value1, value2, value3, ...);

                let sql = `INSERT INTO ${this._entity} VALUES (DEFAULT, `;

                if(this._entity == "users" || this._entity == "login"){
                    sql = `INSERT INTO ${this._entity} VALUES (`;   
                }
                
                args.map((val, i) => {
                    sql += val.toString();

                    if(i < args.length-1){
                        sql += ", ";
                    }
                });

                sql += ");";

                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }

                db.release();
            })
        })
    };

    getRow(primaryKey, value){
        return new Promise((resolve,reject) => {
            pool.getConnection(async(err, db) => {
                if(err) reject(err);  

                //return row from table
                //SELECT * FROM table_name WHERE condition...;
                let sql = `SELECT * FROM ${this._entity} WHERE ${primaryKey} = ${value}`;

                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }

                db.release();
            })
        })
    };

    getRows(field, value){
        return new Promise((resolve,reject) => {
            pool.getConnection(async(err, db) => {
                if(err) reject(err); 

                //returns rows in entity where search value is equal to field value in entity
                
                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }

                db.release();
            })
        })
    };

    getColumns(field){
        return new Promise((resolve,reject) => {
            pool.getConnection(async(err, db) => {
                if(err) reject(err); 

                //returns all values for a specific column in an entity
                
                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }
                
                db.release();
            })
        })
    };

    getAll(){
        return new Promise((resolve,reject) => {
            pool.getConnection(async(err, db) => {
                if(err) reject(err); 

                //returns all rows and columns
                let sql = `SELECT * FROM ${this._entity}`;
                
                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }

                db.release();
            })
        })
    };

    editRow(searchKey, searchValue, editField, editValue){
        return new Promise((resolve,reject) => {
            pool.getConnection(async(err, db) => {
                if(err) reject(err); 

                //edits a field in the row, returns array [success/error, results(error/row that was changed)]
                let sql = `UPDATE ${this._entity} SET ${editField} = ${editValue} WHERE ${searchKey} = ${searchValue}`;

                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }
                
                db.release();
            })
        })
    };

    getFKRightJoin(t2, t1ReturnVals, t2ReturnVals, field, searchKey){
        return new Promise((resolve,reject) => {
            let t1 = this._entity;

            pool.getConnection(async(err, db) => {
                if(err) reject(err); 

                let sql = `SELECT `;

                if(t1ReturnVals && t2ReturnVals){
                    t1ReturnVals.map((val, i) => {
                        sql += `${t1}.${val.toString()}`;
    
                        if(i < t1ReturnVals.length-1){
                            sql += ", ";
                        }
                    });

                    sql += ", ";

                    t2ReturnVals.map((val, i) => {
                        sql += `${t2}.${val.toString()}`;
    
                        if(i < t2ReturnVals.length-1){
                            sql += ", ";
                        }
                    });

                    sql += ` FROM `;

                }else if(t1ReturnVals && !t2ReturnVals){
                    t1ReturnVals.map((val, i) => {
                        sql += `${t1}.${val.toString()}`;
    
                        if(i < t1ReturnVals.length-1){
                            sql += ", ";
                        }
                    });

                    sql += ` FROM `;

                }else if(!t1ReturnVals && t2ReturnVals){
                    t2ReturnVals.map((val, i) => {
                        sql += `${t2}.${val.toString()}`;
    
                        if(i < t2ReturnVals.length-1){
                            sql += ", ";
                        }
                    });

                    sql += ` FROM `;

                }else{
                    sql += `SELECT * FROM `;
                }

                sql += `${t1} RIGHT JOIN ${t2} ON ${t1}.${field} = ${t2}.${field} WHERE ${t1}.${field} = ${searchKey}`;
                
                // console.log(sql);

                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }
                
                db.release();
            })
        })
    };

    deleteValue(searchKey, searchValue, editField, editValue){
        return new Promise((resolve,reject) => {
            pool.getConnection(async(err, db) => {
                if(err) reject(err); 

                //deletes a field in the row, returns array [success/error, results(error/row that was changed)]
                

                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }

                db.release();
            })
        })
    };

    deleteRow(searchValue){
        return new Promise((resolve,reject) => {
            pool.getConnection(async(err, db) => {
                if(err) reject(err); 

                //gets rows that match given args if more than one row returns error to be more specific else,
                //deletes row and returns success/error


                try {
                    let response = await this.queryFn(db, sql);
                    
                    if(!response){
                        reject("Empty Response");
                    }

                    resolve(response);
                } catch (error) {
                    reject(error);
                }

                db.release();
            })
        })
    };

    queryFn(db, sqlQuery){
        return new Promise((resolve,reject) =>{
            db.query(sqlQuery, function(err, result){
                if(err) reject(err);

                resolve(result);
                return;
            });
        })
    }
};

module.exports = Entity;