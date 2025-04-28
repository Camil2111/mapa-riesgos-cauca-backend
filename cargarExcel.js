import mongoose from 'mongoose';
import XLSX from 'xlsx';
import dotenv from 'dotenv';
dotenv.config();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error al conectar:", err));

// Esquema de datos
const MunicipioSchema = new mongoose.Schema({
    municipio: String,
    riesgo: String,
    estructuras: String,
    fuerza_publica: String,
    contexto: String,
    seguimiento: String
});

const Municipio = mongoose.model('Municipio', MunicipioSchema);

// Leer el Excel
const workbook = XLSX.readFile('./archivos/Analisis_Riesgos_Cauca.xlsx');
const sheet = workbook.Sheets["Municipios Cauca"];
const data = XLSX.utils.sheet_to_json(sheet);

// Cargar a MongoDB
(async () => {
    try {
        await Municipio.deleteMany({});
        await Municipio.insertMany(data);
        console.log("📊 Datos cargados correctamente.");
    } catch (err) {
        console.error("❌ Error cargando datos:", err);
    } finally {
        mongoose.disconnect();
    }
})();
