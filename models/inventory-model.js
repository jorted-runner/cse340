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

async function addNewInv(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = 'INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    } catch (error) {
        console.error('addNewInv error: ' + error)
    } 
}

async function updateInv(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  ) {
    try {
      const sql =
        "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
        inv_id
      ])
      return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }
  }

async function deleteInventory(inv_id) {
    try {
        const sql = 'DELETE FROM inventory WHERE inv_id = $1'
        const data = await pool.query(sql, [inv_id])
    return data
    } catch (error) {
        new Error("Delete Inventory Error")
    }
}

async function checkAvailable(inv_id) {
    if (getInventoryByInventoryId(inv_id)) {
        return true
    } else {
        return false
    }
    
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addNewClass, addNewInv, updateInv, deleteInventory, checkAvailable};