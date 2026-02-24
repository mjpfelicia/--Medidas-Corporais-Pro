import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Human3DModel = ({ 
    initialWeight = 70, 
    initialHeight = 170, 
    initialWaist = 80,
    measurements = [] 
}) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const humanGroupRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const rotationRef = useRef({ x: 0.6, y: 0 });

    // Obter última medição
    const lastMeasurement = measurements && measurements.length > 0 ? measurements[0] : null;
    const weight = lastMeasurement?.weight || initialWeight;
    const height = lastMeasurement?.height || initialHeight;
    const waist = lastMeasurement?.waist || initialWaist;
    const chest = lastMeasurement?.chest || 90;
    const thigh = lastMeasurement?.thigh || 55;

    const getNormalizedValues = () => {
        const heightFactor = height / 170;
        const waistFactor = waist / 80;
        const weightFactor = weight / 70;

        return { heightFactor, waistFactor, weightFactor };
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const { heightFactor, waistFactor, weightFactor } = getNormalizedValues();

        // Inicializar Three.js
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f9fa);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 3;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        rendererRef.current = renderer;
        container.appendChild(renderer.domElement);

        // Iluminação
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(-5, 3, 5);
        scene.add(pointLight);

        // Grupo do corpo humano
        const humanGroup = new THREE.Group();
        scene.add(humanGroup);
        humanGroupRef.current = humanGroup;

        // Materiais
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xe8b4a8,
            roughness: 0.7,
            metalness: 0.1,
        });

        const darkSkinMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4956e,
            roughness: 0.7,
            metalness: 0.1,
        });

        const clothesMaterial = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            roughness: 0.6,
            metalness: 0,
        });

        // Funções auxiliares
        const createSphere = (radius, color) => {
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            return mesh;
        };

        const createCylinder = (radiusTop, radiusBottom, height, color, material = null) => {
            const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32);
            const mat = material || new THREE.MeshStandardMaterial({ color });
            const mesh = new THREE.Mesh(geometry, mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            return mesh;
        };

        // ===== CABEÇA =====
        const headRadius = 0.25 * heightFactor;
        const head = createSphere(headRadius, 0xe8b4a8);
        head.position.y = 1 * heightFactor;
        head.scale.set(1, 1.1, 1);
        humanGroup.add(head);

        // Olhos
        const eyeL = createSphere(headRadius * 0.15, 0x333333);
        eyeL.position.set(-headRadius * 0.5, 1.1 * heightFactor, headRadius * 0.8);
        humanGroup.add(eyeL);

        const eyeR = createSphere(headRadius * 0.15, 0x333333);
        eyeR.position.set(headRadius * 0.5, 1.1 * heightFactor, headRadius * 0.8);
        humanGroup.add(eyeR);

        // ===== PESCOÇO =====
        const neck = createCylinder(headRadius * 0.6, headRadius * 0.7, 0.2 * heightFactor, 0xe8b4a8, skinMaterial);
        neck.position.y = 0.85 * heightFactor;
        humanGroup.add(neck);

        // ===== TRONCO (PEITO) =====
        const chestRadius = 0.28 * weightFactor;
        const chest3D = createCylinder(chestRadius, chestRadius * 0.95, 0.5 * heightFactor, 0x3b82f6, clothesMaterial);
        chest3D.position.y = 0.4 * heightFactor;
        humanGroup.add(chest3D);

        // ===== ABDÔMEN/CINTURA =====
        const waistRadius = 0.16 * waistFactor;
        const abdomen = createCylinder(
            chestRadius * 0.95,
            waistRadius,
            0.35 * heightFactor,
            0x3b82f6,
            clothesMaterial
        );
        abdomen.position.y = 0 * heightFactor;
        humanGroup.add(abdomen);

        // Indicador de cintura (se acima de 85cm)
        if (waistFactor > 1.0625) {
            const waistIndicator = createCylinder(
                waistRadius * 1.15,
                waistRadius * 1.15,
                0.3 * heightFactor,
                0xf43f5e
            );
            waistIndicator.position.y = 0 * heightFactor;
            waistIndicator.material.transparent = true;
            waistIndicator.material.opacity = 0.3;
            humanGroup.add(waistIndicator);
        }

        // ===== PÉLVIS/QUADRIS =====
        const pelvis = createCylinder(
            waistRadius * 1.1,
            waistRadius * 1.05,
            0.25 * heightFactor,
            0xe8b4a8,
            skinMaterial
        );
        pelvis.position.y = -0.25 * heightFactor;
        humanGroup.add(pelvis);

        // ===== BRAÇOS =====
        const createArm = (side) => {
            const armSide = side === 'left' ? -1 : 1;
            const shoulderX = armSide * (chestRadius + 0.08);

            // Braço superior
            const upperArm = createCylinder(
                0.12 * weightFactor,
                0.1 * weightFactor,
                0.35 * heightFactor,
                0xe8b4a8,
                skinMaterial
            );
            upperArm.position.set(shoulderX, 0.55 * heightFactor, 0);
            upperArm.rotation.z = armSide * 0.3;
            humanGroup.add(upperArm);

            // Antebraço
            const foreArm = createCylinder(
                0.08 * weightFactor,
                0.06 * weightFactor,
                0.3 * heightFactor,
                0xd4956e,
                darkSkinMaterial
            );
            foreArm.position.set(shoulderX * 1.1, 0.2 * heightFactor, 0);
            foreArm.rotation.z = armSide * 0.5;
            humanGroup.add(foreArm);

            // Mão
            const hand = createSphere(0.08 * weightFactor, 0xe8b4a8);
            hand.position.set(shoulderX * 1.15, -0.15 * heightFactor, 0);
            humanGroup.add(hand);
        };

        createArm('left');
        createArm('right');

        // ===== PERNAS =====
        const createLeg = (side) => {
            const legSide = side === 'left' ? -0.2 : 0.2;
            const thighRadius = 0.14 * (1 + (thigh - 55) / 100);

            // Coxa
            const thighBone = createCylinder(
                thighRadius,
                thighRadius * 0.9,
                0.45 * heightFactor,
                0xe8b4a8,
                skinMaterial
            );
            thighBone.position.set(legSide, -0.45 * heightFactor, 0);
            humanGroup.add(thighBone);

            // Panturrilha
            const shin = createCylinder(
                thighRadius * 0.8,
                thighRadius * 0.7,
                0.4 * heightFactor,
                0xd4956e,
                darkSkinMaterial
            );
            shin.position.set(legSide, -1 * heightFactor, 0);
            humanGroup.add(shin);

            // Pé
            const footGeometry = new THREE.BoxGeometry(
                thighRadius * 0.8,
                thighRadius * 0.4,
                thighRadius * 1.5
            );
            const footMaterial = new THREE.MeshStandardMaterial({ color: 0x3b3b3b });
            const foot = new THREE.Mesh(footGeometry, footMaterial);
            foot.position.set(legSide, -1.35 * heightFactor, thighRadius * 0.8);
            foot.castShadow = true;
            foot.receiveShadow = true;
            humanGroup.add(foot);
        };

        createLeg('left');
        createLeg('right');

        // Posicionar o grupo todo
        humanGroup.position.y = 0.3;

        // Render loop
        const animate = () => {
            requestAnimationFrame(animate);

            if (humanGroupRef.current) {
                humanGroupRef.current.rotation.x = rotationRef.current.x;
                humanGroupRef.current.rotation.y = rotationRef.current.y;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Mouse controls
        const handleMouseDown = (e) => {
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = (e.clientX - dragStart.x) * 0.01;
            const deltaY = (e.clientY - dragStart.y) * 0.01;

            rotationRef.current.x += deltaY;
            rotationRef.current.y += deltaX;

            setDragStart({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('mouseleave', handleMouseUp);

        // Handle resize
        const handleResize = () => {
            if (!container) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('mousedown', handleMouseDown);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            renderer.domElement.removeEventListener('mouseleave', handleMouseUp);
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [weight, height, waist, chest, thigh]);

    // Calcular IMC
    const imc = (weight / ((height / 100) ** 2)).toFixed(1);
    const getIMCStatus = () => {
        const imcVal = parseFloat(imc);
        if (imcVal < 18.5) return { label: 'Abaixo do peso', color: 'info' };
        if (imcVal < 25) return { label: 'Peso normal', color: 'success' };
        if (imcVal < 30) return { label: 'Sobrepeso', color: 'warning' };
        return { label: 'Obesidade', color: 'danger' };
    };

    const imcStatus = getIMCStatus();

    return (
        <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
                <h5 className="card-title fw-bold mb-4">
                    <i className="bi bi-person-raised-hand"></i> Modelo 3D do Seu Corpo
                </h5>

                <div className="row g-4">
                    {/* Visualizador 3D */}
                    <div className="col-12 col-lg-8">
                        <div 
                            ref={containerRef}
                            className="bg-light rounded-3 position-relative"
                            style={{ 
                                minHeight: '500px',
                                height: '500px',
                                cursor: isDragging ? 'grabbing' : 'grab',
                                overflow: 'hidden'
                            }}
                        />
                        <small className="text-muted d-block text-center mt-2">
                            💡 Arraste para rotacionar o corpo
                        </small>
                    </div>

                    {/* Badges com Métricas em Tempo Real */}
                    <div className="col-12 col-lg-4">
                        <div className="badge-container d-flex flex-column gap-3">
                            {/* Altura */}
                            <div className="badge-item p-3 bg-light rounded-2 border border-primary">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted small fw-semibold">ALTURA</span>
                                    <i className="bi bi-diagram-3 text-primary"></i>
                                </div>
                                <div className="h4 text-primary fw-bold mb-0">{height} <span className="fs-6">cm</span></div>
                                <small className="text-muted">Padrão: 170cm</small>
                            </div>

                            {/* Peso */}
                            <div className="badge-item p-3 bg-light rounded-2 border border-success">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted small fw-semibold">PESO</span>
                                    <i className="bi bi-speedometer text-success"></i>
                                </div>
                                <div className="h4 text-success fw-bold mb-0">{weight} <span className="fs-6">kg</span></div>
                                <small className="text-muted">Padrão: 70kg</small>
                            </div>

                            {/* Cintura */}
                            <div className="badge-item p-3 bg-light rounded-2 border border-danger">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted small fw-semibold">CINTURA</span>
                                    <i className="bi bi-circle text-danger"></i>
                                </div>
                                <div className="h4 text-danger fw-bold mb-0">{waist} <span className="fs-6">cm</span></div>
                                <small className="text-muted">Padrão: 80cm</small>
                            </div>

                            {/* Peito/Tórax (se disponível) */}
                            {chest && (
                                <div className="badge-item p-3 bg-light rounded-2 border border-info">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted small fw-semibold">TÓRAX</span>
                                        <i className="bi bi-lungs text-info"></i>
                                    </div>
                                    <div className="h4 text-info fw-bold mb-0">{chest} <span className="fs-6">cm</span></div>
                                    <small className="text-muted">Padrão: 90cm</small>
                                </div>
                            )}

                            {/* IMC */}
                            <div className={`badge-item p-3 bg-light rounded-2 border border-${imcStatus.color}`}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted small fw-semibold">IMC</span>
                                    <i className={`bi bi-heart-pulse text-${imcStatus.color}`}></i>
                                </div>
                                <div className={`h4 text-${imcStatus.color} fw-bold mb-1`}>{imc}</div>
                                <span className={`badge bg-${imcStatus.color}-light text-${imcStatus.color}`}>
                                    {imcStatus.label}
                                </span>
                            </div>

                            {/* Taxa de Mudança */}
                            {lastMeasurement && (
                                <div className="badge-item p-3 bg-light rounded-2 border border-secondary">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted small fw-semibold">ÚLTIMA MEDIÇÃO</span>
                                        <i className="bi bi-calendar-event text-secondary"></i>
                                    </div>
                                    <small className="text-muted d-block">
                                        {new Date(lastMeasurement.date).toLocaleDateString('pt-BR')}
                                    </small>
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="alert alert-info mt-4 mb-0 small" role="alert">
                            <i className="bi bi-info-circle me-2"></i>
                            <strong>Dica:</strong> O modelo 3D atualiza em tempo real com seus dados de medição!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Human3DModel;
