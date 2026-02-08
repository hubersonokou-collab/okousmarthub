import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useUploadDocument, validateFile } from "@/hooks/useDocuments";
import { DocumentTemplate } from "@/lib/documentTemplates";

interface DocumentUploadZoneProps {
    requestId: string;
    documentTemplate: DocumentTemplate;
    onUploadComplete?: () => void;
}

export default function DocumentUploadZone({
    requestId,
    documentTemplate,
    onUploadComplete,
}: DocumentUploadZoneProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const uploadMutation = useUploadDocument();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];

                // Validation
                const validation = validateFile(
                    file,
                    documentTemplate.maxSize || 10,
                    documentTemplate.acceptedFormats || ['PDF', 'JPG', 'PNG']
                );

                if (!validation.valid) {
                    alert(validation.error);
                    return;
                }

                setUploadedFile(file);
                handleUpload(file);
            }
        },
    });

    const handleUpload = async (file: File) => {
        setUploadProgress(0);

        // Simuler la progression (en production, utiliser un vrai feedback)
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            await uploadMutation.mutateAsync({
                file,
                documentType: documentTemplate.type,
                requestId,
            });

            setUploadProgress(100);
            onUploadComplete?.();
        } catch (error) {
            setUploadProgress(0);
            setUploadedFile(null);
        } finally {
            clearInterval(progressInterval);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setUploadProgress(0);
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-3">
                    {/* En-tête */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2">
                                {documentTemplate.label}
                                {documentTemplate.required && (
                                    <span className="text-xs text-red-500">*Obligatoire</span>
                                )}
                            </h4>
                            {documentTemplate.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {documentTemplate.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Zone de drop ou fichier uploadé */}
                    {!uploadedFile ? (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-300 hover:border-primary/50'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm font-medium mb-1">
                                {isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez ou cliquez'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Formats: {documentTemplate.acceptedFormats?.join(', ') || 'PDF, JPG, PNG'}
                                {' '}• Max: {documentTemplate.maxSize || 10} MB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Fichier uploadé */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    {uploadProgress === 100 ? (
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    ) : (
                                        <FileText className="h-8 w-8 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(uploadedFile.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                {uploadProgress < 100 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeFile}
                                        className="flex-shrink-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Progress bar */}
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <Progress value={uploadProgress} className="h-2" />
                            )}

                            {uploadProgress === 100 && (
                                <p className="text-xs text-green-600 text-center">
                                    ✓ Document téléversé avec succès
                                </p>
                            )}
                        </div>
                    )}

                    {/* Example */}
                    {documentTemplate.example && !uploadedFile && (
                        <p className="text-xs text-muted-foreground italic">
                            💡 Exemple: {documentTemplate.example}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
