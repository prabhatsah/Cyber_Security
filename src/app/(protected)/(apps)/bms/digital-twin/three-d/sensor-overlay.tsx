"use client"

import { useEffect, useState } from 'react'
import * as THREE from 'three'

export function SensorOverlay({ data, containerRef, camera, renderer }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (!data || !containerRef.current || !camera || !renderer) return
    
    // Update position based on 3D coordinates
    const updatePosition = () => {
      // If data has coordinates, use them to position the overlay
      if (data.coordinates) {
        const vector = new THREE.Vector3(
          data.coordinates.x,
          data.coordinates.y,
          data.coordinates.z
        )
        
        // Project 3D position to 2D screen coordinates
        vector.project(camera)
        
        // Convert to CSS coordinates
        const x = (vector.x * 0.5 + 0.5) * containerRef.current.clientWidth
        const y = (-(vector.y * 0.5) + 0.5) * containerRef.current.clientHeight
        
        setPosition({ x, y })
      }
    }
    
    // Update on render
    const onBeforeRender = () => {
      updatePosition()
    }
    
    renderer.beforeRender = onBeforeRender
    
    // Initial position update
    updatePosition()
    
    return () => {
      renderer.beforeRender = null
    }
  }, [data, containerRef, camera, renderer])
  
  if (!data) return null
  
  return (
    <div 
      className="absolute z-10 pointer-events-none bg-popover text-popover-foreground rounded-md shadow-md border p-2 text-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 10}px`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="font-medium">{data.name || data.title}</div>
      {data.type === 'incident' && (
        <div className="text-xs">
          <span className={`${
            data.severity === 'critical' 
              ? 'text-red-500' 
              : data.severity === 'warning'
              ? 'text-amber-500'
              : 'text-blue-500'
          }`}>
            {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}
          </span>
          <span> incident</span>
        </div>
      )}
      {data.type === 'sensor' && (
        <div className="text-xs">
          <span className={`${data.status === 'alert' ? 'text-red-500' : 'text-blue-500'}`}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </span>
          <span> {data.sensorType} sensor</span>
        </div>
      )}
      {data.type === 'equipment' && (
        <div className="text-xs">
          {data.system.charAt(0).toUpperCase() + data.system.slice(1)} system
        </div>
      )}
    </div>
  )
}