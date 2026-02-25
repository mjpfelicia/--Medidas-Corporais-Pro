import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Human3DModel = ({
    initialWeight = 70,
    initialHeight = 170,
    initialWaist = 80,
    measurements = [],
    gender = 'male' // 'male' ou 'female'
}) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const humanGroupRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const rotationRef = useRef({ x: 0.6, y: 0 });
    const positionRef = useRef({ x: 0, y: 0, z: 3 });
    const [zoomLevel, setZoomLevel] = useState(1);

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

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;
        container.appendChild(renderer.domElement);

        // Iluminação
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.far = 50;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.9);
        pointLight.position.set(-5, 3, 5);
        scene.add(pointLight);

        // Grupo do corpo humano
        const humanGroup = new THREE.Group();
        scene.add(humanGroup);
        humanGroupRef.current = humanGroup;

        // Carregar modelo 3D
        const loader = new GLTFLoader();
        const modelPath = `${process.env.PUBLIC_URL}/models/${gender}.glb`;
        console.log({ modelPath });
        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;

                // Limpar grupo anterior
                while (humanGroup.children.length > 0) {
                    humanGroup.remove(humanGroup.children[0]);
                }

                // Adicionar modelo ao grupo
                humanGroup.add(model);

                // Ajustar escala do modelo
                model.scale.set(1.5, 1.5, 1.5);

                // Configurar sombras
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
            },
            undefined,
            (error) => {
                console.error(`Erro ao carregar modelo ${gender}:`, error);
                // Fallback: criar modelo simples se não carregar
                createFallbackModel(humanGroup, gender);
            }
        );

        // Função fallback para criar modelo simples
        const createFallbackModel = (group, gnd) => {
            const geometry = new THREE.CapsuleGeometry(0.3, 1.5, 16, 100);
            const material = new THREE.MeshStandardMaterial({
                color: gnd === 'female' ? 0xFF69B4 : 0x0066CC,
                roughness: 0.7,
                metalness: 0.1,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
        };

        // Posicionar o grupo todo
        humanGroup.position.y = 0.3;

        // Render loop
        const animate = () => {
            requestAnimationFrame(animate);

            if (humanGroupRef.current) {
                humanGroupRef.current.rotation.x = rotationRef.current.x;
                humanGroupRef.current.rotation.y = rotationRef.current.y;
                humanGroupRef.current.position.x = positionRef.current.x;
                humanGroupRef.current.position.y = positionRef.current.y;
            }

            if (cameraRef.current) {
                cameraRef.current.position.z = positionRef.current.z;
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

        // Zoom com scroll do mouse
        const handleMouseWheel = (e) => {
            e.preventDefault();
            const zoomSpeed = 0.1;
            const direction = e.deltaY > 0 ? -1 : 1;
            positionRef.current.z = Math.max(1, Math.min(10, positionRef.current.z + direction * zoomSpeed));
            setZoomLevel(3 / positionRef.current.z);
        };

        // Controle de teclado para movimento
        const handleKeyDown = (e) => {
            const step = 0.2;
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    positionRef.current.y += step;
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    positionRef.current.y -= step;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    positionRef.current.x -= step;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    positionRef.current.x += step;
                    break;
                default:
                    break;
            }
        };

        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('mouseleave', handleMouseUp);
        renderer.domElement.addEventListener('wheel', handleMouseWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown);

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
            window.removeEventListener('keydown', handleKeyDown);
            renderer.domElement.removeEventListener('mousedown', handleMouseDown);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            renderer.domElement.removeEventListener('mouseleave', handleMouseUp);
            renderer.domElement.removeEventListener('wheel', handleMouseWheel);
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            renderer.forceContextLoss();
        };
    }, [weight, height, waist, chest, thigh, gender]);

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

    // Função para resetar posição
    const handleResetView = () => {
        rotationRef.current = { x: 0.6, y: 0 };
        positionRef.current = { x: 0, y: 0, z: 3 };
        setZoomLevel(1);
    };

    // Funções para rotacionar
    const rotateModel = (direction) => {
        const rotSpeed = 0.2;
        switch(direction) {
            case 'up': rotationRef.current.x -= rotSpeed; break;
            case 'down': rotationRef.current.x += rotSpeed; break;
            case 'left': rotationRef.current.y -= rotSpeed; break;
            case 'right': rotationRef.current.y += rotSpeed; break;
            default: break;
        }
    };

    // Funções para mover
    const moveModel = (direction) => {
        const step = 0.2;
        switch(direction) {
            case 'up': positionRef.current.y += step; break;
            case 'down': positionRef.current.y -= step; break;
            case 'left': positionRef.current.x -= step; break;
            case 'right': positionRef.current.x += step; break;
            default: break;
        }
    };

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
                            💡 Arraste para rotacionar • Setas do teclado para mover • Scroll para zoom
                        </small>

                        {/* Controles de Rotação */}
                        <div className="mt-3 d-flex flex-column gap-2">
                            {/* Controles de Rotação */}
                            <div className="d-flex justify-content-center gap-2 mb-2">
                                <button 
                                    className="btn btn-sm btn-outline-info" 
                                    onClick={() => rotateModel('up')}
                                    title="Rotacionar para cima"
                                >
                                    <i className="bi bi-arrow-up"></i>
                                </button>
                            </div>
                            <div className="d-flex justify-content-center gap-2">
                                <button 
                                    className="btn btn-sm btn-outline-info" 
                                    onClick={() => rotateModel('left')}
                                    title="Rotacionar para esquerda"
                                >
                                    <i className="bi bi-arrow-left"></i>
                                </button>
                                <button 
                                    className="btn btn-sm btn-outline-info" 
                                    onClick={() => rotateModel('down')}
                                    title="Rotacionar para baixo"
                                >
                                    <i className="bi bi-arrow-down"></i>
                                </button>
                                <button 
                                    className="btn btn-sm btn-outline-info" 
                                    onClick={() => rotateModel('right')}
                                    title="Rotacionar para direita"
                                >
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                            
                            {/* Botão Reset */}
                            <div className="d-flex justify-content-center gap-2 mt-2">
                                <button 
                                    className="btn btn-sm btn-outline-danger" 
                                    onClick={handleResetView}
                                    title="Resetar vista"
                                >
                                    <i className="bi bi-arrow-counterclockwise"></i> Resetar
                                </button>
                            </div>
                        </div>
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
