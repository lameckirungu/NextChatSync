import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { File, X, Upload, FileText, Image } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface DocumentUploadProps {
  label: string;
  documentType: string;
  applicationId: number;
  accept: string;
  maxSize: number; // in MB
  required?: boolean;
}

export function DocumentUpload({ 
  label, 
  documentType, 
  applicationId, 
  accept, 
  maxSize, 
  required = false 
}: DocumentUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSize * 1024 * 1024; // Convert to bytes
  
  // Fetch existing documents of this type
  const { data: documents = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: [`/api/applications/${applicationId}/documents`],
    enabled: !!applicationId,
  });
  
  // Filter documents by type
  const existingDocuments = documents.filter((doc: any) => 
    doc.file_name.toLowerCase().includes(documentType.toLowerCase())
  );
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      
      const response = await fetch(`/api/applications/${applicationId}/documents`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload document');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Document uploaded',
        description: 'Your document has been uploaded successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}/documents`] });
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive',
      });
    },
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check file size
    if (file.size > maxSizeBytes) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${maxSize}MB`,
        variant: 'destructive',
      });
      return;
    }
    
    // Upload the file
    uploadMutation.mutate(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeDocument = async (documentId: number) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      
      toast({
        title: 'Document removed',
        description: 'Your document has been removed successfully.',
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}/documents`] });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove document',
        variant: 'destructive',
      });
    }
  };
  
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return <FileText className="h-5 w-5 text-slate-500" />;
    } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-slate-500" />;
    } else {
      return <File className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div>
      <Label className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {existingDocuments.length > 0 ? (
        <div className="mt-2 space-y-2">
          {existingDocuments.map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
              <div className="flex items-center">
                {getFileIcon(doc.file_name)}
                <span className="ml-2 text-sm text-slate-700">{doc.file_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {doc.url && (
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View
                  </a>
                )}
                <button 
                  type="button"
                  onClick={() => removeDocument(doc.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Replace Document
          </Button>
        </div>
      ) : (
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-slate-600">
              <label htmlFor={documentType} className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500">
                <span>Upload a file</span>
                <input
                  id={documentType}
                  ref={fileInputRef}
                  name={documentType}
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleFileChange}
                  disabled={uploadMutation.isPending}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500">
              {accept.replace(/\./g, '').toUpperCase()} up to {maxSize}MB
            </p>
            {uploadMutation.isPending && (
              <div className="mt-2">
                <p className="text-sm text-primary-600">Uploading...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
