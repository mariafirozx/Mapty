//notes -->
/**project objv: view the user loc map using geolocation :? browser prompts the user to jnow location
 * user can log thier workouts eg running, cycling --- etc
 */


'use strict';

// // prettier-ignore
// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const msg = document.querySelector('.msg');
const map = document.querySelector('#map');

//buttons

const clearAll = document.querySelector('.deleteAll');
const clearAllCard = document.querySelector('.deleteAllCard');
const overlay = document.querySelector('.overlay');
const confirmBtn = document.querySelector('.confirmBtn');
const noBtn = document.querySelector('.noBtn');


// using geolocation API --browser

// display map using leaflet lib

// attach event handler to bind the map and interact -- get coords on the clicked point

// always keep pop up open, customize pop up. add color ;;;


//managing workouts--- creating classes 


//find popup classname
//find marker classname




class Workout{

    date = new Date();
    id = Date.now() + ''.slice(-10);
    clicks = 0;
    
    constructor(coords, distance, duration){
        this.coords = coords; //[lat, lng]
        this.distance = distance; //in km
        this.duration = duration; //in min 
        

    }

    _setDescription(){
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
    click(){
        this.clicks++;
    }
}

class Running extends Workout{
    type = 'running';
    constructor(coords, distance, duration, cadence){
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();

        this._setDescription();
        
    }

    calcPace(){
        //min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout{
    type = 'cycling';
    constructor(coords, distance, duration, elevation){
        super(coords, distance, duration);
        this.elevation = elevation;

        this.calcSpeed();
        this._setDescription();
    }
    calcSpeed(){
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }

}

// const run0 = new Running([39, -12], 5.2, 24, 178);
// const cycle0 = new Cycling([39, -12], 27, 95, 523);
// console.log(run0, cycle0);


///////////////////////////////////////////////
// create class App ---refactoring

class App{

    map = document.querySelector('#map');

    #map; 
    #mapEvent;
    #mapZoom = 13;
    #workouts = [];
    #editWorkout = null;
    constructor(){
        this._getPosition();
        this.#map;
        this.#mapEvent;

        //get local user data

       this._getLocalStorage();

        //attach event handlers

        form.addEventListener('submit', this._newWorkout.bind(this));
            //....display marker once user submit the form
            // console.log(mapEvent);
    
         //clear input field

         inputType.addEventListener('change', this._toggleElevationField);
            //makes sure one of them is hidden when other is clicked 
            
        containerWorkouts.addEventListener('click', this._moveToPop.bind(this)); 
        clearAll.addEventListener('click', this._clearAllWorkouts.bind(this));
        document.querySelector('.workouts').addEventListener('click', (e)=>{
            if(e.target.classList.contains('deleteWorkoutBtn')){ 
                //event delegation for when searching for an el thats being created dynamically --> learned in course tooo!!!!! REMEMBER !!!
                this._showCard('deleteWorkout', e); 
            }else if(e.target.classList.contains('editBtn')){ 
                //event delegation for when searching for an el thats being created dynamically --> learned in course tooo!!!!! REMEMBER !!!
                this._editWorkout(e); 
            }
        });

        this.addhandlerSetViewtoPop(this._setMapViewtoPop.bind(this));
        

        // this.addhandlerSetViewtoPop(this._setMapViewtoPop);
        //  this._setMapViewtoPop();
    }

