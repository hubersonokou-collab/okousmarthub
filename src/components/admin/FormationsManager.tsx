import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Formation {
    id: string;
    title: string;
    description: string | null;
    category: string;
    price: number;
    duration: string | null;
    image_url: string | null;
    sessions: any;
    is_active: boolean;
}

const categories = [
    { value: "bureautique", label: "Bureautique" },
    { value: "web", label: "Développement Web" },
    { value: "design", label: "Design Graphique" },
    { value: "marketing", label: "Marketing Digital" },
    { value: "data", label: "Data & IA" },
    { value: "gestion", label: "Gestion de Projet" },
];

export function FormationsManager() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Formation | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "bureautique",
        price: 0,
        duration: "",
        image_url: "",
        is_active: true,
    });
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: formations, isLoading } = useQuery({
        queryKey: ["admin-formations"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("formations")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Formation[];
        },
    });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast({ title: "Erreur", description: "Veuillez sélectionner une image", variant: "destructive" });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Erreur", description: "L'image ne doit pas dépasser 5MB", variant: "destructive" });
            return;
        }

        setUploading(true);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `formations/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("portfolio-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("portfolio-images")
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: urlData.publicUrl });
            setPreviewImage(urlData.publicUrl);
            toast({ title: "Image téléchargée avec succès" });
        } catch (error: any) {
            console.error("Upload error:", error);
            toast({ title: "Erreur lors du téléchargement", description: error.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image_url: "" });
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const { error } = await supabase.from("formations").insert({
                title: data.title,
                description: data.description || null,
                category: data.category,
                price: data.price,
                duration: data.duration || null,
                image_url: data.image_url || null,
                is_active: data.is_active,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
            toast({ title: "Formation ajoutée avec succès" });
            resetForm();
            setIsDialogOpen(false);
        },
        onError: (error) => {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
            const { error } = await supabase
                .from("formations")
                .update({
                    title: data.title,
                    description: data.description || null,
                    category: data.category,
                    price: data.price,
                    duration: data.duration || null,
                    image_url: data.image_url || null,
                    is_active: data.is_active,
                })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
            toast({ title: "Formation modifiée avec succès" });
            resetForm();
            setIsDialogOpen(false);
        },
        onError: (error) => {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("formations").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
            toast({ title: "Formation supprimée" });
        },
        onError: (error) => {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        },
    });

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category: "bureautique",
            price: 0,
            duration: "",
            image_url: "",
            is_active: true,
        });
        setEditingItem(null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleEdit = (item: Formation) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description || "",
            category: item.category,
            price: item.price,
            duration: item.duration || "",
            image_url: item.image_url || "",
            is_active: item.is_active,
        });
        setPreviewImage(item.image_url);
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Formations</h2>
                    <p className="text-sm text-muted-foreground">
                        Gérez le catalogue de formations
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une formation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">{editingItem ? "Modifier la formation" : "Nouvelle formation"}</DialogTitle>
                            <DialogDescription>
                                {editingItem ? "Modifiez les informations de la formation" : "Ajoutez une nouvelle formation au catalogue"}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-foreground">Titre *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="border-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-foreground">Catégorie</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger className="border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-foreground">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-foreground">Image de la formation</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4">
                                    {previewImage || formData.image_url ? (
                                        <div className="relative">
                                            <img
                                                src={previewImage || formData.image_url}
                                                alt="Aperçu"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground text-center">
                                                {uploading ? "Téléchargement en cours..." : "Cliquez pour sélectionner une image"}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu'à 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-foreground">Prix (FCFA)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                        className="border-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="text-foreground">Durée</Label>
                                    <Input
                                        id="duration"
                                        placeholder="Ex: 3 mois, 40h"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="border-border"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="is_active" className="text-foreground">Formation active</Label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending || uploading}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                >
                                    {editingItem ? "Modifier" : "Ajouter"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-4 bg-muted rounded w-3/4" />
                                <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : formations && formations.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {formations.map((item) => (
                        <Card key={item.id} className={`${!item.is_active ? "opacity-50" : ""} border-border`}>
                            {item.image_url && (
                                <div className="h-32 overflow-hidden rounded-t-lg">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base text-foreground">
                                            {item.title}
                                        </CardTitle>
                                        <Badge variant="secondary">{item.category}</Badge>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => deleteMutation.mutate(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-amber-600">{item.price.toLocaleString()} FCFA</span>
                                    {item.duration && <span className="text-muted-foreground">{item.duration}</span>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-8 text-center border-border">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune formation dans le catalogue</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Cliquez sur "Ajouter une formation" pour commencer
                    </p>
                </Card>
            )}
        </div>
    );
}
