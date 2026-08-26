import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Lock, ShieldCheck, User, CheckCircle2, Clock, Smartphone, AlertCircle } from "lucide-react";
import { empleadoService } from "../services/empleadoService";
import { Employee } from "../types";

export default function CredencialDigital() {
  const { codigoQr } = useParams<{ codigoQr: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!codigoQr) return;
      setLoading(true);
      try {
        const emp = await empleadoService.buscarPorId(codigoQr);
        setEmployee(emp);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadEmployee();
  }, [codigoQr]);

  if (loading || !employee) {
    return (
      <div className="min-h-screen bg-[#0D1B2E] flex items-center justify-center p-6 text-white text-xs">
        <span>Cargando credencial digital...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A111E] flex flex-col items-center justify-center p-4 font-sans text-foreground">
      {/* Mobile Card Container (Simulating Smartphone Badge) */}
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Card Header */}
        <div className="bg-[#0D1B2E] text-white p-5 border-b-4 border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
                <Lock size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm font-mono tracking-wider">ROOM_911</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950/80 border border-emerald-600 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              ACTIVA
            </span>
          </div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-2">
            Credencial Oficial Farmacéutica BPF
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col items-center text-center bg-gradient-to-b from-white to-slate-50">
          {/* Photo / Avatar Placeholder */}
          <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-slate-400 mb-3 relative">
            <User size={44} />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
              <CheckCircle2 size={14} />
            </div>
          </div>

          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {employee.nombre} {employee.apellido}
          </h1>
          <p className="font-mono text-sm text-primary font-bold mt-0.5">{employee.id}</p>
          <p className="text-xs font-semibold text-slate-600 mt-1">{employee.cargo}</p>
          <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mt-1">
            {employee.departamento}
          </span>

          {/* QR Code Container with dynamic pulse */}
          <div className="mt-5 p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
            <QRCodeSVG
              value={employee.codigoQr || employee.id}
              size={170}
              level="H"
              bgColor="#ffffff"
              fgColor="#0D1117"
            />
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 font-bold">
              <Clock size={12} className="animate-spin" />
              <span>HORA SISTEMA: {time}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 leading-tight">
            Esta credencial digital es personal e intransferible. Válida exclusivamente para torniquetes autorizados.
          </p>
        </div>

        {/* Card Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-700">
            <ShieldCheck size={14} className="text-primary" />
            <span>Verificado bajo BPF & ISO 27001</span>
          </div>
        </div>
      </div>
    </div>
  );
}
