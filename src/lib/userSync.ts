import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from './firebase';
import { deleteUser } from 'firebase/auth';
import { UserProfile } from '../types';

export async function fetchUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, path);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveUserProfileToFirestore(uid: string, profile: UserProfile): Promise<void> {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, path);
    await setDoc(docRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveWordToFirestore(uid: string, wordData: any): Promise<void> {
  const wordId = wordData.id || `word_${Date.now()}`;
  const path = `users/${uid}/savedWords/${wordId}`;
  try {
    const docRef = doc(db, path);
    await setDoc(docRef, {
      ...wordData,
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveChallengeAttemptToFirestore(uid: string, attemptData: any): Promise<void> {
  const challengeId = `ch_${Date.now()}`;
  const path = `users/${uid}/challenges/${challengeId}`;
  try {
    const docRef = doc(db, path);
    await setDoc(docRef, {
      ...attemptData,
      userId: uid,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveConversationToFirestore(uid: string, conversationData: any): Promise<void> {
  const conversationId = `conv_${Date.now()}`;
  const path = `users/${uid}/conversations/${conversationId}`;
  try {
    const docRef = doc(db, path);
    await setDoc(docRef, {
      ...conversationData,
      userId: uid,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function recordStreakCompletionToFirestore(
  uid: string,
  streakData: { streak: number; xpGained: number; coinsGained: number; milestoneUnlocked?: string }
): Promise<void> {
  const logId = `streak_${Date.now()}`;
  const path = `users/${uid}/streakLogs/${logId}`;
  try {
    const docRef = doc(db, path);
    await setDoc(docRef, {
      ...streakData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function recordAchievementUnlockToFirestore(
  uid: string,
  achievementData: { achievementId: string; title: string; badgeName: string; xp: number; coins: number }
): Promise<void> {
  const path = `users/${uid}/achievements/${achievementData.achievementId}`;
  try {
    const docRef = doc(db, path);
    await setDoc(docRef, {
      ...achievementData,
      unlockedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Play Store & GDPR Compliant Data Export
export async function exportUserDataFromFirestore(uid: string): Promise<Record<string, any>> {
  const path = `users/${uid}`;
  try {
    const profileSnap = await getDoc(doc(db, path));
    const wordsSnap = await getDocs(collection(db, `users/${uid}/savedWords`));
    const conversationsSnap = await getDocs(collection(db, `users/${uid}/conversations`));
    const challengesSnap = await getDocs(collection(db, `users/${uid}/challenges`));

    return {
      exportTimestamp: new Date().toISOString(),
      uid,
      profile: profileSnap.exists() ? profileSnap.data() : null,
      savedWords: wordsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      conversations: conversationsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      challenges: challengesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return {};
  }
}

// Play Store Policy Required Account Deletion Workflow
export async function deleteAccountAndDataFromFirestore(uid: string): Promise<void> {
  const userDocPath = `users/${uid}`;
  try {
    // Delete subcollections
    const subcollections = ['savedWords', 'conversations', 'challenges'];
    for (const sub of subcollections) {
      const snap = await getDocs(collection(db, `users/${uid}/${sub}`));
      for (const docItem of snap.docs) {
        await deleteDoc(docItem.ref);
      }
    }
    // Delete user root profile doc
    await deleteDoc(doc(db, userDocPath));

    // Delete Firebase auth user if logged in
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, userDocPath);
  }
}

