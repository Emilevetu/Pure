import React, { useState } from 'react';
import { useAuth, useUser } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Star, Loader2 } from 'lucide-react';

interface SaveChartButtonProps {
  birthData: {
    date: string;
    time: string;
    place: string;
  };
  astroData: any;
  planetaryData: any[];
  className?: string;
}

export const SaveChartButton: React.FC<SaveChartButtonProps> = ({
  birthData,
  astroData,
  planetaryData,
  className
}) => {
  const { isAuthenticated } = useUser();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chartName, setChartName] = useState('');
  const [chartDescription, setChartDescription] = useState('');

  const handleSave = async () => {
    if (!chartName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre thème astral",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const chartData = {
        name: chartName.trim(),
        description: chartDescription.trim(),
        birthData,
        astroData,
        planetaryData,
        createdAt: new Date().toISOString(),
      };

      const response = await userAPI.saveChart(chartData);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Votre thème astral a été sauvegardé avec succès",
        });
        setIsDialogOpen(false);
        setChartName('');
        setChartDescription('');
      } else {
        throw new Error(response.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le thème astral",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginRedirect = () => {
    // Ici vous pourriez ouvrir un dialog de connexion ou rediriger
    toast({
      title: "Connexion requise",
      description: "Veuillez vous connecter pour sauvegarder vos thèmes astraux",
    });
  };

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        onClick={handleLoginRedirect}
        className={className}
      >
        <Star className="mr-2 h-4 w-4" />
        Se connecter pour sauvegarder
      </Button>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder ce thème
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sauvegarder votre thème astral</DialogTitle>
          <DialogDescription>
            Donnez un nom à votre thème astral pour le retrouver facilement plus tard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chartName">Nom du thème *</Label>
            <Input
              id="chartName"
              placeholder="Ex: Mon thème natal, Thème de naissance..."
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chartDescription">Description (optionnel)</Label>
            <Textarea
              id="chartDescription"
              placeholder="Ajoutez une description ou des notes personnelles..."
              value={chartDescription}
              onChange={(e) => setChartDescription(e.target.value)}
              disabled={isSaving}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !chartName.trim()}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
