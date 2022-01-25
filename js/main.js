// let gui = new dat.GUI();

let clock = new THREE.Clock();

let isSceneVisible = false;
let reqId;

let medalEntity = document.getElementById('medal-model');
let box = document.getElementById('box');
let light = document.getElementById('light');

// console.log(medalEntity);

// gui.add(box.object3D.position, 'x', -200, 400);
// gui.add(box.object3D.position, 'y', -200, 200);
// gui.add(box.object3D.position, 'z', -200, 200);


// gui.add(medalEntity.object3D.position, 'x', 0, 500);
// gui.add(medalEntity.object3D.position, 'y', 0, 500);
// gui.add(medalEntity.object3D.position, 'z', -200, 200);


// gui.add(light.object3D.position, 'x', -200, 400);
// gui.add(light.object3D.position, 'y', 0, 500);
// gui.add(light.object3D.position, 'z', 0, 500);

let childEl = `
    <div id="message">
        <h2>Pls scan the picture with the glass!</h2>
    </div>
`;


document.addEventListener('arReady', () => {
    console.log('ready')
    let scanningDiv = document.getElementsByClassName('mindar-ui-scanning')[0];
    console.log(typeof div)
    console.log(typeof document.body)
    scanningDiv.insertAdjacentHTML('afterbegin', childEl)
})

function rotationAnimation(){
    reqId = undefined;
    //console.log(medalEntity);
    // console.log(medalEntity.object3D);
    let step = 0.5 * clock.getDelta();
    medalEntity.object3D.rotation.z += step;
    //window.requestAnimationFrame(() => rotationAnimation())
    start();
}


function start(){
    if(!reqId){
        reqId = requestAnimationFrame(() => rotationAnimation())
    }
}

document.addEventListener('targetFound', () => {
    let scanningDiv = document.getElementsByClassName('mindar-ui-scanning')[0];
    rotationAnimation();
    scanningDiv.classList.add('hidden')
    // console.log('finaly some progress!')
})

document.addEventListener('targetLost', () => {
    let scanningDiv = document.getElementsByClassName('mindar-ui-scanning')[0];
    if(reqId){
        cancelAnimationFrame(reqId)
        reqId = undefined;
        scanningDiv.classList.remove('hidden');
    }
    // console.log('juhuuuuu')
})
