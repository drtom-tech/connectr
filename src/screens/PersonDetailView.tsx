import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { getPeople, getEventsForPerson, createRelationship } from '../api/firebase';
import { Person, Event } from '../types';

interface PersonDetailViewProps {
  personId: string;
  onNavigateBack: () => void;
  onNavigateToEventDetail: (eventId: string) => void;
}

interface AddRelationshipModalProps {
  visible: boolean;
  onClose: () => void;
  onAddRelationship: (personId: string, type: string) => void;
}

function AddRelationshipModal({ visible, onClose, onAddRelationship }: AddRelationshipModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [relationshipType, setRelationshipType] = useState('Colleague');
  const [loading, setLoading] = useState(false);

  const relationshipTypes = ['Partner', 'Child', 'Parent', 'Sibling', 'Colleague', 'Friend', 'Other'];

  const handleCreateRelationship = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter first and last name');
      return;
    }

    setLoading(true);
    try {
      // For now, we'll create a new person and then create the relationship
      // In a real app, you'd have a search function to find existing people
      Alert.alert('Info', 'This feature will be implemented with person search');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create relationship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Relationship</Text>
          <TouchableOpacity
            onPress={handleCreateRelationship}
            disabled={loading}
          >
            <Text style={[styles.doneButton, loading && styles.doneButtonDisabled]}>
              {loading ? 'Adding...' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <Text style={styles.label}>Person's First Name *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />

          <Text style={styles.label}>Person's Last Name *</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />

          <Text style={styles.label}>Relationship Type</Text>
          <View style={styles.relationshipTypes}>
            {relationshipTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.relationshipTypeButton,
                  relationshipType === type && styles.relationshipTypeButtonSelected
                ]}
                onPress={() => setRelationshipType(type)}
              >
                <Text style={[
                  styles.relationshipTypeText,
                  relationshipType === type && styles.relationshipTypeTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function PersonDetailView({ 
  personId, 
  onNavigateBack, 
  onNavigateToEventDetail 
}: PersonDetailViewProps) {
  const [person, setPerson] = useState<Person | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [relationships, setRelationships] = useState<{person: Person, type: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRelationshipModal, setShowAddRelationshipModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'relationships'>('events');

  const loadPersonDetails = async () => {
    try {
      // For now, we'll get all people and find the one with matching ID
      // In a real app, you'd have a getPersonById function
      const people = await getPeople(''); // This will be filtered by user in the function
      const foundPerson = people.find(p => p.personID === personId);
      
      if (foundPerson) {
        setPerson(foundPerson);
        
        // Load events for this person
        const eventsData = await getEventsForPerson(personId);
        setEvents(eventsData);
        
        // Load relationships for this person
        // const relationshipsData = await getRelationshipsForPerson(personId);
        // setRelationships(relationshipsData);
      }
    } catch (error) {
      console.error('Error loading person details:', error);
      Alert.alert('Error', 'Failed to load person details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonDetails();
  }, [personId]);

  const handleAddRelationship = async (relatedPersonId: string, type: string) => {
    try {
      await createRelationship(personId, relatedPersonId, type);
      
      // Refresh relationships list
      // const relationshipsData = await getRelationshipsForPerson(personId);
      // setRelationships(relationshipsData);
      
      Alert.alert('Success', 'Relationship added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add relationship');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => onNavigateToEventDetail(item.eventID)}
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
      {item.location && (
        <Text style={styles.eventLocation}>📍 {item.location}</Text>
      )}
    </TouchableOpacity>
  );

  const renderRelationship = ({ item }: { item: {person: Person, type: string} }) => (
    <View style={styles.relationshipCard}>
      <Text style={styles.relationshipPerson}>
        {item.person.firstName} {item.person.lastName}
      </Text>
      <Text style={styles.relationshipType}>{item.type}</Text>
      {item.person.organization && (
        <Text style={styles.relationshipOrganization}>{item.person.organization}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading person details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!person) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Person not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Person Details</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.personInfo}>
          <Text style={styles.personName}>
            {person.firstName} {person.lastName}
          </Text>
          {person.organization && (
            <Text style={styles.personOrganization}>{person.organization}</Text>
          )}
          {person.contactInfo && (
            <Text style={styles.personContact}>📞 {person.contactInfo}</Text>
          )}
          {person.notes && (
            <Text style={styles.personNotes}>{person.notes}</Text>
          )}
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.activeTab]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
              Events ({events.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'relationships' && styles.activeTab]}
            onPress={() => setActiveTab('relationships')}
          >
            <Text style={[styles.tabText, activeTab === 'relationships' && styles.activeTabText]}>
              Relationships ({relationships.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'events' ? (
            <View style={styles.eventsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Event History</Text>
              </View>

              {events.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No events yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    This person hasn't been added to any events
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={events}
                  renderItem={renderEvent}
                  keyExtractor={(item) => item.eventID}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          ) : (
            <View style={styles.relationshipsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Relationships</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddRelationshipModal(true)}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>

              {relationships.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No relationships yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Tap "Add" to link this person to others
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={relationships}
                  renderItem={renderRelationship}
                  keyExtractor={(item) => item.person.personID}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          )}
        </View>
      </View>

      <AddRelationshipModal
        visible={showAddRelationshipModal}
        onClose={() => setShowAddRelationshipModal(false)}
        onAddRelationship={handleAddRelationship}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  personInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  personName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  personOrganization: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  personContact: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  personNotes: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    flex: 1,
  },
  eventsSection: {
    flex: 1,
  },
  relationshipsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  relationshipCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  relationshipPerson: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  relationshipType: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  relationshipOrganization: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  doneButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButtonDisabled: {
    color: '#ccc',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  relationshipTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  relationshipTypeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  relationshipTypeText: {
    fontSize: 14,
    color: '#666',
  },
  relationshipTypeTextSelected: {
    color: 'white',
  },
});


