// ==UserScript==
// @name         Twitter Video Modal Hover
// @namespace    http://tampermonkey.net/
// @version      6.3
// @description  Twitter videolarını hover ile modal'da büyüt
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function initScript() {
        console.log('🎥 Twitter Video Modal initializing...');

        const style = document.createElement('style');
        style.textContent = `
            .video-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 9999;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .video-modal-overlay.active {
                display: flex;
                opacity: 1;
            }

            .video-modal-container {
                position: relative;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .video-modal-overlay.active .video-modal-container {
                transform: scale(1);
            }

            .video-modal-content {
                position: relative;
                background: #000;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 0 60px rgba(0, 0, 0, 0.8);
            }

            .video-modal-canvas {
                display: block;
                max-width: 90vw;
                max-height: 90vh;
                border-radius: 12px;
            }

            .video-modal-close {
                position: absolute;
                top: -50px;
                right: 0;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 10px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                z-index: 10000;
            }

            .video-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }

            .video-hover-indicator {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(29, 155, 240, 0.9);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
                z-index: 10;
                backdrop-filter: blur(10px);
            }

            .video-hover-active .video-hover-indicator {
                opacity: 1;
            }

            .video-modal-controls {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 15px;
                align-items: center;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 20px;
                border-radius: 30px;
                backdrop-filter: blur(10px);
            }

            .video-modal-play-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.2s;
            }

            .video-modal-play-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .video-modal-time {
                color: white;
                font-size: 14px;
                font-family: monospace;
            }
        `;
        document.head.appendChild(style);

        // Modal overlay oluştur
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'video-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="video-modal-container">
                <button class="video-modal-close">✕</button>
                <div class="video-modal-content">
                    <canvas class="video-modal-canvas"></canvas>
                    <div class="video-modal-controls">
                        <button class="video-modal-play-btn">▶</button>
                        <span class="video-modal-time">0:00 / 0:00</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        const modalContent = modalOverlay.querySelector('.video-modal-content');
        const canvas = modalOverlay.querySelector('.video-modal-canvas');
        const ctx = canvas.getContext('2d');
        const closeBtn = modalOverlay.querySelector('.video-modal-close');
        const playBtn = modalOverlay.querySelector('.video-modal-play-btn');
        const timeDisplay = modalOverlay.querySelector('.video-modal-time');

        let hoverTimeout;
        let animationId = null;
        let sourceVideo = null;
        const processedContainers = new WeakSet();

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function drawVideoToCanvas() {
            if (!sourceVideo || !modalOverlay.classList.contains('active')) {
                return;
            }

            try {
                ctx.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);

                const current = formatTime(sourceVideo.currentTime);
                const duration = formatTime(sourceVideo.duration || 0);
                timeDisplay.textContent = `${current} / ${duration}`;

                playBtn.textContent = sourceVideo.paused ? '▶' : '⏸';

                animationId = requestAnimationFrame(drawVideoToCanvas);
            } catch (e) {
                console.log('Draw error:', e);
            }
        }

        function closeModal() {
            modalOverlay.classList.remove('active');

            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            sourceVideo = null;
        }

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sourceVideo) {
                if (sourceVideo.paused) {
                    sourceVideo.play();
                } else {
                    sourceVideo.pause();
                }
            }
        });

        canvas.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sourceVideo) {
                if (sourceVideo.paused) {
                    sourceVideo.play();
                } else {
                    sourceVideo.pause();
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }

            if (e.key === ' ' && modalOverlay.classList.contains('active')) {
                e.preventDefault();
                if (sourceVideo) {
                    if (sourceVideo.paused) {
                        sourceVideo.play();
                    } else {
                        sourceVideo.pause();
                    }
                }
            }
        });

        function enlargeVideo(video) {
            try {
                console.log('🎬 Enlarging video...');
                sourceVideo = video;

                const maxWidth = window.innerWidth * 0.9;
                const maxHeight = window.innerHeight * 0.9;

                let width = video.videoWidth || 1280;
                let height = video.videoHeight || 720;
                const aspectRatio = width / height;

                width = width * 2;
                height = height * 2;

                if (width > maxWidth) {
                    width = maxWidth;
                    height = width / aspectRatio;
                }
                if (height > maxHeight) {
                    height = maxHeight;
                    width = height * aspectRatio;
                }

                canvas.width = width;
                canvas.height = height;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';

                modalOverlay.classList.add('active');

                drawVideoToCanvas();

                video.muted = false;

            } catch (error) {
                console.error('Enlarge video error:', error);
            }
        }

        function waitForVideo(container, callback, maxAttempts = 10) {
            let attempts = 0;

            const checkVideo = () => {
                attempts++;
                const video = container.querySelector('video');

                if (video) {
                    console.log('✅ Video element found after', attempts, 'attempts');
                    callback(video);
                } else if (attempts < maxAttempts) {
                    setTimeout(checkVideo, 200);
                } else {
                    console.log('⚠️ Video element not found after', maxAttempts, 'attempts');
                }
            };

            checkVideo();
        }

        function attachHoverListener(videoContainer) {
            if (processedContainers.has(videoContainer)) {
                return;
            }
            processedContainers.add(videoContainer);

            console.log('🔧 Setting up hover listener for container');

            const indicator = document.createElement('div');
            indicator.className = 'video-hover-indicator';
            indicator.textContent = 'Wait to enlarge ▶';
            videoContainer.style.position = 'relative';
            videoContainer.appendChild(indicator);

            videoContainer.addEventListener('mouseenter', function(e) {
                console.log('🖱️ Mouse entered video container');
                videoContainer.classList.add('video-hover-active');
                clearTimeout(hoverTimeout);

                hoverTimeout = setTimeout(() => {
                    console.log('⏰ Hover timeout triggered');

                    waitForVideo(videoContainer, (video) => {
                        console.log('🎬 Video ready, enlarging...');
                        enlargeVideo(video);
                    });
                }, 800);
            }, true);

            videoContainer.addEventListener('mouseleave', function(e) {
                console.log('🖱️ Mouse left video container');
                videoContainer.classList.remove('video-hover-active');
                clearTimeout(hoverTimeout);
            }, true);
        }

        function findVideos() {
            const videoContainers = document.querySelectorAll('[data-testid="videoComponent"]');
            console.log(`🔍 Found ${videoContainers.length} video containers`);

            videoContainers.forEach((container) => {
                attachHoverListener(container);
            });
        }

        setTimeout(() => {
            console.log('🚀 Initial video search...');
            findVideos();
        }, 2000);

        let observerTimeout;
        const observer = new MutationObserver((mutations) => {
            clearTimeout(observerTimeout);
            observerTimeout = setTimeout(() => {
                const hasNewNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
                if (hasNewNodes) {
                    findVideos();
                }
            }, 500);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('🎥 Twitter Video Modal Hover loaded successfully!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();
