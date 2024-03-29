import { ZoomInOut } from './Zoom/ZoomInOut.js';

let logMessages = false;

function ConfigsLeaflet(configs) {
    return {
        zoomControl: configs.configuracoesLeaflet.zoomControl,
        zoomSnap: configs.configuracoesLeaflet.zoomSnap,
        zoomDelta: configs.configuracoesLeaflet.zoomDelta,
        minZoom: configs.zoom.min,
        maxZoom: configs.zoom.max,
    };
}

function AdicionaCoordenadasMouse(map, configuracoesLeaflet) {
    let crs = configuracoesLeaflet.crs;
    let sistema = configuracoesLeaflet.sistema;
    let proj4text = configuracoesLeaflet.proj4text;
    let projCRS = new L.Proj.CRS(crs, proj4text);
    let mousePosControl = L.control.mousePosition({
        position: "bottomleft", //mudando posição do mouse
        emptyString: "Coordenadas indisponíveis",
        formatter: function (lng, lat) {
            let pt = projCRS.project(L.latLng(lat, lng));
            if (sistema == 'utm') {
                return "" + pt.y.toFixed(0) + " N : " + pt.x.toFixed(0) + " E";
            }
            return "Lat.:" + pt.y.toFixed(5) + " | Lon.:" + pt.x.toFixed(5) + "";
        }

    });
    
    map.addControl(mousePosControl);
    let container = mousePosControl.getContainer();
    
    container.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // Fundo branco com opacidade 0.5
    container.style.fontSize = "16px"; // Fonte maior
    container.style.padding = "8px"; // Adicionando algum espaço interno
    container.style.borderRadius = "4px"; // Borda arredondada
   
   
    logMessages && console.log("   [CreateMap] Coordenadas do mouse adicionada ao mapa.");
}

function AdicionaEscala(map, largura=150, posicao="bottomright") {
    let escala = L.control.scale({
        position: posicao,
        metric: true,
        imperial: false,
        maxWidth: largura,
    }).addTo(map);
    logMessages && console.log("   [CreateMap] Escala adicionada ao mapa.");
}

function FuncaoVisaoInicial(map, x, y, z) {
    window.SetaVisaoInicial = function () {
        return map.setView([y,x], z);
    };
    logMessages && console.log("   [CreateMap] Função de resetar para visão inicial adicionada.");
}

function FuncoesZoom(map) {
    ZoomInOut(map, window, logMessages);
}

function AdicionaAttribution(map, textoAttribution) {
    map.attributionControl.setPrefix(textoAttribution);
    logMessages && console.log("   [CreateMap] Attribution adicionado ao mapa.");
}

function CriaMenuContexto(map, configuracoesLeaflet) {
    let crs = configuracoesLeaflet.crs;
    let sistema = configuracoesLeaflet.sistema;
    let proj4text = configuracoesLeaflet.proj4text;
    let projCRS = new L.Proj.CRS(crs, proj4text);
    let popup = L.popup();
    map.on("contextmenu", (e) => {
        let coordenada = projCRS.project(L.latLng(e.latlng.lat, e.latlng.lng));
          // Obter a data e hora atual no formato brasileiro
          let now = new Date();
          let options = { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
          let dateTimeString = now.toLocaleString('pt-BR', options);
          
       
          ;
          if (sistema == 'utm') {
              let content = "<b>N</b>: " + coordenada.y.toFixed(0) + "<br><br>E</b>: " + coordenada.x.toFixed(0) + "<br><br><br";
              // Adicionar data/hora ao conteúdo, junto com o ícone de calendário
            content += `<span><br><b>Data/Hora: </b>"+ ${dateTimeString}</span>`
        }
        let content = "<b>Lat.</b>: " + coordenada.y.toFixed(5) + " <br><br><b>Lon.</b>: " + coordenada.x.toFixed(5) + "<br><br><br";
        content += `<span><b>Data/Hora: </b>${dateTimeString}</span>`
        popup.setLatLng(e.latlng).setContent(content).openOn(map);
    });
    logMessages && console.log("   [CreateMap] Menu de contexto adicionado ao mapa.");
}

function FuncaoMapaInformacoes(mapa) {
    window.MapaInformacoes = function () {
        let zoom = mapa.getZoom();
        let centro = mapa.getCenter();
        let bounds = mapa.getBounds();
        let informacoes = {
            zoom:zoom,
            centro:centro,
            bounds:bounds,
            xyz: {
                x: centro.lng,
                y: centro.lat,
                z: zoom
            }
        };
        let userInput = prompt("Digite as coordenadas em ordem 'latitude longitude'\n\nSepare as coordenadas por espaço.\n\nEx:\n-23.123456 -46.123456");
        let userInputText = userInput.split(" ");
        let userInputLat = parseFloat(userInputText[0]);
        let userInputLng = parseFloat(userInputText[1]);
        let markerIcon = L.icon({
            iconUrl: '/maps/icons/marker-icon.png',
            shadowUrl: '/maps/icons/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });
        let marker = L.marker([userInputLat, userInputLng], {icon : markerIcon}).addTo(mapa);
        mapa.setView([userInputLat, userInputLng], 15);
        return informacoes;
    };
    logMessages && console.log(mapa);
}

export {
    ConfigsLeaflet,
    AdicionaCoordenadasMouse,
    AdicionaEscala,
    FuncaoVisaoInicial,
    FuncoesZoom,
    AdicionaAttribution,
    CriaMenuContexto,
    FuncaoMapaInformacoes
}