    _getPosition(){

        //using bind since this keyword is undefined in a reg function, and loadMap here is reg function
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
                alert('location invalid')
        
            }, 
       )};
        
    } 

    _loadMap(pos){
        try{

        const {latitude} = pos.coords; //same var name as coords
        const {longitude} = pos.coords;
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`)
        
         const coords = [latitude, longitude]
         this.#map = L.map('map').setView(coords, 13);
        
         L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            this.#map.on('click', this._showForm.bind(this));
                
            this.#workouts.forEach(work => {
                this._renderWorkoutMarker(work);
            })

        }catch(err){
            console.error(err);
            
        }
                //obj generated by leaflet to handle events
                //handling click on map
    }

    _showForm(mapE){

        msg.classList.add('hide');
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    
    }

    _hideform(){
        //empty inputs
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => (form.style.display = 'grid'),1000);
    }

    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
       
    }

    //generate new workout form -- render in map and render in list

    _newWorkout(e){
        e.preventDefault();

        const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp) );
        const posNumbers = (...inputs) => inputs.every(inp => inp>0);
        //get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;

        
        let workout;


        //if editing a existing workout 
        if(this.#editWorkout){
            // workout = this.#editWorkout;
            // workout.distance = distance;
            // workout.duration = duration;
            const {coords, id} = this.#editWorkout;

            if(type === 'running'){
                const cadence = +inputCadence.value;
                if(!validInput(distance, duration, cadence) || !posNumbers(distance, duration, cadence)) {
                    return alert('Input has to be valid numbers');
                }
                // workout.cadence = cadence;
                // workout.pace = duration / distance;
                workout = new Running(coords, distance, duration, cadence);

            }else if(type === 'cycling'){
                const elevation = +inputElevation.value;
                if(!validInput(distance, duration, elevation) || !posNumbers(distance, duration) ) {
                    return alert('Input has to be valid numbers');
                }
                // workout.elevation = elevation;
                // workout.speed = distance / (duration / 60);
                workout = new Cycling(coords, distance, duration, elevation);

            }
            // workout._setDescription();
            // this.#editWorkout = null;
            workout.id = id;
            workout.date = this.#editWorkout.date;
            const i = this.#workouts.findIndex(work => work.id === id);
            this.#workouts[i] = workout;
            //update UI
            // setTimeout(() => {
            //     document.querySelector(`.workout[data-id="${id}"]`).remove();
            // }, 2.5 * 1000);

            document.querySelector(`.workout[data-id="${id}"]`).remove(); //remove the old one from UI and render the new one
            this.#editWorkout = null;
        } else{
        //create new workout if no existing
            const {lat, lng} = this.#mapEvent.latlng;

            if(type === 'running'){
                const cadence = +inputCadence.value;
                // if(!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence)) return alert('Input has to be +ve numbers');
                if(!validInput(distance, duration, cadence) || !posNumbers(distance, duration, cadence)) return alert('Input has to be valid numbers');
                workout = new Running([lat, lng], distance, duration, cadence);
            }

            if(type === 'cycling') {
                        //.. if activity cycle, create cycle obj
                const elevation = +inputElevation.value;
                if(!validInput(distance, duration, elevation) || !posNumbers(distance, duration) ) return alert('Input has to be valid numbers');
                workout = new Cycling([lat, lng], distance, duration, elevation);

            }
        //add new obj to workput array
            this.#workouts.push(workout);
    }
        //render workout on map as marker

        this._renderWorkoutMarker(workout);
        
        this._renderWorkout(workout);

        this._hideform();
        
        //set local storage to all workouts
        this._setLocalStorage();
    }


    _renderWorkoutMarker(workout){

        const icon = L.icon({
            iconUrl: 'marker-icon.png',
            iconSize: [50, 55],
            iconAnchor: [24, 3],
           
        })
        const marker = L.marker(workout.coords , {icon: icon}).addTo(this.#map) //pop up : default
            .bindPopup(L.popup({
                   maxWidth: 250,
                   minWidth: 100,
                   autoClose: false,
                   closeOnClick: false,
                   className: `${workout.type}-popup ${workout.id}`,
            }))
           .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`) //create pop and bind to marker
           .openPopup();

           workout.markerId = marker._leaflet_id;

           //${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}

    }

    _renderWorkout(workout){
        let html = ` 
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <i class="fa-regular fa-pen-to-square editBtn"></i>
            <i class="fa-solid fa-trash deleteWorkoutBtn"></i>

            <div class="workout__details">
                <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
            </div>
        `;
    
        if(workout.type === 'running'){
            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
            </div>
            `;
        }
    
        if(workout.type === 'cycling'){
            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevation.toFixed(1)}</span>
                <span class="workout__unit">m</span>
            </div>
            `;
        }
    
        form.insertAdjacentHTML('afterend', html);
        msg.classList.add('hide');

        clearAll.classList.remove('hide');
        

        // deleteWorkoutBtn.addEventListener('click', _deleteWorkout);

        // const deleteWorkoutBtn = document.querySelector('.deleteWorkoutBtn');
        // deleteWorkoutBtn.addEventListener('click', _showCard('deleteWorkout'));
    }


    _moveToPop(e){

        //e is the el thats clicked --> closest opp of query selection, wherever the click happens in 'workout' 
        //everything would end up in the workout li, by accessing workout we will access id
        const workoutEl = e.target.closest('.workout');

        if(!workoutEl) return;

        const workout = this.#workouts.find(work => work.id === 
            workoutEl.dataset.id ); 
        
        if(!workout) return;

        this.#map.setView(workout.coords, this.#mapZoom, {
            animate: true,
            pan:{
                duration: 1,
            },
        });

        // workout.click();

    }

    addhandlerSetViewtoPop(handler){
        if(!this.map) {
            console.log('map not loaded');
            return;

        }
        this.map.addEventListener('click', (e)=>{
            const popupEL = e.target.closest('.leaflet-popup');
        
            if(!popupEL) return;

            //extract popup class name and id from the popup element
            const popupClassList = popupEL.className.split(' ');
            const workoutType = popupClassList.find((cls) => cls.endsWith('-popup')).replace('-popup', '');
            const workoutId = popupClassList.find((cls) => !cls.includes('-popup') && cls !== 'leaflet-popup' && cls !== 'leaflet-zoom-animated'); //find the id of the workout from the popup element
    
            if (!workoutType || !workoutId) {
                console.error('Could not extract type or id from popup className.');
                return;
              }
          
              handler(workoutId); //pass it into the handler
        })

    }

    _setMapViewtoPop(workoutId) {

        const workout = this.#workouts.find((work) => work.id === workoutId); //find the workout popup with the given ID
        if (!workout) {
          console.error('No workout found for the given ID:', workoutId);
          return;
        }
      
        // Set the map view to the workout's coordinates
        this.#map.setView(workout.coords, this.#mapZoom, {
          animate: true,
          pan: {
            duration: 1,
          },
        });
            
  }    

    _getLocalStorage(){
        const data = JSON.parse(localStorage.getItem('workout'));

        if(!data) return;

        this.#workouts = data; 
        this.#workouts.forEach(work => {
            this._renderWorkout(work);
            //render marker wont work here since this get executed at the  page load=map 
            //is undefined at page load.

            //---> so , the pos of user is to get, then map has to be loaded bfr we can render marker

        })

    }

    _deleteWorkout(e){

        try{

            const workoutEl = e.target.closest('.workout');

            if(!workoutEl) return;

            const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id ); 
            
            if(!workout) return;
            //remove workout from array
            const i = this.#workouts.indexOf(workout);
            this.#workouts.splice(i, 1);
            console.log(i);

            //remove from UI
            workoutEl.remove();
            //remove from local storage
           
            console.log('test1');
            this._setLocalStorage();
            // localStorage.removeItem(workout.id);

            /**update: dont directly call remove item on setstorage as it creates errors; and dont 
             * directly remove item from local storage as it will remove all items from local storage n return upon refresh
             * instead, remove from array, then set local storage; hence, the item will be removed from local storage
             */
            //remove from map
            console.log('test');

            
           const marker = this.#map._layers[workout.markerId];
           if(marker) this.#map.removeLayer(marker);
        //    this._findpopup(marker, workout).remove();
            
            
            
        // //reset map
        // this.#map.removeLayer(workout);
        }catch(err){
            console.error(err);
        }
        
    }

    _editWorkout(e){
        //find the workout in the array
        //edit the workout
        //render the workout
        //update the local storage
        try{
            let workout = e.target.closest('.workout');
            if(!workout) return;
            const workoutEl = this.#workouts.find(work => work.id === workout.dataset.id);
            console.log(`workout found ${workoutEl}`);
            if(!workoutEl) return;

            this.#editWorkout = workoutEl;
            //edit the clicked workout
            this._showForm();
            //hide workout 

           //populate the form with the workout data
           inputType.value = workoutEl.type;
           inputDistance.value = workoutEl.distance;
           inputDuration.value = workoutEl.duration;

           if(workoutEl.type === 'running'){

                inputCadence.value = workoutEl.cadence;
                inputElevation.closest('.form__row').classList.add('form__row--hidden');
                inputCadence.closest('.form__row').classList.remove('form__row--hidden');

           } else if(workoutEl.type === 'cycling'){

                inputElevation.value = workoutEl.elevation;
                inputCadence.closest('.form__row').classList.add('form__row--hidden');
                inputElevation.closest('.form__row').classList.remove('form__row--hidden');
           }
        }catch(err){
            console.error(err);
        }
    }


    _setLocalStorage(){
        //a very simple API --> only to be used small data, not large data...
      localStorage.setItem('workout', JSON.stringify(this.#workouts));
    }
    // deleteworkout(){
    //     const workEl = e.target.closest('.workout');

    //     if(!workEl) return;

        


    // }
    reset(){

        localStorage.removeItem('workout');
        location.reload();
    }

    _showCard(action, e){

        //if no workouts
    
        if(localStorage.length === 0 && !this.#workouts) return;
    
        
        clearAllCard.classList.remove('hide');
        overlay.classList.remove('hide');
    
        confirmBtn.addEventListener('click', ()=>{ //arrow function to bind this keyword; use arrow when error is not a function !!!!
            if(action === 'clearAll'){
                 app.reset();
            }
            if(action === 'deleteWorkout'){
               this._deleteWorkout(e);

            }
            clearAllCard.classList.add('hide');
            overlay.classList.add('hide');
        })



        noBtn.addEventListener('click', function(){
                clearAllCard.classList.add('hide');
                overlay.classList.add('hide');
        }) 
    
    }
    

    _clearAllWorkouts() {
        this._showCard('clearAll');
    }
    
    
    _findpopup = function(popup, workout){
        const p = popup.find(
            (popup) => popup.className === `leaflet-popup ${workout.type}-popup`
        );
        console.log(p);
        return p;
        
    }

}

// _clearAllWorkouts() {
//     this.showCard();
// }

// _attachEventHandlers() {
//     form.addEventListener('submit', this._newWorkout.bind(this));
//     inputType.addEventListener('change', this._toggleElevationField);
//     containerWorkouts.addEventListener('click', this._moveToPop.bind(this));
//     clearAll.addEventListener('click', this._clearAllWorkouts.bind(this));
// }

// constructor() {
//     this._getPosition();
//     this._getLocalStorage();
//     this._attachEventHandlers();
// }
// clearAll.addEventListener('click', function(){
//     showCard();
// })

const app = new App();






//** 1.ability to edit a workout
// 2. to delete a workout 
// 3. sort workout by certain fields --distance 
// 4. rebuild running & cycle from local storage 
//5.display UI error msg and confirm msg */
// 6. position the map to show all workouts on map at once
// 7. draw lines or shapes instead of just points

//8. using thirdparty api geocode location from coordinates 
//9. display weather conditions
