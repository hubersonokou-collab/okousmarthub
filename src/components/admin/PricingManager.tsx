import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Save, Loader2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  category: string;
  is_active: boolean;
}

interface ServicePrice {
  id: string;
  service_id: string;
  variant_name: string;
  price: number;
  description: string | null;
  is_active: boolean;
}

export function PricingManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [servicesRes, pricesRes] = await Promise.all([
      supabase.from("services").select("*").order("display_order"),
      supabase.from("service_prices").select("*"),
    ]);

    if (servicesRes.data) setServices(servicesRes.data);
    if (pricesRes.data) setServicePrices(pricesRes.data);
    setLoading(false);
  };

  const handleSavePrice = async () => {
    if (!editingService) return;
    setSaving(true);

    const { error } = await supabase
      .from("services")
      .update({ base_price: editingPrice })
      .eq("id", editingService.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prix",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Prix mis à jour avec succès",
      });
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...s, base_price: editingPrice } : s
        )
      );
      setEditingService(null);
    }
    setSaving(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      academique: "Académique",
      voyage: "Voyage",
      emploi: "Emploi",
      entreprise: "Entreprise",
      digital: "Digital",
      formation: "Formation",
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Tarifs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix de base</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{getCategoryLabel(service.category)}</TableCell>
                <TableCell>{formatPrice(service.base_price)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      service.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {service.is_active ? "Actif" : "Inactif"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingService(service);
                          setEditingPrice(service.base_price);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier le prix - {service.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Prix de base (FCFA)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(Number(e.target.value))}
                          />
                        </div>
                        <Button
                          onClick={handleSavePrice}
                          disabled={saving}
                          className="w-full"
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Enregistrer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
