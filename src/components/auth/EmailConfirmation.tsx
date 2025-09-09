import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface EmailConfirmationProps {
  email: string
  onConfirmed?: () => void
  onResend?: () => void
}

export const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  email,
  onConfirmed,
  onResend
}) => {
  const [isResending, setIsResending] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [lastResendTime, setLastResendTime] = useState<Date | null>(null)

  // Vérifier automatiquement la confirmation
  useEffect(() => {
    const checkConfirmation = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        onConfirmed?.()
      }
    }

    // Vérifier toutes les 5 secondes
    const interval = setInterval(checkConfirmation, 5000)
    return () => clearInterval(interval)
  }, [onConfirmed])

  const handleResendEmail = async () => {
    if (resendCount >= 3) {
      alert('Vous avez atteint la limite de renvoi d\'emails. Veuillez patienter.')
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
        alert('Erreur lors du renvoi de l\'email. Veuillez réessayer.')
      } else {
        setResendCount(prev => prev + 1)
        setLastResendTime(new Date())
        onResend?.()
      }
    } catch (error) {
      console.error('Erreur inattendue:', error)
    } finally {
      setIsResending(false)
    }
  }

  const canResend = resendCount < 3 && !isResending

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Vérifiez votre email</CardTitle>
        <CardDescription>
          Nous avons envoyé un lien de confirmation à
        </CardDescription>
        <Badge variant="outline" className="mt-2">
          {email}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>Cliquez sur le lien dans l'email pour activer votre compte.</p>
          <p className="mt-2">
            <strong>Astuce :</strong> Vérifiez aussi vos spams !
          </p>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleResendEmail}
            disabled={!canResend}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Renvoyer l'email
              </>
            )}
          </Button>
          
          {resendCount > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              <p>Emails renvoyés : {resendCount}/3</p>
              {lastResendTime && (
                <p>Dernier envoi : {lastResendTime.toLocaleTimeString()}</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Pas reçu l'email ?</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Vérifiez votre dossier spam</li>
                <li>• L'email peut prendre quelques minutes</li>
                <li>• Vérifiez l'adresse email</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Une fois confirmé, vous serez automatiquement connecté.</p>
        </div>
      </CardContent>
    </Card>
  )
}
