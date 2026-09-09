'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MandiMapProps {
  mandiName: string;
  liveGateStatusText: string;
}

import { getMandiCoordinates, getTruckRoute } from '@/lib/mandiCoordinates';
export { getMandiCoordinates, getTruckRoute };

const MandiMap: React.FC<MandiMapProps> = ({ mandiName, liveGateStatusText }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid duplicate initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const coordinates = getMandiCoordinates(mandiName);
    const routeCoords = getTruckRoute(coordinates);

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: coordinates,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap high-definition tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // 1. Truck Route Approach Polyline (Glow + Primary Dashed Lane)
    L.polyline(routeCoords, {
      color: '#128C7E',
      weight: 9,
      opacity: 0.25,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    L.polyline(routeCoords, {
      color: '#075E54',
      weight: 4,
      opacity: 0.95,
      dashArray: '8, 8',
      lineCap: 'round',
    }).addTo(map);

    // 2. Custom Pulsating Marker for Gate #3 (Weighbridge Unloading)
    const gateIcon = L.divIcon({
      className: 'gate-marker-container',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
          <span style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: #34D399; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background: linear-gradient(135deg, #075E54, #128C7E); border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-4v10"/>
              <circle cx="7" cy="18" r="2"/>
              <circle cx="17" cy="18" r="2"/>
            </svg>
          </div>
          <div style="position: absolute; top: -26px; white-space: nowrap; background-color: #075E54; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.25); border: 1px solid #34D399; letter-spacing: 0.5px;">
            GATE #3
          </div>
        </div>
      `,
    });

    const gateMarker = L.marker(coordinates, { icon: gateIcon }).addTo(map);
    gateMarker.bindPopup(
      `<div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #111827;">
        <strong style="color: #075E54; font-size: 13px; display: block; margin-bottom: 2px;">Gate #3 (Weighbridge Inbound)</strong>
        <span>Designated express weighbridge entry for your e-Gate Pass.</span>
      </div>`
    );

    // 3. Start Point Marker (Truck Inbound Approach)
    const startIcon = L.divIcon({
      className: 'start-marker-container',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
          <div style="width: 22px; height: 22px; border-radius: 9999px; background-color: #0284C7; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 9px; font-weight: 900;">
            IN
          </div>
          <div style="position: absolute; bottom: -22px; white-space: nowrap; background-color: #ffffff; color: #1e293b; font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.2); border: 1px solid #cbd5e1;">
            Truck Inbound
          </div>
        </div>
      `,
    });

    L.marker(routeCoords[0], { icon: startIcon }).addTo(map);

    // Fit route bounds nicely
    const bounds = L.latLngBounds(routeCoords);
    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 17,
      animate: false,
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mandiName]);

  return (
    <div className="relative w-full h-full rounded-b-xl overflow-hidden bg-slate-100">
      {/* Map Container Ref */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />

      {/* Floating Badge on Bottom Corner */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-[340px] z-[400] pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl border border-emerald-500/30 flex items-center gap-2 text-xs text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-900 tracking-tight leading-snug">
            {liveGateStatusText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MandiMap;
