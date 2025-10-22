// Mapeo de colores para cada marca
const coloresMarcas = {
    'Toyota': '#ffebee',
    'Honda': '#e8f5e9',
    'Ford': '#e3f2fd',
    'Chevrolet': '#fff8e1',
    'Nissan': '#f3e5f5',
    'BMW': '#e0f2f1',
    'Audi': '#fce4ec',
    'Mercedes-Benz': '#fff3e0',
    'Hyundai': '#e8eaf6',
    'Kia': '#e0f7fa'
};

// Referencias a los elementos del DOM
const selectMarcas = document.getElementById('marcas');
const selectModelos = document.getElementById('modelos');

// Cargar marcas al abrir la página
document.addEventListener('DOMContentLoaded', cargarMarcas);

// Función para cargar las marcas desde el servidor
async function cargarMarcas() {
    try {
        selectMarcas.innerHTML = '<option value="" class="loading">Cargando marcas...</option>';
        
        const response = await fetch('http://localhost:8888/marcas');
        
        if (!response.ok) {
            throw new Error('Error al cargar las marcas');
        }
        
        const data = await response.text();
        const marcas = data.split('\n').filter(marca => marca.trim() !== '');
        
        selectMarcas.innerHTML = '<option value="">-- Selecciona una marca --</option>';
        
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            selectMarcas.appendChild(option);
        });
        
        // Añadir evento para cargar modelos cuando se seleccione una marca
        selectMarcas.addEventListener('change', cargarModelos);
        
    } catch (error) {
        console.error('Error:', error);
        selectMarcas.innerHTML = '<option value="">Error al cargar las marcas</option>';
    }
}

// Función para cargar los modelos según la marca seleccionada
async function cargarModelos() {
    const marcaSeleccionada = selectMarcas.value;
    
    if (!marcaSeleccionada) {
        selectModelos.innerHTML = '<option value="">-- Primero selecciona una marca --</option>';
        selectModelos.disabled = true;
        // Quitar clases de color cuando no hay marca seleccionada
        selectModelos.className = '';
        return;
    }
    
    try {
        selectModelos.innerHTML = '<option value="" class="loading">Cargando modelos...</option>';
        selectModelos.disabled = false;
        
        const response = await fetch(`http://localhost:8888/modelos/${marcaSeleccionada}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar los modelos');
        }
        
        const data = await response.text();
        const modelos = data.split('\n').filter(modelo => modelo.trim() !== '');
        
        selectModelos.innerHTML = '<option value="">-- Selecciona un modelo --</option>';
        
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            // Extraer solo el nombre del modelo (eliminando la marca)
            const nombreModelo = modelo.split(' - ')[1] || modelo;
            option.value = modelo;
            option.textContent = nombreModelo;
            selectModelos.appendChild(option);
        });
        
        // Cambiar el color según la marca seleccionada
        // Para Mercedes-Benz, reemplazamos el guion para que sea un nombre de clase válido
        const claseMarca = marcaSeleccionada.replace('-', '');
        selectModelos.className = claseMarca;
        
    } catch (error) {
        console.error('Error:', error);
        selectModelos.innerHTML = '<option value="">Error al cargar los modelos</option>';
    }
}