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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-muted/30 px-6 py-16 text-center"
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
        className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-5"
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
        className="rounded-lg border border-border bg-muted/30 px-6 py-16 text-center"
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

      <div className="grid gap-6">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="border-border/60 bg-gradient-card shadow-medium"
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Reporte #{report.id}
                </CardTitle>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0 text-primary" />
                  <span>{formatCreatedAt(report.createdAt)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <UserX className="h-4 w-4 shrink-0 text-primary" />
                  Detalles del impostor
                </div>
                <p className="whitespace-pre-wrap rounded-md bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground">
                  {report.impostorDetails}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  Contacto
                </div>
                <p className="rounded-md bg-muted/40 px-4 py-3 text-sm text-foreground">
                  {report.contactInfo}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
                  Comentarios
                </div>
                <p className="whitespace-pre-wrap rounded-md bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground">
                  {report.comments}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FraudReportsList;
