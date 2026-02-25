

// Controle de teclado para movimento
const handleKeyDown = (e, position) => {
    const step = 0.2;
    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            position.current.y += step;
            break;
        case 'ArrowDown':
            e.preventDefault();
            position.current.y -= step;
            break;
        case 'ArrowLeft':
            e.preventDefault();
            position.current.x -= step;
            break;
        case 'ArrowRight':
            e.preventDefault();
            position.current.x += step;
            break;
        default:
            break;
    }
};

// Mouse controls
const handleMouseDown = (e, setIsDraggingFn = () => { }, setDragStartFn = () => { }) => {
    setIsDraggingFn(true);
    setDragStartFn({ x: e.clientX, y: e.clientY });
};

const handleMouseMove = (e, rotation, isDragging, dragStart, setDragStartFn = () => { }) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) * 0.01;
    const deltaY = (e.clientY - dragStart.y) * 0.01;

    rotation.current.x += deltaY;
    rotation.current.y += deltaX;

    setDragStartFn({ x: e.clientX, y: e.clientY });
};

const handleMouseUp = (setIsDraggingFn = () => { }, isDragging = false) => {
    setIsDraggingFn(isDragging);
};

// Zoom com scroll do mouse
const handleMouseWheel = (e, setZoomLevelFn = () => { }, position) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    position.current.z = Math.max(1, Math.min(10, position.current.z + direction * zoomSpeed));
    setZoomLevelFn(3 / position.current.z);
};

// Handle resize
const handleResize = (container, camera, renderer) => {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};


export {
    handleKeyDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseWheel,
    handleResize
};