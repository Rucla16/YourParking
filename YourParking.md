# 🚗 YourParking — PWA d'Assistència d'Aparcament

**YourParking** (evolució del projecte base *SensorCam Explorer*) és una Aplicació Web Progressiva (PWA) dissenyada per a conductors. L'objectiu principal és oferir una utilitat pràctica per desar la ubicació exacta del vehicle en el moment d'aparcar, visualitzar-lo en un mapa interactiu en temps real i donar suport visual mitjançant fotografies d'assistència (per exemple, per recordar el número de plaça o columna en un pàrquing subterrani).

---

## 🛠️ Resum de Canvis i Millores Principals

He reestructurat i personalitzat completament el projecte original per adaptar-lo a una utilitat real d'automoció, resolent importants desafiaments tècnics en l'entorn de compilació de Vite.

### 1. 🔄 Identitat de Marca i Redisseny Complet (YourParking)
* **Canvi de Nom Global:** He eliminat la nomenclatura genèrica de l'anterior plantilla (`sensorCam`) a favor del nom oficial del producte: **YourParking**. He actualitzat al fitxer `index.html`, capçaleres del sistema, missatges de benvinguda (*Toasts*) i metadades del llançament.
* **Nou Estil Visual Cyberpunk Morat:** He substituït la paleta de colors blaus original per una gamma de **violetes profunds, liles elèctrics i neons**. He centralitzat la configuració mitjançant *CSS Custom Properties* (`:root`) afectant l'Splash Screen, targetes, botons i la barra de càrrega de l'aplicació.

### 2. 🗺️ Integració de Mapes Interactius amb Leaflet
* **Visualització en Temps Real:** He integrat la llibreria **Leaflet** instal·lada de forma nativa en el sistema de dependències del projecte.
* **Geolocalització Avançada:** El botó `📌 Guardar Posició` utilitza l'API de Geolocalització del navegador per obtenir les coordenades reals de l'usuari amb alta precisió (`enableHighAccuracy`).
* **Persistència de Dades (LocalStorage):** La ubicació del cotxe i la data/hora exacta de l'aparcament queden emmagatzemades al dispositiu de manera indefinida, permetent que si l'usuari tanca l'aplicació o es queda *offline*, les dades es recuperin automàticament en tornar-la a obrir.
* **Disseny del Mapa Integrat:** He configurat una capa de mapa fosca estilitzada (estil *Dark Matter* de CartoDB) que encaixa perfectament amb l'estètica fosca de la PWA. A més, he aplicat codi CSS personalitzat per sobreescriure els globus de text (*popups*) natius de Leaflet perquè es renderitzin amb fons foscos.

### 3. 📲 Optimització de la PWA i Entorn Segur (HTTPS)
* **Manifest Actualitzat:** He configurat el fitxer de configuració del mòdul PWA (`vite-plugin-pwa`) perquè en instal·lar l'aplicació en un dispositiu mòbil o escriptori es mostri el nom, descripció i colors corporatius correctes de **YourParking**.
* **Entorn de Desenvolupament Segur:** He implementat el plugin `@vitejs/plugin-basic-ssl` per forçar la connexió local sota protocol **HTTPS** (`https://localhost:3000`). Això és un requisit indispensable exigit pels navegadores mòbils moderns per autoritzar l'ús de la càmera de fotos i de la geolocalització del GPS de manera nativa.
* **Depuració del Service Worker:** He afegit la propietat `devOptions: { enabled: false }` per silenciar les col·lisions del Service Worker en entorns de proves locals sobre certificats auto-signats, garantint un registre net en el desplegament final de producció.

---

## 🚀 Com executar el projecte localment

1. **Instal·lar les dependències del projecte:**
   ```bash
   bun install
   # o també: npm install
