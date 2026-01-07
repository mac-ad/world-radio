import { useRef, useEffect, useCallback } from 'react';

interface AudioWaveProps {
    isPlaying: boolean;
    analyserNode: AnalyserNode | null;
}

export function AudioWave({ isPlaying, analyserNode }: AudioWaveProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    // const dataArrayRef = useRef<Uint8Array | null>(null);

    const draw = useCallback(() => {
        // const canvas = canvasRef.current;
        // const ctx = canvas?.getContext('2d');
        
        // if (!canvas || !ctx || !analyserNode || !isPlaying) {
        //     return;
        // }

        // if (!dataArrayRef.current) {
        //     dataArrayRef.current = new Uint8Array(analyserNode.frequencyBinCount);
        // }

        // const dataArray = dataArrayRef.current;
        // analyserNode.getByteFrequencyData(dataArray);

        // const width = canvas.width;
        // const height = canvas.height;
        // const dpr = window.devicePixelRatio || 1;

        // ctx.clearRect(0, 0, width, height);

        // // Create gradient for the wave
        // const gradient = ctx.createLinearGradient(0, 0, width, 0);
        // gradient.addColorStop(0, '#ff6b6b');
        // gradient.addColorStop(0.5, '#4ecdc4');
        // gradient.addColorStop(1, '#ffe66d');

        // // Number of bars we want
        // const barCount = 64;
        // const barWidth = width / barCount;
        // const barGap = 1 * dpr;
        // const actualBarWidth = barWidth - barGap;
        
        // // Sample frequency data evenly
        // const step = Math.floor(dataArray.length / barCount);

        // ctx.fillStyle = gradient;

        // for (let i = 0; i < barCount; i++) {
        //     // Get frequency value and normalize it
        //     const dataIndex = i * step;
        //     const value = dataArray[dataIndex] / 255;
            
        //     // Apply some smoothing and minimum height
        //     const minHeight = 2 * dpr;
        //     const maxHeight = height * 0.9;
        //     const barHeight = Math.max(minHeight, value * maxHeight);
            
        //     // Center the bars vertically
        //     const x = i * barWidth;
        //     const y = (height - barHeight) / 2;
            
        //     // Draw rounded bar
        //     const radius = Math.min(actualBarWidth / 2, barHeight / 2);
        //     ctx.beginPath();
        //     ctx.roundRect(x, y, actualBarWidth, barHeight, radius);
        //     ctx.fill();
        // }

        // animationRef.current = requestAnimationFrame(draw);
    }, [analyserNode, isPlaying]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        if (isPlaying && analyserNode) {
            draw();
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            // Clear canvas when not playing
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, analyserNode, draw]);

    return (
        <canvas 
            ref={canvasRef} 
            className="audio-wave-canvas"
            aria-hidden="true"
        />
    );
}

