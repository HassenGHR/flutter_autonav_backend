const pool = require('../db');
const wilayasController = {
  insertWilayas: async (req, res) => {
     data = req.body;
    try {
    
        for (const item of data) {
          const query = {
            text: 'INSERT INTO wilayas (code_postal, nom, wilaya_id) VALUES ($1, $2, $3)',
            values: [item.code_postal, item.nom, item.wilaya_id],
          };
    
          await pool.query(query);
        }
    
        console.log('Data inserted successfully!');
      } catch (error) {
        console.error('Error inserting data:', error);
      } 
  },
getAllWilayas: async (req, res) => {
    try {
      const query = 'SELECT * FROM wilayas';
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching all wilayas:', error);
      res.status(500).send('Internal Server Error');
    }
  },
   getWilayasByWilayaId: async (req, res) => {
    const wilaya_id  = req.params.wilayaId;
  
    try {
      const query = 'SELECT nom FROM wilayas WHERE wilaya_id = $1';
      const { rows } = await pool.query(query, [wilaya_id]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching wilayas by wilaya_id:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  

}
module.exports = wilayasController;
