import { CityData } from './cities';

/**
 * Convertit une heure locale en UTC en utilisant le timezone de la ville
 * @param localTime - Heure locale au format "HH:MM" (ex: "11:00")
 * @param date - Date au format "YYYY-MM-DD" (ex: "2002-10-03")
 * @param city - Objet CityData contenant le timezone
 * @returns Heure UTC au format "HH:MM" (ex: "10:00")
 */
export function convertLocalToUTC(
  localTime: string, 
  date: string, 
  city: CityData
): string {
  try {
    // Créer une date locale avec le timezone de la ville
    const localDateTime = new Date(`${date}T${localTime}:00`);
    
    // Utiliser Intl.DateTimeFormat pour obtenir l'offset UTC
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: city.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Créer une date UTC équivalente
    const utcDate = new Date(localDateTime.toLocaleString('en-CA', { timeZone: 'UTC' }));
    const localDate = new Date(localDateTime.toLocaleString('en-CA', { timeZone: city.timezone }));
    
    // Calculer la différence en heures
    const offsetHours = (utcDate.getTime() - localDate.getTime()) / (1000 * 60 * 60);
    
    // Appliquer l'offset pour obtenir l'heure UTC
    const utcTime = new Date(localDateTime.getTime() - (offsetHours * 60 * 60 * 1000));
    
    // Retourner au format HH:MM
    return utcTime.toISOString().substring(11, 16);
    
  } catch (error) {
    console.error('Erreur lors de la conversion timezone:', error);
    // Fallback : retourner l'heure locale si la conversion échoue
    return localTime;
  }
}

/**
 * Convertit une heure locale en UTC en utilisant le timezone de la ville (méthode simplifiée)
 * @param localTime - Heure locale au format "HH:MM" (ex: "11:00")
 * @param date - Date au format "YYYY-MM-DD" (ex: "2002-10-03")
 * @param city - Objet CityData contenant le timezone
 * @returns Objet avec l'heure UTC et les informations de conversion
 */
export function convertLocalToUTCSimple(
  localTime: string, 
  date: string, 
  city: CityData
): { utcTime: string; offsetHours: number; timezone: string } {
  try {
    // Créer une date locale avec le timezone de la ville
    const localDateTime = new Date(`${date}T${localTime}:00`);
    
    // Obtenir l'offset UTC pour cette date et timezone
    const utcTime = new Date(localDateTime.toLocaleString('en-CA', { timeZone: 'UTC' }));
    const localTimeInTimezone = new Date(localDateTime.toLocaleString('en-CA', { timeZone: city.timezone }));
    
    // Calculer l'offset en heures
    const offsetMs = localTimeInTimezone.getTime() - utcTime.getTime();
    const offsetHours = offsetMs / (1000 * 60 * 60);
    
    // Appliquer l'offset pour obtenir l'heure UTC
    const finalUTCTime = new Date(localDateTime.getTime() - offsetMs);
    
    return {
      utcTime: finalUTCTime.toISOString().substring(11, 16),
      offsetHours: Math.round(offsetHours * 100) / 100,
      timezone: city.timezone
    };
    
  } catch (error) {
    console.error('Erreur lors de la conversion timezone:', error);
    return {
      utcTime: localTime,
      offsetHours: 0,
      timezone: city.timezone
    };
  }
}

/**
 * Obtient le timezone d'une ville par son nom
 * @param cityName - Nom de la ville (ex: "Paris, France")
 * @param cities - Liste des villes
 * @returns Timezone de la ville ou "Europe/Paris" par défaut
 */
export function getCityTimezone(cityName: string, cities: CityData[]): string {
  const city = cities.find(c => c.name === cityName);
  return city?.timezone || 'Europe/Paris';
}

/**
 * Valide qu'un timezone est valide
 * @param timezone - Timezone à valider
 * @returns true si le timezone est valide
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

