import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import "./Human3DModel.css";
import {
    handleKeyDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseWheel,
    handleResize
} from "./control3DModel";

import { setIunination } from './Ilumination';

const Human3DModel = ({
    initialWeight = 70,
    initialHeight = 170,
    initialWaist = 80,
    measurements = [],
    gender = 'female' // 'male' ou 'female'
}) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const humanGroupRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const rotationRef = useRef({ x: 0, y: 0 });
    const positionRef = useRef({ x: 0, y: -1, z: 3 });
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

        // Iluminação - otimizada e igual para ambos os modelos
        setIunination(scene);

        // Grupo do corpo humano
        const humanGroup = new THREE.Group();
        scene.add(humanGroup);
        humanGroupRef.current = humanGroup;

        // Carregar modelo 3D
        const loader = new GLTFLoader();
        const modelPath = `${process.env.PUBLIC_URL}/models/${gender}.glb`;

        const gltf = (gltf) => {
            const model = gltf.scene;

            // Corrigir orientação inicial
            // model.rotation.set(0, Math.PI, 0); // gira 180° no eixo Y

            if (gender === 'female') {
                model.rotation.set(0, Math.PI, 0);
            }

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
        }

        // Função fallback para criar modelo simples
        const createFallbackModel = (group, gnd) => {
            const geometry = new THREE.CapsuleGeometry(1, 1.5, 16, 100);
            const material = new THREE.MeshStandardMaterial({
                color: 0xFF69B4,
                roughness: 0.1,
                metalness: 0.1,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
        };

        loader.load(
            modelPath,
            gltf,
            undefined,
            (error) => {
                console.error(`Erro ao carregar modelo ${gender}:`, error);
                // Fallback: criar modelo simples se não carregar
                createFallbackModel(humanGroup, gender);
            }
        );



        // Posicionar o grupo todo
        humanGroup.position.y = 0;

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



        renderer.domElement.addEventListener(
            'mousedown',
            e => handleMouseDown(e, setIsDragging, setDragStart));

        renderer.domElement.addEventListener(
            'mousemove',
            e => handleMouseMove(e, rotationRef, isDragging, dragStart, setDragStart));

        renderer.domElement.addEventListener(
            'mouseup',
            e => handleMouseUp(setIsDragging, false));

        renderer.domElement.addEventListener(
            'mouseleave',
            e => handleMouseUp(setIsDragging, false));

        renderer.domElement.addEventListener(
            'wheel', e => handleMouseWheel(e, setZoomLevel, positionRef),
            { passive: false });

        window.addEventListener('keydown', e => handleKeyDown(e, positionRef));
        window.addEventListener('resize', e => handleResize(container, camera, renderer));

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
        rotationRef.current = { x: 0, y: 0 };
        positionRef.current = { x: 0, y: -1, z: 3 };
        setZoomLevel(zoomLevel);
    };

    // Funções para rotacionar
    const rotateModel = (direction, rotation) => {
        const rotSpeed = 0.2;
        switch (direction) {
            case 'up': rotation.current.x -= rotSpeed; break;
            case 'down': rotation.current.x += rotSpeed; break;
            case 'left': rotation.current.y -= rotSpeed; break;
            case 'right': rotation.current.y += rotSpeed; break;
            default: break;
        }
    };

    // Funções para mover
    const moveModel = (direction, position) => {
        const step = 0.2;
        switch (direction) {
            case 'up': position.current.y += step; break;
            case 'down': position.current.y -= step; break;
            case 'left': position.current.x -= step; break;
            case 'right': position.current.x += step; break;
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
                            className={`viewer-container ${isDragging ? 'grabbing' : 'grab'}`}
                        />
                        <small className="text-muted d-block text-center mt-2">
                            💡 Arraste para rotacionar • Setas do teclado para mover • Scroll para zoom
                        </small>

                        {/* Controles de Rotação */}
                        <div className="controls-container">
                            <p className="small text-muted mb-2 text-center">Controles de Rotação:</p>
                            <div className="controls-row mb-2">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => rotateModel('up', rotationRef)}
                                    title="Rotacionar para cima (eixo X)"
                                >
                                    <i className="bi bi-arrow-up"></i> Cima
                                </button>
                            </div>
                            <div className="controls-row">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => rotateModel('left')}
                                    title="Rotacionar para esquerda (eixo Y)"
                                >
                                    <i className="bi bi-arrow-left"></i> Esq
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => rotateModel('down')}
                                    title="Rotacionar para baixo (eixo X)"
                                >
                                    <i className="bi bi-arrow-down"></i> Baixo
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => rotateModel('right')}
                                    title="Rotacionar para direita (eixo Y)"
                                >
                                    <i className="bi bi-arrow-right"></i> Dir
                                </button>
                            </div>

                            {/* Botão Reset */}
                            <div className="controls-row mt-3">
                                <button
                                    className="btn btn-sm btn-outline-danger w-100"
                                    onClick={handleResetView}
                                    title="Resetar vista"
                                >
                                    <i className="bi bi-arrow-counterclockwise"></i> Resetar Vista
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Badges com Métricas em Tempo Real */}
                    <div className="col-12 col-lg-4">
                        <div className="badge-container">
                            {/* Altura */}
                            <div className="badge-item border border-primary">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted small fw-semibold">ALTURA</span>
                                    <i className="bi bi-diagram-3 text-primary"></i>
                                </div>
                                <div className="h4 text-primary fw-bold mb-0">
                                    {height} <span className="fs-6">cm</span>
                                </div>
                                <small className="text-muted">Padrão: 170cm</small>
                            </div>

                            {/* Peso */}
                            <div className="badge-item border border-success">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted small fw-semibold">PESO</span>
                                    <i className="bi bi-speedometer text-success"></i>
                                </div>
                                <div className="h4 text-success fw-bold mb-0">
                                    {weight} <span className="fs-6">kg</span>
                                </div>
                                <small className="text-muted">Padrão: 70kg</small>
                            </div>

                            {/* Cintura */}
                            <div className="badge-item border border-danger">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted small fw-semibold">CINTURA</span>
                                    <i className="bi bi-circle text-danger"></i>
                                </div>
                                <div className="h4 text-danger fw-bold mb-0">
                                    {waist} <span className="fs-6">cm</span>
                                </div>
                                <small className="text-muted">Padrão: 80cm</small>
                            </div>

                            {/* Peito/Tórax */}
                            {chest && (
                                <div className="badge-item border border-info">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted small fw-semibold">TÓRAX</span>
                                        <i className="bi bi-lungs text-info"></i>
                                    </div>
                                    <div className="h4 text-info fw-bold mb-0">
                                        {chest} <span className="fs-6">cm</span>
                                    </div>
                                    <small className="text-muted">Padrão: 90cm</small>
                                </div>
                            )}

                            {/* IMC */}
                            <div className={`badge-item border border-${imcStatus.color}`}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted small fw-semibold">IMC</span>
                                    <i className={`bi bi-heart-pulse text-${imcStatus.color}`}></i>
                                </div>
                                <div className={`h4 text-${imcStatus.color} fw-bold mb-1`}>{imc}</div>
                                <span className={`badge bg-${imcStatus.color}-light text-${imcStatus.color}`}>
                                    {imcStatus.label}
                                </span>
                            </div>

                            {/* Última Medição */}
                            {lastMeasurement && (
                                <div className="badge-item border border-secondary">
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

