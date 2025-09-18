import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, Mail, AlertCircle, CheckCircle, X } from 'lucide-react';
import { friendsAPI } from '@/lib/api-simple';

interface AddFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFriendAdded: () => void;
}

export const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  open,
  onOpenChange,
  onFriendAdded
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Veuillez saisir une adresse email');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez saisir une adresse email valide');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await friendsAPI.sendFriendRequest(email.trim());

      if (response.success) {
        setSuccess('Demande d\'amitié envoyée avec succès !');
        setEmail('');
        onFriendAdded(); // Recharger la liste des amis
        // Fermer le dialog après 2 secondes
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError(response.error || 'Erreur lors de l\'envoi de la demande');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'envoi de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setError(null);
      setSuccess(null);
      onOpenChange(false);
    }
  };

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête avec titre et croix */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <h2 className="text-xl font-bold text-black">Ajouter un ami</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Messages d'erreur et de succès */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Boutons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading || !email.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Envoyer la demande
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
