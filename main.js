
function init() {

    scene = new THREE.Scene();

    gui =  new dat.GUI();

    var clock = new THREE.Clock();

    InTranslation= false;
    InRotation= false;
    InScale= false;
    InAmbient=false;
    IsShadow = false;
    InLightingSetting=false;

    var enableFog = false;

    if (enableFog)
        scene.fog = new THREE.FogExp2(0xfffffff, 0.2);



    Type = 'face';

    var planeMaterial = getMaterial('phong', 'rgb(255,255,255)');
    var plane = getPlane(planeMaterial, 100);

    var ShapeMaterial = getMaterial('phong', 'rgb(120,120,120)')
    Shape = getBox(ShapeMaterial, 3, 3, 3);
    Shape.name = 'box'
    Shape.position.y = 1.5

    Lighting = getSpotLight(1); //spotlight or point light or directional light or ambient light
    SetUpLighting()
    LightingType='spot';





    plane.name = 'plane-1';


    //var loader = new THREE.TextureLoader();

    //planeMaterial.map= loader.load('./blue-grid-background-design-template-1e1c68884da701e5b3f6d35b07007fe8_screen.jpg');

    // var texture = planeMaterial.map;
    // texture.wrapS=THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(1.5,1.5);


    plane.rotation.x = Math.PI / 2;




    scene.add(plane);
    scene.add(Lighting);
    scene.add(Shape)

    camera = new THREE.OrthographicCamera(
        -15,
        15,
        15,
        -15,
        1,
        1000
    );
    camera.position.x = 10;
    camera.position.y = 18;
    camera.position.z = -18;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor('rgb(120,120,120)');
    document.getElementById("webgl").appendChild(renderer.domElement);
    OrbitControls = new THREE.OrbitControls(camera, renderer.domElement);


    update(renderer, scene, camera, OrbitControls, clock);


    return scene;
}

function getMaterial(type, color) {
    var selectedMaterial;
    var materialOption = {
        color: color === undefined ? 'rgb(255,255,255)' : color,
    };

    switch (type) {
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOption);
            break;
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOption);
            break;
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOption);
            break;
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOption);
            break;
    }
    selectedMaterial.side = THREE.DoubleSide;
    return selectedMaterial;

}

