import * as THREE from 'three';

const setIunination = (scene) => {
    const color = 0xffffff;
    const intensity = 1.2; // Aumentado para igualar os modelos


    // Luz ambiente branca e mais intensa
    const ambientLight = new THREE.AmbientLight(color, intensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(color, 1.2);
    directionalLight.position.set(5, 10, 5); // acima e à frente
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Luz hemisférica (céu e chão) - melhorada
    const hemisphereLight = new THREE.HemisphereLight(color, 0x666666, 0.8);
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);

    // Luz pontual frontal para melhor iluminação
    const pointLight = new THREE.PointLight(color, 1);
    pointLight.position.set(0, 2, 3); // perto da frente do modelo
    scene.add(pointLight);

    // Luz adicional para preencher sombras
    const backLight = new THREE.DirectionalLight(color, 0.5);
    backLight.position.set(-3, 5, -5);
    scene.add(backLight);
}

export {
    setIunination
}