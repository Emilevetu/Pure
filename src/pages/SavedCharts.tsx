import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Trash2, 
  Eye,
  Loader2,
  Plus
} from 'lucide-react';

interface SavedChart {
  id: string;
  name: string;
  description?: string;
  birth_data?: {
    date?: string;
    time?: string;
    place?: string;
  };
  astro_interpretation?: any;
  planetary_positions?: any[];
  created_at: string;
  updated_at: string;
}

const SavedCharts: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedCharts();
    }
  }, [isAuthenticated]);

  const loadSavedCharts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userAPI.getSavedCharts();
      
      if (response.success && response.data) {
        console.log('📊 Données des thèmes chargées:', response.data);
        setCharts(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des thèmes');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des thèmes:', error);
      setError(error.message || 'Erreur lors du chargement des thèmes');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteChart = async (chartId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce thème astral ?')) {
      return;
    }

    try {
      // Ici vous devriez implémenter l'API de suppression
      // const response = await userAPI.deleteChart(chartId);
      // if (response.success) {
      //   setCharts(charts.filter(chart => chart.id !== chartId));
      // }
      
      // Pour l'instant, on simule la suppression
      setCharts(charts.filter(chart => chart.id !== chartId));
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleViewChart = (chart: SavedChart) => {
    navigate(`/chart/${chart.id}`);
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Chargement de vos thèmes astraux...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* En-tête */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold">Mes thèmes astraux</h1>
              <p className="text-muted-foreground text-lg">
                Retrouvez tous vos thèmes astraux sauvegardés
              </p>
              <Button onClick={() => navigate('/')} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Créer un nouveau thème
              </Button>
            </div>

            {/* Erreur */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Liste des thèmes */}
            {charts.length === 0 ? (
              <Card>
                <CardContent className="py-20 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun thème sauvegardé</h3>
                  <p className="text-muted-foreground mb-6">
                    Créez votre premier thème astral pour le voir apparaître ici
                  </p>
                  <Button onClick={() => navigate('/')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un thème
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {charts.map((chart) => (
                  <Card key={chart.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{chart.name}</CardTitle>
                          {chart.description && (
                            <CardDescription>{chart.description}</CardDescription>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {chart.created_at ? new Date(chart.created_at).getFullYear() : 'N/A'}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Informations de naissance */}
                      <div className="space-y-2 text-sm">
                        {chart.birth_data && (
                          <>
                            {chart.birth_data.date && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(chart.birth_data.date).toLocaleDateString('fr-FR')}</span>
                              </div>
                            )}
                            {chart.birth_data.time && (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{chart.birth_data.time}</span>
                              </div>
                            )}
                            {chart.birth_data.place && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{chart.birth_data.place}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Métadonnées */}
                      <div className="text-xs text-muted-foreground">
                        Créé le {chart.created_at ? formatDate(chart.created_at) : 'Date inconnue'}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewChart(chart)}
                          className="flex-1"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteChart(chart.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default SavedCharts;
