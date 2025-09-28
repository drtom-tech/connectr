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
import { getEvents, getAttendeesForEvent, linkPersonToEvent, createPerson } from '../api/firebase';
import { Event, Person } from '../types';

interface EventDetailViewProps {
  eventId: string;
  onNavigateBack: () => void;
  onNavigateToPersonDetail: (personId: string) => void;
}

interface AddAttendeeModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPerson: (person: Person) => void;
}

function AddAttendeeModal({ visible, onClose, onAddPerson }: AddAttendeeModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePerson = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter first and last name');
      return;
    }

    setLoading(true);
    try {
      const personId = await createPerson({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        organization: organization.trim(),
        contactInfo: contactInfo.trim(),
        notes: notes.trim(),
      });

      const newPerson: Person = {
        personID: personId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        organization: organization.trim(),
        contactInfo: contactInfo.trim(),
        notes: notes.trim(),
        userId: '', // Will be set by Firebase
      };

      onAddPerson(newPerson);
      onClose();
      
      // Reset form
      setFirstName('');
      setLastName('');
      setOrganization('');
      setContactInfo('');
      setNotes('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create person');
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
          <Text style={styles.modalTitle}>Add Attendee</Text>
          <TouchableOpacity
            onPress={handleCreatePerson}
            disabled={loading}
          >
            <Text style={[styles.doneButton, loading && styles.doneButtonDisabled]}>
              {loading ? 'Adding...' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />

          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />

          <Text style={styles.label}>Organization</Text>
          <TextInput
            style={styles.input}
            value={organization}
            onChangeText={setOrganization}
            placeholder="Enter organization"
          />

          <Text style={styles.label}>Contact Info</Text>
          <TextInput
            style={styles.input}
            value={contactInfo}
            onChangeText={setContactInfo}
            placeholder="Enter contact information"
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter notes"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function EventDetailView({ 
  eventId, 
  onNavigateBack, 
  onNavigateToPersonDetail 
}: EventDetailViewProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);

  const loadEventDetails = async () => {
    try {
      // For now, we'll need to get all events and find the one with matching ID
      // In a real app, you'd have a getEventById function
      const events = await getEvents(''); // This will be filtered by user in the function
      const foundEvent = events.find(e => e.eventID === eventId);
      
      if (foundEvent) {
        setEvent(foundEvent);
        
        // Load attendees
        const attendeesData = await getAttendeesForEvent(eventId);
        setAttendees(attendeesData);
      }
    } catch (error) {
      console.error('Error loading event details:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const handleAddAttendee = async (person: Person) => {
    try {
      await linkPersonToEvent(person.personID, eventId);
      
      // Refresh attendees list
      const attendeesData = await getAttendeesForEvent(eventId);
      setAttendees(attendeesData);
      
      Alert.alert('Success', 'Attendee added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add attendee');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAttendee = ({ item }: { item: Person }) => (
    <TouchableOpacity
      style={styles.attendeeCard}
      onPress={() => onNavigateToPersonDetail(item.personID)}
    >
      <Text style={styles.attendeeName}>
        {item.firstName} {item.lastName}
      </Text>
      {item.organization && (
        <Text style={styles.attendeeOrganization}>{item.organization}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Event not found</Text>
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
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
          {event.location && (
            <Text style={styles.eventLocation}>📍 {event.location}</Text>
          )}
          {event.description && (
            <Text style={styles.eventDescription}>{event.description}</Text>
          )}
        </View>

        <View style={styles.attendeesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attendees ({attendees.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddAttendeeModal(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {attendees.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No attendees yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap "Add" to add attendees to this event
              </Text>
            </View>
          ) : (
            <FlatList
              data={attendees}
              renderItem={renderAttendee}
              keyExtractor={(item) => item.personID}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>

      <AddAttendeeModal
        visible={showAddAttendeeModal}
        onClose={() => setShowAddAttendeeModal(false)}
        onAddPerson={handleAddAttendee}
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
  eventInfo: {
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
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  attendeesSection: {
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
  attendeeCard: {
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
  attendeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  attendeeOrganization: {
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
  textArea: {
    height: 80,
  },
});


