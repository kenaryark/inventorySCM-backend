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
  // const query = 'SELECT SUM(value) as total FROM data'; // Replace with your actual table name
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
  // const query = 'SELECT COUNT(DISTINCT uom) AS jumlah FROM data;'; // Replace with your actual table name
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
  // const query = 'SELECT material, uom,  SUM(value) as value, SUM(quantity) as quantity FROM data GROUP BY material ORDER BY value DESC LIMIT 10'; // Replace with your actual table name
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

app.get("/api/TopPerProyek", (req, res) => {
  // const query = `SELECT proyek, SUM(total_value) AS total_value, CONCAT('[', GROUP_CONCAT(json_obj SEPARATOR ','), ']') AS pd FROM ( SELECT proyek, CONCAT('{"material": "', material, '", "uom": "', uom, '", "quantity": ', SUM(quantity), ', "value": ', SUM(value), '}') AS json_obj, SUM(value) AS total_value FROM data GROUP BY proyek, material ) subquery GROUP BY proyek ORDER BY total_value DESC LIMIT 10;`; // Replace with your actual table name
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

app.get("/api/Test", (req, res) => {
  const query = `SELECT namaProjek, SUM(inventorValue) AS total_value, CONCAT( '[', GROUP_CONCAT( CONCAT('{"material": "', REPLACE(namaMaterial, '"', "'"), '", "value": ', inventorValue, '}') ORDER BY namaMaterial ASC ), ']' ) AS pd FROM ( SELECT namaProjek, namaMaterial, SUM(inventorValue) AS inventorValue FROM inventories WHERE NOT inventorValue = 0 GROUP BY namaProjek, namaMaterial) subquery GROUP BY namaProjek ORDER BY total_value DESC LIMIT 10;`; // Replace with your actual table name

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/pes", (req, res) => {
  // const query = `SELECT proyek, SUM(total_value) AS total_value, CONCAT('[', GROUP_CONCAT(json_obj SEPARATOR ','), ']') AS pd FROM ( SELECT proyek, CONCAT('{"material": "', material, '", "uom": "', uom, '", "quantity": ', SUM(quantity), ', "value": ', SUM(value), '}') AS json_obj, SUM(value) AS total_value FROM data GROUP BY proyek, material ) subquery GROUP BY proyek ORDER BY total_value DESC LIMIT 10;`; // Replace with your actual table name
  const query = `SELECT namaProjek, SUM(inventorValue) AS total_value, CONCAT( '[', GROUP_CONCAT( CONCAT('{"material": "', REPLACE(namaMaterial, '"', "'"), '", "value": ', inventorValue, '}') ORDER BY namaMaterial ASC ), ']' ) AS pd FROM ( SELECT namaProjek, namaMaterial, SUM(inventorValue) AS inventorValue FROM inventories GROUP BY namaProjek, namaMaterial ) subquery GROUP BY namaProjek ORDER BY total_value DESC LIMIT 10;`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/akun", (req, res) => {
  const query = `SELECT * FROM account;`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/chart", (req, res) => {
  const query = `SELECT koedDivisi AS name,ROUND(total_inventorValue) AS data FROM ( SELECT koedDivisi, SUM(inventorValue) AS total_inventorValue FROM inventories GROUP BY koedDivisi ) AS subquery GROUP BY koedDivisi;`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/teschart", (req, res) => {
  // const query = `SELECT ROUND(total_inventorValue) AS data FROM ( SELECT koedDivisi, SUM(inventorValue) AS total_inventorValue FROM inventories GROUP BY koedDivisi ) AS subquery GROUP BY koedDivisi;`;
  const query = `SELECT ROUND(total_inventorValue) AS data FROM ( SELECT koedDivisi, SUM(inventorValue) AS total_inventorValue FROM inventories GROUP BY koedDivisi ) AS subquery WHERE koedDivisi LIKE 'AB000';`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/tanggal", (req, res) => {
  const query = `SELECT namaDivisi, koedDivisi, TanggalGR,TanggalGI, SUM(inventorValue) AS total_inventorValue FROM ( SELECT namaDivisi,koedDivisi, CONCAT(DATE_FORMAT(DATE(tanggalGr), '%Y'), '-', DATE_FORMAT(DATE(tanggalGr), '%m')) AS TanggalGR, CONCAT(DATE_FORMAT(DATE(tanggalGi), '%Y'), '-', DATE_FORMAT(DATE(tanggalGi), '%m')) AS TanggalGI, FLOOR(inventorValue) AS inventorValue FROM inventories ) AS subquery GROUP BY namaDivisi,TanggalGr;`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/ab", (req, res) => {
  const query = `SELECT MONTHNAME(tanggal) AS label, SUM(inventorValue) AS y FROM ( SELECT id, tanggalGr AS tanggal, inventorValue FROM inventories WHERE YEAR(tanggalGr) = YEAR(NOW()) AND koedDivisi LIKE 'AB000' GROUP BY id UNION ALL SELECT id, tanggalGi AS tanggal, inventorValue FROM inventories WHERE YEAR(tanggalGi) = YEAR(NOW()) AND NOT MONTH(tanggalGr) = MONTH(tanggalGi) AND koedDivisi LIKE 'AB000' GROUP BY id) AS subquery GROUP BY label ORDER BY FIELD(label, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
  // const query = `SELECT MONTHNAME(tanggalGR) AS label, SUM(inventorValue) AS y FROM inventories WHERE koedDivisi LIKE 'AB000' AND YEAR(tanggalGR) = '2022' GROUP BY label ORDER BY FIELD(label, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/ac", (req, res) => {
  const query = `SELECT MONTHNAME(tanggal) AS label, SUM(inventorValue) AS y FROM ( SELECT id, tanggalGr AS tanggal, inventorValue FROM inventories WHERE YEAR(tanggalGr) = YEAR(NOW()) AND koedDivisi LIKE 'AC000' GROUP BY id UNION ALL SELECT id, tanggalGi AS tanggal, inventorValue FROM inventories WHERE YEAR(tanggalGi) = YEAR(NOW()) AND NOT MONTH(tanggalGr) = MONTH(tanggalGi) AND koedDivisi LIKE 'AC000' GROUP BY id) AS subquery GROUP BY label ORDER BY FIELD(label, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
  // const query = `SELECT MONTHNAME(tanggalGR) AS label, SUM(inventorValue) AS y FROM inventories WHERE koedDivisi LIKE 'AC000' AND YEAR(tanggalGR) = '2022' GROUP BY label ORDER BY FIELD(label, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/ad", (req, res) => {
  const query = `SELECT MONTHNAME(tanggal) AS label, SUM(inventorValue) AS y FROM ( SELECT id, tanggalGr AS tanggal, inventorValue FROM inventories WHERE YEAR(tanggalGr) = YEAR(NOW()) AND koedDivisi LIKE 'AD000' GROUP BY id UNION ALL SELECT id, tanggalGi AS tanggal, inventorValue FROM inventories WHERE YEAR(tanggalGi) = YEAR(NOW()) AND NOT MONTH(tanggalGr) = MONTH(tanggalGi) AND koedDivisi LIKE 'AD000' GROUP BY id) AS subquery GROUP BY label ORDER BY FIELD(label, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
  // const query = `SELECT MONTHNAME(tanggalGR) AS label, SUM(inventorValue) AS y FROM inventories WHERE koedDivisi LIKE 'AD000' AND YEAR(tanggalGR) = '2022' GROUP BY label ORDER BY FIELD(label, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/ae", (req, res) => {
  const query = `SELECT MONTHNAME(tanggal) AS label, SUM(inventorValue) AS y FROM ( SELECT id, tanggalGr AS tanggal, inventorValue FROM inventories WHERE YEAR(tanggalGr) = YEAR(NOW()) AND koedDivisi LIKE 'AE000' GROUP BY id UNION ALL SELECT id, tanggalGi AS tanggal, inventorValue FROM inventories WHERE YEAR(tanggalGi) = YEAR(NOW()) AND NOT MONTH(tanggalGr) = MONTH(tanggalGi) AND koedDivisi LIKE 'AE000' GROUP BY id) AS subquery GROUP BY label ORDER BY FIELD(label, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
  // const query = `SELECT MONTHNAME(tanggalGR) AS label, SUM(inventorValue) AS y FROM inventories WHERE koedDivisi LIKE 'AE000' AND YEAR(tanggalGR) = '2022' GROUP BY label ORDER BY FIELD(label, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
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
// app.get('/api/DataComplex', (req, res) => {
//   const query = 'SELECT * FROM datacomplex'; // Replace with your actual table name

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error querying database:', error);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get('/api/Data', (req, res) => {
//     const query = 'SELECT * FROM data'; // Replace with your actual table name

//     db.query(query, (error, results) => {
//       if (error) {
//         console.error('Error querying database:', error);
//         res.status(500).json({ error: 'Database error' });
//       } else {
//         res.json(results);
//       }
//     });
// });

// app.get('/api/TopInventory', (req, res) => {
//   const query = 'SELECT proyek, SUM(value) as total FROM data GROUP BY proyek'; // Replace with your actual table name

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error querying database:', error);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get('/api/PerProyek', (req, res) => {
//   const query = 'SELECT proyek, GROUP_CONCAT(material) AS material ,SUM(value) as total FROM data GROUP BY proyek'; // Replace with your actual table name

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error querying database:', error);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get('/api/TopPerProyek', (req, res) => {
//   const query = 'SELECT proyek, material, value  FROM (SELECT proyek, GROUP_CONCAT(material) AS material, SUM(value) as value FROM data GROUP BY proyek ORDER BY value DESC LIMIT 10 ) AS subquery;'; // Replace with your actual table name

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error querying database:', error);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.json(results);
//     }
//   });
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
