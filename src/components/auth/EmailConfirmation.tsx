import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft, Clock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface EmailConfirmationProps {
  email: string
  onConfirmed?: () => void
  onResend?: () => void
  onBackToForm?: () => void
}

export const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  email,
  onConfirmed,
  onResend,
  onBackToForm
}) => {
  const { toast } = useToast()
  const [isResending, setIsResending] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [lastResendTime, setLastResendTime] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [canResendTimer, setCanResendTimer] = useState(false)

  // Timer de cooldown entre les renvois
  useEffect(() => {
    if (lastResendTime) {
      const timer = setInterval(() => {
        const timeDiff = Math.ceil(60 - (Date.now() - lastResendTime.getTime()) / 1000)
        if (timeDiff <= 0) {
          setCanResendTimer(true)
          setTimeRemaining(60)
          clearInterval(timer)
        } else {
          setTimeRemaining(timeDiff)
        }
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [lastResendTime])

  // Vérifier automatiquement la confirmation
  useEffect(() => {
    const checkConfirmation = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        toast({
          title: "✅ Compte confirmé !",
          description: "Votre email a été vérifié avec succès.",
        })
        setTimeout(() => onConfirmed?.(), 1500)
      }
    }

    // Vérifier immédiatement puis toutes les 3 secondes
    checkConfirmation()
    const interval = setInterval(checkConfirmation, 3000)
    return () => clearInterval(interval)
  }, [onConfirmed, toast])

  const handleResendEmail = async () => {
    if (resendCount >= 3) {
      toast({
        title: "❌ Limite atteinte",
        description: "Vous avez atteint la limite de 3 renvois. Veuillez patienter ou contacter le support.",
        variant: "destructive"
      })
      return
    }

    if (!canResendTimer && lastResendTime) {
      toast({
        title: "⏳ Patientez",
        description: `Veuillez attendre ${timeRemaining} secondes avant de renvoyer un email.`,
        variant: "destructive"
      })
      return
    }

    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        console.error('Erreur lors du renvoi:', error)
        toast({
          title: "❌ Erreur",
          description: "Impossible de renvoyer l'email. Veuillez réessayer.",
          variant: "destructive"
        })
      } else {
        setResendCount(prev => prev + 1)
        setLastResendTime(new Date())
        setCanResendTimer(false)
        toast({
          title: "📧 Email envoyé !",
          description: "Un nouveau lien de confirmation a été envoyé à votre adresse email.",
        })
        onResend?.()
      }
    } catch (error) {
      console.error('Erreur inattendue:', error)
      toast({
        title: "❌ Erreur inattendue",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      })
    } finally {
      setIsResending(false)
    }
  }

  const canResend = resendCount < 3 && !isResending && (canResendTimer || !lastResendTime)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
        <Card className="border shadow-2xl">
          <CardHeader className="text-center pb-6">
            {/* Animation du logo email */}
            <div className="mx-auto mb-6 relative">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center animate-pulse">
                <Mail className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold mb-2">
              Vérifiez votre boîte email
            </CardTitle>
            <CardDescription className="text-base mb-4">
              Nous venons d'envoyer un lien de confirmation à :
            </CardDescription>
            <Badge variant="secondary" className="text-sm font-medium py-2 px-4">
              {email}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Instructions principales */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse"></div>
                <div className="text-sm">
                  <p className="font-medium text-primary mb-2">Étapes suivantes :</p>
                  <ol className="space-y-1 text-muted-foreground">
                    <li>1. Ouvrez votre boîte email</li>
                    <li>2. Cliquez sur le lien de confirmation</li>
                    <li>3. Vous serez automatiquement connecté</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Bouton de renvoi */}
            <div className="space-y-3">
              <Button 
                onClick={handleResendEmail}
                disabled={!canResend}
                variant={canResend ? "default" : "outline"}
                className="w-full h-12"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : !canResend && lastResendTime ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Renvoyer dans {timeRemaining}s
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Renvoyer l'email de confirmation
                  </>
                )}
              </Button>
              
              {/* Statistiques de renvoi */}
              {resendCount > 0 && (
                <div className="text-center text-xs text-muted-foreground bg-muted/50 rounded-lg py-2">
                  <p>Emails renvoyés : {resendCount}/3</p>
                  {lastResendTime && (
                    <p>Dernier envoi : {lastResendTime.toLocaleTimeString('fr-FR')}</p>
                  )}
                </div>
              )}
            </div>

            {/* Conseils d'aide */}
            <div className="bg-muted/50 border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-orange-700 mb-2">Email non reçu ?</p>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Vérifiez votre dossier <strong>spam/courrier indésirable</strong></li>
                    <li>• L'email peut prendre jusqu'à <strong>5 minutes</strong> à arriver</li>
                    <li>• Assurez-vous que l'adresse email est correcte</li>
                    <li>• Ajoutez <strong>noreply@pure.com</strong> à vos contacts</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bouton retour */}
            {onBackToForm && (
              <Button
                variant="ghost"
                onClick={onBackToForm}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au formulaire
              </Button>
            )}

            {/* Message automatique */}
            <div className="text-center text-xs text-muted-foreground bg-primary/5 rounded-lg py-3 px-4">
              <p>🔄 Vérification automatique en cours...</p>
              <p>Vous serez redirigé dès que votre email sera confirmé</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
