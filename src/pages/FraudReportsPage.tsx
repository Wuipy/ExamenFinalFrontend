import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import FraudReportsList from "@/components/report/FraudReportsList";
import heroImage from "@/assets/hero-cyber.jpg";

const FraudReportsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 mt-20">
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div className="absolute inset-0 bg-gradient-hero opacity-95" />
          <div
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
            style={{ backgroundImage: `url(${heroImage})` }}
          />

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-6">
                <ClipboardList className="w-8 h-8 text-primary-foreground" />
              </div>

              <p className="text-sm sm:text-base uppercase tracking-[0.2em] text-primary-foreground/70 mb-3">
                LabCIBE-UNA
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Reportes de fraude
              </h1>

              <p className="text-base sm:text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
                Consulta los reportes de fraude registrados por la comunidad.
                La información proviene directamente del sistema del laboratorio.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="container mx-auto max-w-4xl">
            <FraudReportsList />

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/reportar-estafa"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Reportar un nuevo fraude
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FraudReportsPage;
