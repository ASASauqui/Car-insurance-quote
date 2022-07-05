// ----------------Variables----------------
let isQuoting = false;

// ----------------Constructores----------------
// ----Seguro----
function Insurance(brand, year, type){
    this.brand = brand;
    this.year = year;
    this.type = type;
}

// Realizar contización con los datos.
Insurance.prototype.quoteInsurance = function(){
    /*
        1 = Americano 1.15
        2 = Asiático 1.05
        3 = Europeo 1.35

        Seguro básico = 30% más.
        Seguro completo = 50% más.
    */

    // Variables base.
    let amount = 0;
    const base = 2000;

    // Calcular respecto a la marca del automóvil.
    switch(this.brand){
        case "1":
            amount = base * 1.15;
            break;
        case "2":
            amount = base * 1.05;
            break;
        case "3":
            amount = base * 1.35;
            break;
        default:
            break;
    }

    // Calcular respecto al año del automóvil. 
    // Obtener la diferencia de años.
    const difference = new Date().getFullYear()-this.year;

    // Cada año que la diferencia es mayor, el costo se reducirá un 3%.
    amount -= ((difference * 3)*amount) / 100;

    // Calcular respecto al tipo de seguro del automóvil.
    switch(this.type){
        case "basico":
            amount *= 1.3;
            break;
        case "completo":
            amount *= 1.5;
            break;
        default:
            break;
    }
    
    return amount;
}

// ----User Interface----
function UI(){}

// Llenar las opciones de los años.
UI.prototype.fillYearOptions = () => {
    // Variables de años.
    const maxYear = new Date().getFullYear();
    const minYear = maxYear-20;

    // Selecionar el seleccionador de años.
    const selectYear = document.querySelector("#year");

    // Rellenarlo con años.
    for(let i=maxYear;i>=minYear;i--){
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// Mostrar alertas en pantalla.
UI.prototype.showMessage = (message, type) => {
    // Crear div.
    const div = document.createElement("div");

    // Del tipo mensaje.
    div.classList.add("mensaje", "mt-10");

    // Si es un error.
    if(type === "error"){
        div.classList.add("error");
    }
    // Si es correcto.
    else{
        div.classList.add("correcto");
    }

    div.textContent = message;

    // Buscar formulario.
    const form = document.querySelector("#cotizar-seguro");

    // Verificar si no está repetido el elemento en el formulario.
    let isRepeated = false;
    Object.entries(form.children).forEach((element) => {
        if( element[1].classList.contains("mensaje") ){
            isRepeated = true;
        }
    });

    // Sí está repetido.
    if(isRepeated){
        return;
    }

    // Insertar en HTML.
    form.insertBefore(div, document.querySelector("#resultado"));

    // Timer de vida.
    setTimeout( () => {
        div.remove();
    }, 3000);
}

UI.prototype.showResult = (insurance, total) => {
    // Obtener atributos.
    const {brand, year, type} = insurance;

    // Variables a utilizar.
    let brandText;

    // Cambiar número de marca a un nombre concreto.
    switch(brand){
        case "1":
            brandText = "Americano";
            break;
        case "2":
            brandText = "Asiático";
            break;
        case "3":
            brandText = "Europeo";
            break;
        default:
            break;
    }

    // Crear el resultado.
    const div = document.createElement("div");
    div.classList.add("mt-10");
    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${brandText}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${type}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
    `;

    // Buscar elemento de resultado en el HTML.
    const divResult = document.querySelector("#resultado");
    

    // Mostrar spinner.
    const spinner = document.querySelector("#cargando");
    spinner.style.display="block";

    // Timer de vida del spinner.
    setTimeout( () => {
        // Ocultar spinner.
        spinner.style.display="none";

        // Agregar cotización al HTML.
        divResult.appendChild(div);

        // No se está cotizando.
        isQuoting = false;
    }, 3000);
}

// Instanciar UI.
const ui = new UI();



// ----------------Eventos----------------
// Después de cargar el contenido de la página.
document.addEventListener("DOMContentLoaded", () => {
    // Llenar el select con los años.
    ui.fillYearOptions();
});

eventListeners();
function eventListeners(){
    // Buscar formulario.
    const form = document.querySelector("#cotizar-seguro");

    // Enviar formulario para cotizar seguro.
    form.addEventListener("submit", quoteInsurance);
}



// ----------------Funciones----------------
function quoteInsurance(e){
    // Prevenir acciones predefinidas.
    e.preventDefault();

    // Ver si no se está cotizando.
    if(isQuoting){
        return;
    }

    // Leer la marca seleccionada.
    const brandSelect = document.querySelector("#marca").value;

    // Leer el año seleccionado.
    const yearSelect = document.querySelector("#year").value;

    // Leer el tipo de cobertura.
    const typeSelect = document.querySelector("input[name='tipo']:checked").value;

    // Si tiene valores vacíos.
    if(brandSelect === "" || yearSelect === "" || typeSelect === ""){
        // Mostrar error.
        ui.showMessage("Todos los campos son obligatorios", "error");
        return;
    }

    // Mostrar mensaje de cotización.
    ui.showMessage("Cotizando...", "correct");

    // Obtener posibles cotizaciones existentes.
    const results = document.querySelector("#resultado div");

    // Si sí hay, eliminarlas.
    if(results != null){
        results.remove();
    }

    // Instanciar el seguro.
    const insurance = new Insurance(brandSelect, yearSelect, typeSelect);

    // Obtener el total de cotización del seguro.
    const total = insurance.quoteInsurance();

    // Cotizando.
    isQuoting = true;

    // Mostrar resultado.
    ui.showResult(insurance, total);
}