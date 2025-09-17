import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  const handleGoToOnboarding = () => {
    navigation.navigate('Onboarding' as never);
  };

  const handleGoToProfile = () => {
    navigation.navigate('Profile' as never);
  };

  const handleGoToFriends = () => {
    navigation.navigate('Friends' as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chaque humain est unique</Text>
          <Text style={styles.subtitle}>
            Découvrez votre thème astral personnalisé
          </Text>
        </View>

        {/* Sections principales */}
        <View style={styles.sections}>
          {/* Section Moi */}
          <TouchableOpacity style={styles.section} onPress={handleGoToOnboarding}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionEmoji}>🧘</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Moi</Text>
              <Text style={styles.sectionDescription}>
                Découvrez votre thème astral personnel
              </Text>
            </View>
            <Text style={styles.sectionArrow}>→</Text>
          </TouchableOpacity>

          {/* Section Mes proches */}
          <TouchableOpacity style={styles.section} onPress={handleGoToFriends}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionEmoji}>👥</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Mes proches</Text>
              <Text style={styles.sectionDescription}>
                Explorez les connexions astrales
              </Text>
            </View>
            <Text style={styles.sectionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Informations utilisateur */}
        <View style={styles.userInfo}>
          <Text style={styles.userText}>
            Connecté en tant que : {user?.email}
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navigation en bas */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navEmoji}>🏠</Text>
          <Text style={styles.navText}>Aujourd'hui</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleGoToFriends}>
          <Text style={styles.navEmoji}>👥</Text>
          <Text style={styles.navText}>Mes proches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleGoToProfile}>
          <Text style={styles.navEmoji}>👤</Text>
          <Text style={styles.navText}>Mon profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100, // Espace pour la navigation en bas
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  sections: {
    gap: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionEmoji: {
    fontSize: 24,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  userInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  userText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default HomeScreen;
