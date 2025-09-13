import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Loader2,
  Edit,
  Download,
  Share
} from 'lucide-react';
import ResultCard from '@/components/ResultCard';
import AIAstrologyAnalysis from '@/components/AIAstrologyAnalysis';

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

const ViewChart: React.FC = () => {
  const { chartId } = useParams<{ chartId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [chart, setChart] = useState<SavedChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chartId && isAuthenticated) {
      loadChart();
    }
  }, [chartId, isAuthenticated]);

  const loadChart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Récupérer tous les thèmes et trouver celui avec l'ID correspondant
      const response = await userAPI.getSavedCharts();
      
      if (response.success && response.data) {
        console.log('📊 Données des thèmes récupérées:', response.data);
        const foundChart = response.data.find((c: SavedChart) => c.id === chartId);
        if (foundChart) {
          console.log('🎯 Thème trouvé:', foundChart);
          setChart(foundChart);
        } else {
          console.log('❌ Thème non trouvé avec l\'ID:', chartId);
          setError('Thème astral non trouvé');
        }
      } else {
        setError(response.error || 'Erreur lors du chargement du thème');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors du chargement du thème');
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

  const handleEdit = () => {
    // Navigation vers une page d'édition (à implémenter)
    console.log('Éditer le thème:', chart?.id);
  };

  const handleDownload = () => {
    // Fonctionnalité de téléchargement (à implémenter)
    console.log('Télécharger le thème:', chart?.id);
  };

  const handleShare = () => {
    // Fonctionnalité de partage (à implémenter)
    console.log('Partager le thème:', chart?.id);
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
                  <p className="text-muted-foreground">Chargement du thème astral...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !chart) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold">Thème Astral Non Trouvé</h1>
                <Alert variant="destructive">
                  <AlertDescription>{error || 'Ce thème astral n\'existe pas ou a été supprimé.'}</AlertDescription>
                </Alert>
                <Button onClick={() => navigate('/charts')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour aux thèmes
                </Button>
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
          <div className="max-w-6xl mx-auto space-y-8">
            {/* En-tête avec navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/charts')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour aux thèmes</span>
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="mr-2 h-4 w-4" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Informations du thème */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{chart.name}</CardTitle>
                    {chart.description && (
                      <CardDescription className="text-base">{chart.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {chart.created_at ? new Date(chart.created_at).getFullYear() : 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informations de naissance */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date de naissance</p>
                      <p className="text-sm text-muted-foreground">
                        {chart.birth_data?.date ? new Date(chart.birth_data.date).toLocaleDateString('fr-FR') : 'Non disponible'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Heure de naissance</p>
                      <p className="text-sm text-muted-foreground">{chart.birth_data?.time || 'Non disponible'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Lieu de naissance</p>
                      <p className="text-sm text-muted-foreground">{chart.birth_data?.place || 'Non disponible'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Métadonnées */}
                <div className="text-sm text-muted-foreground">
                  <p>Créé le {chart.created_at ? formatDate(chart.created_at) : 'Date inconnue'}</p>
                  {chart.updated_at && chart.updated_at !== chart.created_at && (
                    <p>Modifié le {formatDate(chart.updated_at)}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Carte céleste */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">🌟 Carte Céleste</h2>
                <p className="text-muted-foreground">
                  Positions planétaires calculées par JPL Horizons
                </p>
              </div>
              
              <ResultCard birthData={chart.birth_data as any} astroData={chart.astro_interpretation} />
            </section>

            {/* Tableau des planètes */}
            {chart.planetary_positions && chart.planetary_positions.length > 0 && (
              <section className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">📊 Positions Planétaires</h3>
                  <p className="text-muted-foreground">
                    Données précises de la NASA
                  </p>
                </div>
                
              </section>
            )}

            {/* Analyse astrologique IA */}
            {chart.planetary_positions && chart.planetary_positions.length > 0 && (
              <section>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">🔮 Analyse Astrologique</h3>
                  <p className="text-muted-foreground">
                    Interprétation personnalisée par IA
                  </p>
                </div>
                
                <AIAstrologyAnalysis 
                  planetaryData={chart.planetary_positions} 
                  birthData={chart.birth_data as any} 
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ViewChart;
