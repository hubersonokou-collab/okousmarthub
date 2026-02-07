import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AcademicRequestTracker } from "@/components/academic/AcademicRequestTracker";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AcademicTrackerPage = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <Button variant="ghost" asChild>
                            <Link to="/services/redaction-academique">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour au service
                            </Link>
                        </Button>
                    </div>

                    <AcademicRequestTracker />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AcademicTrackerPage;
