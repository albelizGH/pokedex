const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const CONTENEDOR_CARDS = document.getElementById("card__container");
const CONTENEDOR_CARDS__INICIALES = document.getElementById("cards__inicial");

async function dibujarPokemons(pokemonInicio, PokemonFin) {
		for (let i = pokemonInicio; i <= PokemonFin; i++) {
			let response = await fetch(URL_BASE + i);
			let pokemonObject = await response.json();
			//Dibujo las cartas
			dibujarCartasIniciales(pokemonObject);
		}
        detallesPokemon();
}

function detallesPokemon() {
    let cards = document.querySelectorAll(".card__inicial");
    cards.forEach((card) => {
        card.addEventListener("click", async function () {
            let pantallaNegra=document.getElementById('card__container');
            pantallaNegra.style.display='block';
            let id = this.id.split("__")[2]; // Extraer el ID del elemento
            let response = await fetch(URL_BASE + id);
            let data = await response.json();
            dibujarCartasDetalles(data);
        });
    });
}

function dibujarCartasIniciales(pokemonObject) {
	let nombrePokemon = primeraLetraMayuscula(pokemonObject.name);
	let id = pokemonObject.id;
    imagen=pokemonObject.sprites.other['official-artwork'].front_default;
	const CARD_DIV = document.createElement("div");
	CARD_DIV.classList.add("card__inicial");
    CARD_DIV.id=`card__inicial__${pokemonObject.id}`
	CARD_DIV.innerHTML = `
    <div class="card__inicial__container">
        <div class="card__inicial__imagen__container">
            <img src=${imagen}
                alt="imagen_${pokemonObject.name}"
                class="card__inicial__imagen">
        </div>
    </div>
    <hr
    <div class="card__inicial__estadisticas">
        <div class="card__inicial__nombre">${nombrePokemon} #${id}</div>
        <div id="tipos_${id}" class="card__inicial__tipos"></div>
    </div>`;
	CONTENEDOR_CARDS__INICIALES.appendChild(CARD_DIV);
    //Para traer al español
	let urlTypes = pokemonObject.types.map((typeObject) => typeObject.type.url);
	urlTypes.forEach((url) => {
		fetch(url)
			.then((response) => response.json())
			.then((dataTypesObject) => {
				const divTipos = document.getElementById(`tipos_${id}`);
				let tipoName = dataTypesObject.names[5].name;
				let divTipo = document.createElement("div");
				divTipo.classList.add("card__inicial__tipo");
				asignarClaseSegunTipo(divTipo, tipoName.toLowerCase());
				divTipo.innerHTML = tipoName;
				divTipos.appendChild(divTipo);
			});
	});
}

function dibujarCartasDetalles(pokemonObject) {
	//Obtengo los datos que me interesan
	let nombrePokemon = primeraLetraMayuscula(pokemonObject.name);
	let id = pokemonObject.id;
	let imagen = pokemonObject.sprites.other.dream_world.front_default;
	let hp = pokemonObject.stats[0].base_stat;
	let atk = pokemonObject.stats[1].base_stat;
	let def = pokemonObject.stats[2].base_stat;
	let speed = pokemonObject.stats[5].base_stat;
	let peso = pokemonObject.weight / 10;
	let altura = pokemonObject.height / 10;
	//Creo el elemento donde va a estar alojada la card y le doy las clases
	const CARD_DIV = document.createElement("div");
	CARD_DIV.classList.add("card");
    CARD_DIV.id=`card__${id}`;
	CARD_DIV.innerHTML = dibujarCardHTMLPokemon(
		pokemonObject,
		nombrePokemon,
		id,
		imagen,
		hp,
		atk,
		def,
		speed,
		peso,
		altura
	);
	CONTENEDOR_CARDS.appendChild(CARD_DIV);
	dibujarBarraTiposEspaniol(pokemonObject);
	actualizarBarrasEstadisticas(pokemonObject);
    let iconoCerrar=document.getElementById("cerrar");
    iconoCerrar.addEventListener('click',()=>{
        eliminarElementoPorId(`card__${id}`);
        document.getElementById("card__container").style.display="none";
    })
}
function dibujarBarraTiposEspaniol(pokemonObject) {
	//1-Obtener URL de tipos en array
	//2-Hacer peticion a la API para obtener toda la informacion de esos tipos que contiene el pokemon
	//3-Aplicar una funcion dibujarmosTiposEspaniol() para buscar el nombre y renderizar
	let urlTypes = pokemonObject.types.map(
		(typeObject) => typeObject.type.url
	);
    urlTypes.forEach((url) => {
		fetch(url)
			.then((response) => response.json())
			.then((dataTypesObject) => {
				const divTipos = document.getElementById(`tipos_detalles_${pokemonObject.id}`);
				let tipoName = dataTypesObject.names[5].name;
				let divTipo = document.createElement("div");
				divTipo.classList.add("tipo");
				asignarClaseSegunTipo(divTipo, tipoName.toLowerCase());
				divTipo.innerHTML = tipoName;
				divTipos.appendChild(divTipo);
			});
	});
}

