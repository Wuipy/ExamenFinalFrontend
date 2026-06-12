import { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Loader2,
  MessageSquare,
  Phone,
  ShieldAlert,
  UserX,
} from "lucide-react";

import { getFraudReports } from "@/lib/fraudReportService";
import type { FraudReport } from "@/types/fraud";

type LoadStatus = "loading" | "success" | "error";

function formatCreatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function ReportField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserX;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        {label}
      </div>
      <p className="whitespace-pre-wrap rounded-md bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground">
        {value}
      </p>
    </div>
  );
}

function MobileReportCard({ report }: { report: FraudReport }) {
  return (
    <article className="rounded-xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-border/60 pb-4">
        <p className="text-sm font-semibold text-foreground">
          Reporte #{report.id}
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
          <time dateTime={report.createdAt}>
            {formatCreatedAt(report.createdAt)}
          </time>
        </div>
      </div>

      <div className="space-y-4">
        <ReportField
          icon={UserX}
          label="Detalles del impostor"
          value={report.impostorDetails}
        />
        <ReportField icon={Phone} label="Contacto" value={report.contactInfo} />
        <ReportField
          icon={MessageSquare}
          label="Comentarios"
          value={report.comments.trim() || "Sin comentarios"}
        />
      </div>
    </article>
  );
}

const FraudReportsList = () => {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      setStatus("loading");
      setErrorMessage(null);

      try {
        const data = await getFraudReports();

        if (isMounted) {
          setReports(data);
          setStatus("success");
        }
      } catch (error) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar los reportes. Intente nuevamente."
          );
        }
      }
    }

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/30 px-6 py-16 text-center"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-base font-medium text-foreground">
          Cargando reportes...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-5"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div>
          <p className="font-medium text-destructive">
            Error al cargar reportes
          </p>
          <p className="mt-1 text-sm text-destructive/90">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-border bg-muted/30 px-6 py-16 text-center"
      >
        <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground">
          No hay reportes registrados
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Cuando se reciban reportes de fraude, aparecerán listados aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {reports.length}{" "}
        {reports.length === 1 ? "reporte registrado" : "reportes registrados"}
      </p>

      <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card shadow-soft md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40">
                <th className="px-5 py-4 font-semibold text-foreground">#</th>
                <th className="px-5 py-4 font-semibold text-foreground">
                  Detalles del impostor
                </th>
                <th className="px-5 py-4 font-semibold text-foreground">
                  Contacto
                </th>
                <th className="px-5 py-4 font-semibold text-foreground">
                  Comentarios
                </th>
                <th className="px-5 py-4 font-semibold text-foreground">
                  Fecha de creación
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-border/40 align-top last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 font-medium text-foreground">
                    {report.id}
                  </td>
                  <td className="max-w-xs px-5 py-4 whitespace-pre-wrap text-foreground">
                    {report.impostorDetails}
                  </td>
                  <td className="max-w-[180px] px-5 py-4 text-foreground">
                    {report.contactInfo}
                  </td>
                  <td className="max-w-sm px-5 py-4 whitespace-pre-wrap text-foreground">
                    {report.comments.trim() || (
                      <span className="text-muted-foreground italic">
                        Sin comentarios
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <time dateTime={report.createdAt}>
                      {formatCreatedAt(report.createdAt)}
                    </time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {reports.map((report) => (
          <MobileReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
};

export default FraudReportsList;
