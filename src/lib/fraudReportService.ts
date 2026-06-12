import { API_URL } from "@/lib/config";
import type { FraudReport, FraudReportPayload } from "@/types/fraud";

function getFraudsEndpoint(): string {
  if (!API_URL) {
    throw new Error(
      "La URL del backend no está configurada. Defina VITE_API_URL en Railway, Netlify o en su archivo .env."
    );
  }

  return `${API_URL}/api/Fraud`;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const errorBody = (await response.json()) as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (errorBody.message) {
      return errorBody.message;
    }

    if (errorBody.errors) {
      const firstError = Object.values(errorBody.errors)[0]?.[0];
      if (firstError) return firstError;
    }
  } catch {
    // Mantener mensaje genérico si la respuesta no es JSON.
  }

  return "No se pudo completar la solicitud. Intente nuevamente.";
}

export async function createFraudReport(
  data: FraudReportPayload
): Promise<FraudReport> {
  const response = await fetch(getFraudsEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<FraudReport>;
}

export async function getFraudReports(): Promise<FraudReport[]> {
  const response = await fetch(getFraudsEndpoint());

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<FraudReport[]>;
}
