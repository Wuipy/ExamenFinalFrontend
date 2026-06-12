import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFraudReport } from "@/lib/fraudReportService";
import { cn } from "@/lib/utils";
import type {
  FraudFormErrors,
  FraudFormFields,
  FraudReportPayload,
} from "@/types/fraud";

const initialFields: FraudFormFields = {
  impostorDetails: "",
  contactInfo: "",
  comments: "",
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

const VALIDATION_SUMMARY_MESSAGE =
  "Complete todos los campos obligatorios antes de enviar el reporte.";

function validateForm(fields: FraudFormFields): FraudFormErrors {
  const errors: FraudFormErrors = {};

  if (!fields.impostorDetails.trim()) {
    errors.impostorDetails = "Los detalles del impostor son obligatorios.";
  }

  if (!fields.contactInfo.trim()) {
    errors.contactInfo = "El contacto es obligatorio.";
  }

  if (!fields.comments.trim()) {
    errors.comments = "Los comentarios del caso son obligatorios.";
  }

  return errors;
}

const fieldClassName =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const FraudReportForm = () => {
  const [fields, setFields] = useState<FraudFormFields>(initialFields);
  const [errors, setErrors] = useState<FraudFormErrors>({});
  const [validationSummary, setValidationSummary] = useState<string | null>(
    null
  );
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isLoading = submitStatus === "loading";

  const handleChange = (
    field: keyof FraudFormFields,
    value: string
  ) => {
    setFields((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }

    if (validationSummary) {
      setValidationSummary(null);
    }

    if (submitStatus === "success" || submitStatus === "error") {
      setSubmitStatus("idle");
      setSubmitError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(fields);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setValidationSummary(VALIDATION_SUMMARY_MESSAGE);
      return;
    }

    setValidationSummary(null);
    setSubmitStatus("loading");
    setSubmitError(null);

    const payload: FraudReportPayload = {
      impostorDetails: fields.impostorDetails.trim(),
      contactInfo: fields.contactInfo.trim(),
      comments: fields.comments.trim(),
    };

    try {
      await createFraudReport(payload);

      setFields(initialFields);
      setErrors({});
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el reporte. Intente nuevamente."
      );
    }
  };

  return (
    <Card className="border-border/60 bg-gradient-card shadow-medium">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
          Formulario de reporte
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Complete la información con el mayor detalle posible. Todos los
          campos son obligatorios.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {validationSummary ? (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{validationSummary}</p>
            </div>
          ) : null}

          <div className="space-y-2">
            <label
              htmlFor="impostorDetails"
              className="text-sm font-medium text-foreground"
            >
              Detalles del impostor
            </label>
            <textarea
              id="impostorDetails"
              name="impostorDetails"
              rows={4}
              value={fields.impostorDetails}
              onChange={(event) =>
                handleChange("impostorDetails", event.target.value)
              }
              disabled={isLoading}
              placeholder="Nombre, perfil, mensajes, enlaces u otra información relevante."
              required
              className={cn(
                fieldClassName,
                "min-h-28 resize-y",
                errors.impostorDetails && "border-destructive"
              )}
              aria-invalid={Boolean(errors.impostorDetails)}
              aria-describedby={
                errors.impostorDetails ? "impostorDetails-error" : undefined
              }
            />
            {errors.impostorDetails ? (
              <p
                id="impostorDetails-error"
                className="text-sm text-destructive"
              >
                {errors.impostorDetails}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contactInfo"
              className="text-sm font-medium text-foreground"
            >
              Número, correo o usuario desde donde contactó
            </label>
            <input
              id="contactInfo"
              name="contactInfo"
              type="text"
              value={fields.contactInfo}
              onChange={(event) =>
                handleChange("contactInfo", event.target.value)
              }
              disabled={isLoading}
              placeholder="Ej.: +506 8888-8888, usuario@correo.com o @usuario_red_social"
              required
              className={cn(
                fieldClassName,
                errors.contactInfo && "border-destructive"
              )}
              aria-invalid={Boolean(errors.contactInfo)}
              aria-describedby={
                errors.contactInfo ? "contactInfo-error" : undefined
              }
            />
            {errors.contactInfo ? (
              <p id="contactInfo-error" className="text-sm text-destructive">
                {errors.contactInfo}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="comments"
              className="text-sm font-medium text-foreground"
            >
              Comentarios del caso
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={5}
              value={fields.comments}
              onChange={(event) =>
                handleChange("comments", event.target.value)
              }
              disabled={isLoading}
              placeholder="Describa qué ocurrió, cuándo sucedió y cualquier detalle adicional."
              required
              className={cn(
                fieldClassName,
                "min-h-32 resize-y",
                errors.comments && "border-destructive"
              )}
              aria-invalid={Boolean(errors.comments)}
              aria-describedby={
                errors.comments ? "comments-error" : undefined
              }
            />
            {errors.comments ? (
              <p id="comments-error" className="text-sm text-destructive">
                {errors.comments}
              </p>
            ) : null}
          </div>

          {submitStatus === "loading" ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Enviando reporte...
            </div>
          ) : null}

          {submitStatus === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Su reporte fue enviado correctamente. Gracias por contribuir a
                la seguridad de la comunidad.
              </p>
            </div>
          ) : null}

          {submitStatus === "error" ? (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{submitError}</p>
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-full text-base font-semibold shadow-medium hover:shadow-lg sm:w-auto sm:px-10"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar reporte"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FraudReportForm;
