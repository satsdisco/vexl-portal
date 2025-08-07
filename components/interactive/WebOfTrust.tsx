'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'primary' | 'trusted' | 'extended' | 'potential';
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

interface WebOfTrustProps {
  nodes: Node[];
  connections: Connection[];
  interactive?: boolean;
  expandable?: boolean;
  showCalculation?: boolean;
}

export function WebOfTrust({ 
  nodes: initialNodes, 
  connections: initialConnections,
  interactive = true,
  expandable = true,
  showCalculation = true
}: WebOfTrustProps) {
  const [nodes, setNodes] = useState(initialNodes);
  const [connections, setConnections] = useState(initialConnections);
  const [expanded, setExpanded] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [networkSize, setNetworkSize] = useState(0);

  useEffect(() => {
    calculateNetworkSize();
  }, [nodes, connections]);

  const calculateNetworkSize = () => {
    const directConnections = nodes.filter(n => n.type === 'trusted').length;
    const extendedConnections = nodes.filter(n => n.type === 'extended').length;
    const potentialReach = directConnections * 250; // Average contacts per person
    setNetworkSize(directConnections + extendedConnections + potentialReach);
  };

  const expandNetwork = () => {
    if (!expandable || expanded) return;
    
    const newNodes: Node[] = [];
    const newConnections: Connection[] = [];
    
    // Add second-degree connections
    nodes.filter(n => n.type === 'trusted').forEach((trustedNode, index) => {
      for (let i = 0; i < 3; i++) {
        const newId = `extended-${trustedNode.id}-${i}`;
        const angle = (Math.PI * 2 * i) / 3 + index;
        newNodes.push({
          id: newId,
          label: 'Friend of Friend',
          x: trustedNode.x + Math.cos(angle) * 20,
          y: trustedNode.y + Math.sin(angle) * 20,
          type: 'extended'
        });
        newConnections.push({
          from: trustedNode.id,
          to: newId,
          strength: 0.5
        });
      }
    });
    
    setNodes([...nodes, ...newNodes]);
    setConnections([...connections, ...newConnections]);
    setExpanded(true);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'primary': return '#FFE500';
      case 'trusted': return '#4ADE80';
      case 'extended': return '#60A5FA';
      case 'potential': return '#9CA3AF';
      default: return '#6B7280';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-950 rounded-lg overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        {/* Connections */}
        {connections.map((conn, index) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke={conn.strength > 0.5 ? '#4ADE80' : '#60A5FA'}
              strokeWidth={conn.strength * 3}
              strokeOpacity={conn.strength}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => interactive && setSelectedNode(node.id)}
          >
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.type === 'primary' ? 25 : node.type === 'trusted' ? 20 : 15}
              fill={getNodeColor(node.type)}
              className={`${interactive ? 'hover:opacity-80' : ''} transition-opacity`}
              stroke={selectedNode === node.id ? '#FFE500' : 'none'}
              strokeWidth={3}
            />
            <text
              x={`${node.x}%`}
              y={`${node.y + 8}%`}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              className="pointer-events-none"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
      
      {/* Network Stats */}
      {showCalculation && (
        <motion.div 
          className="absolute top-4 left-4 bg-black/80 backdrop-blur p-4 rounded-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-yellow-400 text-sm font-bold mb-2">Network Reach</div>
          <div className="space-y-1 text-xs">
            <div className="text-gray-300">
              Direct: <span className="text-green-400 font-bold">
                {nodes.filter(n => n.type === 'trusted').length}
              </span>
            </div>
            {expanded && (
              <div className="text-gray-300">
                Extended: <span className="text-blue-400 font-bold">
                  {nodes.filter(n => n.type === 'extended').length}
                </span>
              </div>
            )}
            <div className="text-gray-300 border-t border-gray-700 pt-1 mt-1">
              Potential Reach: <span className="text-yellow-400 font-bold">
                ~{networkSize.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Expand Button */}
      {expandable && !expanded && (
        <motion.button
          className="absolute bottom-4 right-4 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={expandNetwork}
        >
          Expand Network →
        </motion.button>
      )}
      
      {/* Selected Node Info */}
      {selectedNode && interactive && (
        <motion.div
          className="absolute bottom-4 left-4 bg-black/80 backdrop-blur p-3 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-sm text-gray-300">
            Selected: <span className="text-yellow-400 font-bold">
              {nodes.find(n => n.id === selectedNode)?.label}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}