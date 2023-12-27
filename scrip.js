const fecha = document.querySelector('#fecha')
const lista = document.querySelector('#lista')
const elemento = document.querySelector('#elemento')
const input = document.querySelector('#input')
const botonEnter = document.querySelector('#boton-enter')
const check = 'fa-check-circle'
const uncheck = 'fa-circle'
const lineThrough = 'line-through'
let LIST

// Creación de fecha actualizada
const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' });

// Función para agregar tarea
function agregarTarea(tarea, id, realizado, eliminado) {
    if (eliminado) {
        return;
    }

    const REALIZADO = realizado ? check : uncheck;
    const LINE = realizado ? lineThrough : '';

    const elemento = `
        <li id="elemento-${id}">
            <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
            <p class="text ${LINE}">${tarea}</p>
            <i class="fas fa-edit editar" data="editar" id="${id}"></i>
            <i class="fas fa-trash de" data="eliminado" id="${id}"></i>
        </li>
    `;
    lista.insertAdjacentHTML("beforeend", elemento);
}

// Función para tarea realizada
function tareaRealizada(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough);
    LIST[element.id].realizado = !LIST[element.id].realizado;
}

// Función para tarea eliminada
function tareaEliminada(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].eliminado = true;
}

// Función para editar tarea
function editarTarea(element) {
    const nuevoTexto = prompt("Ingrese el nuevo texto de la tarea:");

    if (nuevoTexto !== null) {
        const tareaId = element.id;
        const tareaElemento = document.getElementById(`elemento-${tareaId}`);
        tareaElemento.querySelector('.text').innerText = nuevoTexto;
        LIST[tareaId].nombre = nuevoTexto;
        localStorage.setItem('TODO', JSON.stringify(LIST));
    }
}

// Evento click para botones de lista
lista.addEventListener('click', function (event) {
    const element = event.target;
    const elementData = element.attributes.data.value;

    if (elementData === 'realizado') {
        tareaRealizada(element);
    } else if (elementData === 'eliminado') {
        tareaEliminada(element);
    } else if (elementData === 'editar') {
        editarTarea(element);
    }

    localStorage.setItem('TODO', JSON.stringify(LIST));
});

// Evento clic para botón de agregar tarea
botonEnter.addEventListener('click', () => {
    const tarea = input.value;
    if (tarea) {
        agregarTarea(tarea, id, false, false);
        LIST.push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false
        });
        localStorage.setItem('TODO', JSON.stringify(LIST));
        id++;
        input.value = '';
    }
});

// Evento de tecla Enter para agregar tarea
document.addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
        const tarea = input.value;
        if (tarea) {
            agregarTarea(tarea, id, false, false);
            LIST.push({
                nombre: tarea,
                id: id,
                realizado: false,
                eliminado: false
            });
            localStorage.setItem('TODO', JSON.stringify(LIST));
            input.value = '';
            id++;
        }
    }
});

// Cargar tareas almacenadas en localStorage
let data = localStorage.getItem('TODO');
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    cargarLista(LIST);
} else {
    LIST = [];
    id = 0;
}

// Función para cargar lista desde el arreglo
function cargarLista(array) {
    array.forEach(function (item) {
        agregarTarea(item.nombre, item.id, item.realizado, item.eliminado);
    });
}