'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label?: string;
  type: 'user' | 'contact' | 'extended';
  connections: string[];
}

interface NetworkVisualizationProps {
  interactive?: boolean;
  showLabels?: boolean;
  className?: string;
}

export default function NetworkVisualization({
  interactive = true,
  showLabels = false,
  className = ""
}: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Initialize nodes
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    
    const initialNodes: Node[] = [
      // Central user node
      {
        id: 'user',
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        radius: 20,
        color: vexlBrand.colors.primary.yellow,
        label: 'You',
        type: 'user',
        connections: ['contact1', 'contact2', 'contact3', 'contact4']
      }
    ];

    // First degree connections
    const firstDegree = 4;
    for (let i = 0; i < firstDegree; i++) {
      const angle = (i / firstDegree) * Math.PI * 2;
      const distance = 100;
      initialNodes.push({
        id: `contact${i + 1}`,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 15,
        color: vexlBrand.colors.semantic.success,
        label: `Friend ${i + 1}`,
        type: 'contact',
        connections: [`extended${i * 3 + 1}`, `extended${i * 3 + 2}`, `extended${i * 3 + 3}`]
      });
    }

    // Second degree connections
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 180 + Math.random() * 40;
      initialNodes.push({
        id: `extended${i + 1}`,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 10,
        color: vexlBrand.colors.gray[600],
        type: 'extended',
        connections: []
      });
    }

    setNodes(initialNodes);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = vexlBrand.colors.primary.black;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update node positions (simple physics simulation)
      initialNodes.forEach(node => {
        if (node.type === 'user') return; // Keep user node centered

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;

        // Apply damping
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Apply centering force
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
          node.vx += (dx / distance) * 0.01;
          node.vy += (dy / distance) * 0.01;
        }

        // Bounce off edges
        if (node.x < node.radius || node.x > canvas.offsetWidth - node.radius) {
          node.vx *= -0.8;
          node.x = Math.max(node.radius, Math.min(canvas.offsetWidth - node.radius, node.x));
        }
        if (node.y < node.radius || node.y > canvas.offsetHeight - node.radius) {
          node.vy *= -0.8;
          node.y = Math.max(node.radius, Math.min(canvas.offsetHeight - node.radius, node.y));
        }

        // Repel from other nodes
        initialNodes.forEach(other => {
          if (other.id === node.id) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = node.radius + other.radius + 30;
          if (distance < minDistance && distance > 0) {
            const force = (minDistance - distance) / distance * 0.02;
            node.vx -= (dx / distance) * force;
            node.vy -= (dy / distance) * force;
          }
        });
      });

      // Draw connections
      ctx.strokeStyle = vexlBrand.colors.gray[800];
      ctx.lineWidth = 1;
      initialNodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = initialNodes.find(n => n.id === targetId);
          if (target) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      initialNodes.forEach(node => {
        // Glow effect for hovered node
        if (hoveredNode === node.id) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3);
          gradient.addColorStop(0, node.color + '40');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw node
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw label if enabled
        if (showLabels && node.label) {
          ctx.fillStyle = vexlBrand.colors.gray[400];
          ctx.font = '12px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + node.radius + 15);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let foundNode = null;
      initialNodes.forEach(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.radius + 10) {
          foundNode = node.id;
          // Add force away from mouse
          node.vx += (dx / distance) * 2;
          node.vy += (dy / distance) * 2;
        }
      });
      setHoveredNode(foundNode);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [interactive, showLabels, hoveredNode]);

  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Overlay Info */}
      <motion.div 
        className="absolute top-4 left-4 bg-black/80 backdrop-blur rounded-lg p-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vexlBrand.colors.primary.yellow }}></div>
            <span className="text-gray-400">You</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vexlBrand.colors.semantic.success }}></div>
            <span className="text-gray-400">Direct contacts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vexlBrand.colors.gray[600] }}></div>
            <span className="text-gray-400">Extended network</span>
          </div>
        </div>
      </motion.div>

      {interactive && (
        <motion.div 
          className="absolute bottom-4 right-4 bg-black/80 backdrop-blur rounded-lg px-4 py-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-xs text-gray-400">Move your mouse to interact</span>
        </motion.div>
      )}
    </div>
  );
}