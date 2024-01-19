const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 5000; // Choose an available port

app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Create an API endpoint to retrieve data

app.get("/api/TotalValue", (req, res) => {
  const query = `SELECT SUM(inventorValue)as total FROM inventories`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results[0].total);
    }
  });
});

app.get("/api/TotalMaterial", (req, res) => {
  const query =
    "SELECT COUNT(DISTINCT namaMaterial) AS jumlah FROM inventories;";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results[0].jumlah);
    }
  });
});

app.get("/api/TopPerSumberDaya", (req, res) => {
  const query = `SELECT namaMaterial, uom, SUM(inventorValue) as value, SUM(inventory) as quantity FROM inventories GROUP BY namaMaterial ORDER BY value DESC LIMIT 10;`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/TopPerSumberDaya/:kodeMaterialGrup", (req, res) => {
  const { kodeMaterialGrup } = req.params;

  const query = `
    SELECT namaMaterial, uom, SUM(inventorValue) as value, SUM(inventory) as quantity
    FROM inventories
    WHERE kodeMaterialGrup = ?
    GROUP BY namaMaterial
    ORDER BY value DESC
    LIMIT 10;
  `;

  db.query(query, [kodeMaterialGrup], (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/materialGroup", (req, res) => {
  const query = `SELECT kodeMaterialGrup FROM inventories;`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/TopPerProyek", (req, res) => {
  const query = `SELECT namaProjek, SUM(inventorValue) AS total_value, CONCAT( '[', GROUP_CONCAT( CONCAT('{"material": "', REPLACE(namaMaterial, '"', "'"), '", "value": ', inventorValue, '}') ORDER BY namaMaterial ASC ), ']' ) AS pd FROM ( SELECT namaProjek, namaMaterial, SUM(inventorValue) AS inventorValue FROM inventories GROUP BY namaProjek, namaMaterial) subquery GROUP BY namaProjek ORDER BY total_value DESC LIMIT 10;`; // Replace with your actual table name

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/allAB", (req, res) => {
  // const query = `SELECT tanggalGr, tanggalGi, inventorValue FROM inventories WHERE koedDivisi = "AB000" AND (YEAR(tanggalGr)=YEAR(NOW()) OR YEAR(tanggalGi) = YEAR(NOW()));`;
  const query = `SELECT tanggalGr, tanggalGi, inventorValue FROM inventories WHERE koedDivisi = "AB000" AND (YEAR(tanggalGr)="2023" OR YEAR(tanggalGi) = "2023");`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/allAC", (req, res) => {
  // const query = `SELECT tanggalGr, tanggalGi, inventorValue FROM inventories WHERE koedDivisi = "AC000" AND (YEAR(tanggalGr)=YEAR(NOW()) OR YEAR(tanggalGi) = YEAR(NOW()));`;
  const query = `SELECT tanggalGr, tanggalGi, inventorValue FROM inventories WHERE koedDivisi = "AC000" AND (YEAR(tanggalGr)="2023" OR YEAR(tanggalGi) = "2023");`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/allAD", (req, res) => {
  // const query = `SELECT tanggalGr, tanggalGi, inventorValue FROM inventories WHERE koedDivisi = "AD000" AND (YEAR(tanggalGr)=YEAR(NOW()) OR YEAR(tanggalGi) = YEAR(NOW()));`;
  const query = `SELECT tanggalGr, tanggalGi, inventorValue FROM inventories WHERE koedDivisi = "AD000" AND (YEAR(tanggalGr)="2023" OR YEAR(tanggalGi) = "2023");`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/allAE", (req, res) => {
  // const query = `SELECT tanggalGr, tanggalGi, inventorValue FROM inventories WHERE koedDivisi = "AE000" AND (YEAR(tanggalGr)=YEAR(NOW()) OR YEAR(tanggalGi) = YEAR(NOW()));`;
  const query = `SELECT tanggalGr, tanggalGi, inventorValue FROM inventories WHERE koedDivisi = "AE000" AND (YEAR(tanggalGr)="2023" OR YEAR(tanggalGi) = "2023");`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/data", (req, res) => {
  const query = `SELECT * FROM inventories;`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
