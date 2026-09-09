'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Zap, Info } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface OfficerQrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onSimulateScan: () => void;
  simulatedPassCode?: string;
}

export const OfficerQrScanner: React.FC<OfficerQrScannerProps> = ({
  onScanSuccess,
  onSimulateScan,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraNotice, setCameraNotice] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'reader-qr-viewfinder';

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraNotice(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerContainerId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopCamera();
        },
        () => {
          // Ignore scanning frame errors
        }
      );
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn('Unable to start live camera:', err);
      setCameraNotice(
        'Optical Scanner in Standby • Click below to process incoming gate token'
      );
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full bg-white border border-slate-200 rounded p-4 text-slate-800 shadow-xs overflow-hidden">
      {/* Viewfinder Header */}
      <div className="w-full flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-sans">
            Optical Document & QR Viewport
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              type="button"
              onClick={stopCamera}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium hover:bg-rose-100 transition shadow-xs"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium hover:bg-slate-200 transition shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span>Live Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Optical Viewfinder Frame (Document-Scanner Viewport) */}
      <div className="relative w-full max-w-[280px] aspect-square bg-slate-100 rounded border border-slate-300 overflow-hidden flex items-center justify-center shadow-inner">
        {/* html5-qrcode target element */}
        <div
          id={scannerContainerId}
          className={`w-full h-full ${isCameraActive ? 'block' : 'hidden'}`}
        />

        {/* Official Document-Scanner Viewport Corner Brackets */}
        <div className="absolute inset-3 pointer-events-none rounded">
          {/* Top-Left Corner */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-blue-700" />
          {/* Top-Right Corner */}
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-blue-700" />
          {/* Bottom-Left Corner */}
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blue-700" />
          {/* Bottom-Right Corner */}
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-blue-700" />

          {/* Clean Optical Alignment Beam */}
          <div className="absolute left-1 right-1 h-0.5 bg-blue-600/60 top-1/2 -translate-y-1/2" />
        </div>

        {/* Static Viewfinder Placeholder when Camera is Idle */}
        {!isCameraActive && (
          <div className="flex flex-col items-center justify-center p-4 text-center z-10">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-600 mb-2 border border-slate-300 shadow-xs">
              <Camera className="w-6 h-6 text-slate-700" />
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Document Scanner Ready
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 max-w-[190px]">
              Position Gate Pass QR code within target brackets
            </p>
          </div>
        )}
      </div>

      {/* Optical Scanner Standby / Fallback notice if camera inactive or blocked */}
      {cameraNotice && (
        <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-center gap-1.5 max-w-[290px] text-center bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>{cameraNotice}</span>
        </div>
      )}

      {/* Clean Main Scan Button (Solid Govt Emerald Button) */}
      <div className="w-full mt-3 pt-3 border-t border-slate-200 flex flex-col items-center">
        <button
          type="button"
          onClick={onSimulateScan}
          className="w-full max-w-[320px] py-2.5 px-4 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition active:scale-98"
        >
          <Zap className="w-4 h-4 text-emerald-200" />
          <span>⚡ Scan Inbound QR Pass</span>
        </button>
      </div>
    </div>
  );
};
