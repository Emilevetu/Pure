import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { EmailConfirmation } from '@/components/auth/EmailConfirmation';

export const EmailConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pure</h1>
          <p className="text-gray-600">Votre guide personnel vers les étoiles</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              🎉 Compte créé avec succès !
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">
              Votre compte Pure a été créé. Il ne reste plus qu'une étape...
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {email && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Un email de confirmation a été envoyé à :
                </p>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {email}
                </Badge>
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-2">
                    📧 Vérifiez votre boîte email
                  </p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Cliquez sur le lien de confirmation dans l'email</li>
                    <li>• Vérifiez aussi votre dossier spam/courrier indésirable</li>
                    <li>• L'email peut prendre 2-3 minutes à arriver</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-900 mb-1">
                    ⚠️ Pas reçu l'email ?
                  </p>
                  <p className="text-yellow-800">
                    Vérifiez votre dossier spam ou cliquez sur "Renvoyer l'email" ci-dessous.
                  </p>
                </div>
              </div>
            </div>

            {email && (
              <EmailConfirmation 
                email={email}
                onConfirmed={() => {
                  navigate('/profile');
                }}
                onResend={() => {
                  // Optionnel : afficher un toast de succès
                }}
              />
            )}

            <div className="pt-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>
                Une fois votre email confirmé, vous pourrez accéder à toutes les fonctionnalités de Pure !
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
