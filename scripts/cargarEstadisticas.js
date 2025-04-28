// scripts/cargarEstadisticas.js
import mongoose from 'mongoose';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import Estadistica from '../models/Estadistica.js';

// Para tener __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo Excel
const excelPath = path.join(__dirname, '../data/Terrorismo_2.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Validar y mapear los datos
const registros = data
    .map(row => {
        const fecha = new Date(row['Fecha']);
        if (isNaN(fecha.getTime())) return null; // fecha inválida

        return {
            municipio: (row['Municipio'] || 'Desconocido').toString().trim(),
            departamento: (row['Departamento'] || 'Desconocido').toString().trim(),
            delito: (row['Delito'] || 'Otro').toString().trim(),
            fecha,
            casos: 1,
        };
    })
    .filter(r => r !== null); // eliminar filas con fechas inválidas

// Conexión y carga en MongoDB
mongoose.connect('mongodb://localhost:27017/riesgos')
    .then(() => Estadistica.insertMany(registros))
    .then(() => {
        console.log(`📊 ${registros.length} registros cargados con éxito a MongoDB`);
        process.exit();
    })
    .catch(err => {
        console.error('💥 Error cargando datos:', err);
        process.exit(1);
    });

console.log('📄 Registros extraídos del Excel:');
console.log(registros.slice(0, 5)); // Muestra los primeros 5 registros
