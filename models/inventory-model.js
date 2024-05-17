const pool = require('../database/')

async function getClassifications(){
    return await pool.query('SELECT * FROM public.classification ORDER BY classification_name')
}

// get all inventory items and classification_name by classification_id

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1`, [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error('getInventoryByClassificationId error ' + error)
    }
}

async function getInventoryByInventoryId(inventory_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`, [inventory_id]
        )
        return data.rows
    } catch (error) {
        console.error('getInventoryByInventoryID error: ' + error)
    }
}

async function addNewClass(className) {
    try {
        const sql = 'INSERT INTO classification (classification_name) VALUES($1)  RETURNING *'
        return await pool.query(sql, [className])
    } catch (error) {
        console.error('addNewClass error: ' + error)
    }
}



module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addNewClass};