function dibujarCardHTMLPokemon(
	pokemonObject,
	nombrePokemon,
	id,
	imagen,
	hp,
	atk,
	def,
	speed,
	peso,
	altura
) {
	return `<div class="card__imagen">
        <div class="card__name__id">
        <span class="nombre_pokemon">${nombrePokemon} #${id}</span>  
        <i class="fa-solid fa-xmark fa-xl" id="cerrar"></i>
        </div>
    <div class="imagen">
      <img
        src=${imagen}
        alt="dream_world"
      />
    </div>
  </div>


  <div class="card__datos">

<div class="card__detalles">
     <div class="tipos" id="tipos_detalles_${id}"></div>

<div class="estadistica-peso-altura">
     <div class="estadistica__interno">${peso} Kg</div>
     <div class="estadistica__interno">${altura} m</div>
</div>

      <div class="estadistica">
        <p class="estadistica__p">HP:</p>
        <div class="barra__externa">
          <div class="barra__interna" id="barra__interna__hp__${id}">
            <p>${hp}/255</p>
          </div>
        </div>
      </div>
      <div class="estadistica">
        <p class="estadistica__p">ATK:</p>
        <div class="barra__externa">
          <div class="barra__interna" id="barra__interna__atk__${id}">
            <p>${atk}/255</p>
          </div>
        </div>
      </div>

      <div class="estadistica">
        <p class="estadistica__p">DEF:</p>
        <div class="barra__externa">
          <div class="barra__interna" id="barra__interna__def__${id}">
            <p>${def}/255</p>
          </div>
        </div>
      </div>

      <div class="estadistica">
        <p class="estadistica__p">SPD:</p>
        <div class="barra__externa">
          <div class="barra__interna" id="barra__interna__speed__${id}">
            <p>${speed}/255</p>
          </div>
        </div>
      </div>



    </div>
  </div>
</div>`;
}

function primeraLetraMayuscula(palabra) {
	let primeraLetra = palabra.charAt(0).toUpperCase();
	let convertido = primeraLetra + palabra.slice(1, palabra.length);
	return convertido;
}

function asignarClaseSegunTipo(elemento, tipoName) {
	switch (tipoName) {
		case "acero":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "agua":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "bicho":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "dragon":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "eléctrico":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "fantasma":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "fuego":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "hada":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "hielo":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "lucha":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "normal":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "planta":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "psíquico":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "roca":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "siniestro":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "tierra":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "veneno":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "volador":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
		case "dragón":
			elemento.classList.add(`tipo-${tipoName}`);
			break;
	}
}

function valorBarraInternaEstadisticas(valor) {
	return (valor * 100) / 170;
}

function cambiarWidthBarraEstadisticas(valor, id) {
	valor = valorBarraInternaEstadisticas(valor);
	const barraInterna = document.getElementById(id);
	barraInterna.style.width = `${valor}%`;
}

function actualizarBarrasEstadisticas(pokemonObject) {
	cambiarWidthBarraEstadisticas(
		pokemonObject.stats[0].base_stat,
		`barra__interna__hp__${pokemonObject.id}`
	);
	cambiarWidthBarraEstadisticas(
		pokemonObject.stats[1].base_stat,
		`barra__interna__atk__${pokemonObject.id}`
	);
	cambiarWidthBarraEstadisticas(
		pokemonObject.stats[2].base_stat,
		`barra__interna__def__${pokemonObject.id}`
	);
	cambiarWidthBarraEstadisticas(
		pokemonObject.stats[5].base_stat,
		`barra__interna__speed__${pokemonObject.id}`
	);
}

function eliminarElementoPorId(id) {
    const elemento = document.getElementById(id);
      elemento.remove();
}
/* Depende de lo que pida el usuario le puedo mostrar los de la segunda tercera o generacion que quiera */
/* Despues con un display none puedo mostrar solo los de un tipo u otro */
/* Mostrarr unos 10 por pagina */
dibujarPokemons(1, 150);