function getBox(material, w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getCone(material, r, h) {
    var geometry = new THREE.ConeGeometry(r, h, 64);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getCylinder(material, rT, rB, h) {
    var geometry = new THREE.CylinderGeometry(rT, rB, h, 32);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getDodecahedron(material, r) {
    var geometry = new THREE.DodecahedronGeometry(r);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getWheel(material, r, t) {
    var geometry = new THREE.TorusGeometry(r, t, 5, 100);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getBoxGrid(amount, seperationMultiplier) {
    var group = new THREE.Group()

    for (var i = 0; i < amount; i++) {
        var obj = getBox(1, 1, 1);
        obj.position.x = i * seperationMultiplier;
        obj.position.y = obj.geometry.parameters.height / 2;
        group.add(obj);
        for (var j = 1; j < amount; j++) {
            var obj = getBox(1, 1, 1);
            obj.position.x = i * seperationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            obj.position.z = j * seperationMultiplier;
            group.add(obj);
        }
    }

    group.position.x = -(seperationMultiplier * (amount - 1)) / 2;
    group.position.z = -(seperationMultiplier * (amount - 1)) / 2;
    return group;
}

function getPlane(material, size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.receiveShadow = true;
    return mesh;
}

function getSphere(material, size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);

    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.receiveShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getTeapot(material, size) {
    var geometry = new THREE.TeapotGeometry(size = size);

    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;

}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function getSpotLight(intensity) {
    var light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;
    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 10;
    return light;
}

function getAmbientLight(intensity) {
    var light = new THREE.AmbientLight('rgb(10,30,50)', intensity);
    return light;
}

function update(renderer, scene, camera, controls, clock) {
    renderer.render(
        scene,
        camera,
    );


    var plane = scene.getObjectByName('plane-1');
    var box = scene.getObjectByName('box-1');
    var boxGrid = scene.getObjectByName('boxGrid-1');
    //plane.rotation.x+=0.001;    
    //plane.rotation.y+=0.001;   

    //box grid animation
    // var timeElapsed = clock.getElapsedTime();
    // boxGrid.children.forEach(function(child,index) {
    //     noise.seed(Math.random());
    //     var x = timeElapsed + index;
    //     var temp = noise.simplex2(x/100 , x/100) + 1 ;
    //     child.scale.y=temp/2;
    //     child.position.y=child.scale.y/2;
    // });

    var Tx = 0, Ty = 0, Tz = 0.01;
    //Translatation
    var translation = new THREE.Matrix4().makeTranslation(Tx, Ty, Tz);

    //Rotation
    var rotation = new THREE.Matrix4().makeRotationY(Math.PI / 360);

    //applying Translation
    //box.applyMatrix4(translation);

    //applying Rotation
    //box.applyMatrix4(rotation);

    //applying Rotation + Translation
    //box.applyMatrix4(translation.multiply(rotation));


    //DIRECTION AND MAGNUTYDE
    var dir = new THREE.Vector3();
    dir = new THREE.Vector3(0, 1, 0).normalize();
    //box.translateOnAxis(dir,0.01);


    controls.update();
    requestAnimationFrame(function () {
        update(renderer, scene, camera,controls,  clock);
    });
}

function TypeUpdate(TypeName) {
    Type = TypeName
    scene.remove(Shape);
    UpdateShapeHelper(Shape.name); // reset the shape's default settings

    scene.remove(VertexHelper);
    scene.remove(EdgeHelper);

    switch (TypeName) {
        case 'vertex':
            var PointMaterial = new THREE.PointsMaterial( { color: 0x00FF00 } );
            VertexHelper=new THREE.Points( Shape.geometry, PointMaterial );
            VertexHelper.position.y=3;
            scene.add(VertexHelper);
            break;
        case 'edge':
            edges = new THREE.EdgesGeometry(Shape.geometry);
            EdgeHelper = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00FF00  }));
            EdgeHelper.position.y=3;
            scene.add(EdgeHelper);
            break;
        case 'face':
            scene.add(Shape);
            break;
    }

    ReAttachAffine();

    if(IsShadow === true)
    {
        TurnOnShadow();
    }
}

function UpdateShape(ShapeName) {
    if (Shape !== undefined) {
        Shape.geometry.dispose()
        scene.remove(Shape)
    }

    UpdateShapeHelper(ShapeName)

    switch(Type)
    {
        case 'face':
            scene.add(Shape);
            break;
        case 'vertex':
            TypeUpdate('vertex');
            break;
        case 'edge':
            TypeUpdate('edge');
            break;
    }

    ReAttachAffine();

    if(IsShadow === true)
    {
        TurnOnShadow();
    }
}

function UpdateShapeHelper(ShapeName)
{
    var ShapeMaterial = getMaterial('phong', 'rgb(120,120,120)')
    switch (ShapeName) {
        case 'box':
            Shape = getBox(ShapeMaterial, 3, 3, 3);
            Shape.position.y = 1.6;
            break;
        case 'cone':
            Shape = getCone(ShapeMaterial, 2, 5);
            Shape.position.y = 2.5;
            break;
        case 'cylinder':
            Shape = getCylinder(ShapeMaterial, 1, 1, 3);
            Shape.position.y = 1.5;
            break;
        case 'sphere':
            Shape = getSphere(ShapeMaterial, 2);
            Shape.position.y = 2;
            break;
        case 'teapot':
            Shape = getTeapot(ShapeMaterial, 2);
            Shape.position.y = 2;
            break;
        case 'wheel':
            Shape = getWheel(ShapeMaterial, 2);
            Shape.position.y = 2.5;
            break;
        case 'dodecahedron':
            Shape = getDodecahedron(ShapeMaterial, 2);
            Shape.position.y = 2;
            break;
    }
    Shape.name=ShapeName;
}

function Translate()
{
    if(InTranslation === false)
    {
        InRotation = false;
        InTranslation=true;
        InScale=false;
        TranslateHelper()
    }
    else
    {
        RemoveAffineGUI();
        InTranslation=false;
    }
}
function TranslateHelper()
{
    RemoveAffineGUI();
    switch(Type){
        case 'face':
            guiItem1= gui.add(Shape.position,'x',-10,10);
            guiItem2 = gui.add(Shape.position,'y',-10,10);
            guiItem3 = gui.add(Shape.position,'z',-10,10);
            break;
        case 'vertex':
            guiItem1 = gui.add(VertexHelper.position,'x',-10,10);
            guiItem2 = gui.add(VertexHelper.position,'y',-10,10);
            guiItem3 = gui.add(VertexHelper.position,'z',-10,10);
            break;
        case 'edge':
            guiItem1 = gui.add(EdgeHelper.position,'x',-10,10);
            guiItem2 = gui.add(EdgeHelper.position,'y',-10,10);
            guiItem3 = gui.add(EdgeHelper.position,'z',-10,10);
            break;
    }
}
function Rotate()
{
    
    if(InRotation===false)
    {
        InRotation = true;
        InTranslation=false;
        InScale=false;
        RotateHelper()
    }
    else
    {
        RemoveAffineGUI();
        InRotation = false;
    }
}
function RotateHelper()
{
    RemoveAffineGUI();
    switch(Type){
        case 'face':
            guiItem1 = gui.add(Shape.rotation,'x',-10,10);
            guiItem2 = gui.add(Shape.rotation,'y',-10,10);
            guiItem3 = gui.add(Shape.rotation,'z',-10,10);
            break;
        case 'vertex':
            guiItem1 = gui.add(VertexHelper.rotation,'x',-10,10);
            guiItem2 = gui.add(VertexHelper.rotation,'y',-10,10);
            guiItem3 = gui.add(VertexHelper.rotation,'z',-10,10);
            break;
        case 'edge':
            guiItem1 = gui.add(EdgeHelper.rotation,'x',-10,10);
            guiItem2 = gui.add(EdgeHelper.rotation,'y',-10,10);
            guiItem3 = gui.add(EdgeHelper.rotation,'z',-10,10);
            break;
    }

}
function Scale()
{
    if(InScale === false)
    {
        InRotation = false;
        InTranslation= false;
        InScale= true;
        ScaleHelper()

    }
    else{
        RemoveAffineGUI();
        InScale=false;
    }
}
function ScaleHelper()
{
    RemoveAffineGUI();
    switch(Type){
        case 'face':
            guiItem1 = gui.add(Shape.scale,'x',-10,10);
            guiItem2 = gui.add(Shape.scale,'y',-10,10);
            guiItem3 = gui.add(Shape.scale,'z',-10,10);
            break;
        case 'vertex':
            guiItem1 = gui.add(VertexHelper.scale,'x',-10,10);
            guiItem2 = gui.add(VertexHelper.scale,'y',-10,10);
            guiItem3 = gui.add(VertexHelper.scale,'z',-10,10);
            break;
        case 'edge':
            guiItem1 = gui.add(EdgeHelper.scale,'x',-10,10);
            guiItem2 = gui.add(EdgeHelper.scale,'y',-10,10);
            guiItem3 = gui.add(EdgeHelper.scale,'z',-10,10);
            break;
    }
}
function ReAttachAffine()
{
    if(InTranslation === true)
        TranslateHelper();
    if(InRotation === true)
        RotateHelper();
    if(InScale === true)
        ScaleHelper();
        
}

function RemoveAffineGUI()
{
    try{
        gui.remove(guiItem1);
        gui.remove(guiItem2);
        gui.remove(guiItem3);
        }
    catch(err)
    {
    }
}

function Shadow()
{
    if(IsShadow === false)
    {
        IsShadow=true;
        TurnOnShadow();
    }
    else
    {
        IsShadow=false;
        var plane = scene.getObjectByName('plane-1');
        plane.receiveShadow = false;
        switch(Type){
            case 'face':
                Shape.castShadow=false;
                break;
            case 'vertex':
                VertexHelper.castShadow=false;
                break;
            case 'edge':
                EdgeHelper,castShadow=false;
                break;
        }
    }
}

function TurnOnShadow()
{
    var plane = scene.getObjectByName('plane-1');
    plane.receiveShadow = true;
    switch(Type){
        case 'face':
            Shape.castShadow=true;
            break;
        case 'vertex':
            VertexHelper.castShadow=true;
            break;
        case 'edge':
            EdgeHelper,castShadow=true;
            break;
    }
}

function UpdateLighting(LightingName)
{
    scene.remove(Lighting);
    scene.remove(LightingHelper);
    LightingHelper.remove(LightSource);
    switch(LightingName)
    {
        case 'spot':
            Lighting=getSpotLight(1);
            break;
        case 'directional':
            Lighting=getDirectionalLight(1);
            break;
        case 'point':
            Lighting=getPointLight(1);
            break;
    }

    SetUpLighting()
    if(InLightingSetting == true)
    {
        LightingSettingHelper();
    }
    scene.add(Lighting)
}

function SetUpLighting()
{
    Lighting.position.x = 13;
    Lighting.position.y = 10;
    Lighting.position.z = 10;
    Lighting.intensity = 1.5;
    LightingHelper = new THREE.CameraHelper(Lighting.shadow.camera);
    scene.add(LightingHelper);

    var SphereMaterial = getMaterial('basic', 'rgb(255,255,0)')
    LightSource = getSphere(SphereMaterial, 0.5);
    Lighting.add(LightSource);
}

function Ambient()
{
    if(InAmbient === false)
    {
        InAmbient = true;
        AmbientLight=getAmbientLight(1);
        scene.add(AmbientLight);
    }
    else
    {
        InAmbient = false;
        try{
        scene.remove(AmbientLight);
        }
        catch(err)
        {}
    }
}

function LightingSetting()
{
    if(InLightingSetting === false)
    {
        InLightingSetting=true;

        LightingSettingHelper();

    }
    else
    {
        RemoveLightingSettingGUI();
        InLightingSetting= false;
    }
}

function LightingSettingHelper()
{
    RemoveLightingSettingGUI();
    guiLighting1 = gui.add(Lighting,'intensity',0,10);
    guiLighting2 = gui.add(Lighting.position, 'x', 0,20);
    guiLighting3 = gui.add(Lighting.position, 'y', 0,20);
    guiLighting4 = gui.add(Lighting.position, 'z', 0,20);
}


function RemoveLightingSettingGUI()
{
    try{
        gui.remove(guiLighting1);
        gui.remove(guiLighting2);
        gui.remove(guiLighting3);
        gui.remove(guiLighting4);
    }
    catch(err)
    {}
}




let scene;
let Type,LightingType;
let Lighting,LightingHelper,LightSource,AmbientLight;
let gui;
let OrbitControls;
let Shape, VertexHelper, EdgeHelper;
let camera,renderer;
let Control;
let InTranslation,InRotation,InScale;
let guiItem1,guiItem2,guiItem13;
let guiLighting1,guiLighting2,guiLighting3,guiLighting4;
let IsShadow,InAmbient,InLightingSetting;
init();