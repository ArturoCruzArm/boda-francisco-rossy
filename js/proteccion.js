// ========================================
// PROTECCIÓN DE IMÁGENES - EVITAR DESCARGA
// ========================================

(function() {
    'use strict';

    // Deshabilitar clic derecho en imágenes e iframes
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'IFRAME' || e.target.closest('iframe')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, false);

    // Proteger iframes (video)
    function protegerIframes() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(function(iframe) {
            // Crear una capa transparente sobre el iframe para prevenir interacciones
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;';

            const parent = iframe.parentElement;
            if (parent && window.getComputedStyle(parent).position !== 'relative' && window.getComputedStyle(parent).position !== 'absolute') {
                parent.style.position = 'relative';
            }

            iframe.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        });
    }

    // Deshabilitar arrastrar imágenes
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, false);

    // Deshabilitar selección de imágenes
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, false);

    // Bloquear atajos de teclado comunes para guardar/copiar
    document.addEventListener('keydown', function(e) {
        // Bloquear Ctrl+S (guardar)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Bloquear F12 (herramientas de desarrollo)
        if (e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Bloquear Ctrl+Shift+I (inspector)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Bloquear Ctrl+Shift+C (selector de elementos)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Bloquear Ctrl+U (ver código fuente)
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, false);

    // Deshabilitar copiar imágenes
    document.addEventListener('copy', function(e) {
        const selection = window.getSelection();
        if (selection && selection.toString().length === 0) {
            // Probablemente intenta copiar una imagen
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, false);

    // Agregar protección cuando las imágenes se cargan
    function protegerImagenes() {
        const imagenes = document.querySelectorAll('img');
        imagenes.forEach(function(img) {
            // Prevenir arrastre
            img.setAttribute('draggable', 'false');

            // Agregar eventos específicos
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });

            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });

            img.addEventListener('mousedown', function(e) {
                // Prevenir arrastrar con clic y arrastre
                if (e.button === 0 || e.button === 2) {
                    e.preventDefault();
                }
            });
        });
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            protegerImagenes();
            protegerIframes();
        });
    } else {
        protegerImagenes();
        protegerIframes();
    }

    // Observar cambios en el DOM para proteger imágenes nuevas
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG') {
                        const img = node;
                        img.setAttribute('draggable', 'false');
                        img.addEventListener('contextmenu', function(e) {
                            e.preventDefault();
                            return false;
                        });
                        img.addEventListener('dragstart', function(e) {
                            e.preventDefault();
                            return false;
                        });
                    } else if (node.querySelector) {
                        const imgs = node.querySelectorAll('img');
                        imgs.forEach(function(img) {
                            img.setAttribute('draggable', 'false');
                            img.addEventListener('contextmenu', function(e) {
                                e.preventDefault();
                                return false;
                            });
                            img.addEventListener('dragstart', function(e) {
                                e.preventDefault();
                                return false;
                            });
                        });
                    }
                }
            });
        });
    });

    // Iniciar observación
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Protección de imágenes activada');
})();
