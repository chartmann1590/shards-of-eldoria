import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import { useEffect, useState, useCallback } from 'react';

interface DialogueChoice {
  id: string;
  label: string;
}

interface DialogueBoxProps {
  speaker: string;
  text: string;
  choices?: DialogueChoice[];
  onSelectChoice?: (choiceId: string) => void;
  onAdvance?: () => void;
  visible: boolean;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.panelPadding,
    paddingBottom: spacing.safeAreaBottom + spacing.panelPadding,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  speaker: {
    ...typography.headlineMd,
    color: colors.primaryContainer,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryContainer,
    marginBottom: 8,
    opacity: 0.4,
  },
  textContainer: {
    minHeight: 60,
    marginBottom: 8,
  },
  dialogueText: {
    ...typography.bodyLg,
    color: colors.onSurface,
    lineHeight: 24,
  },
  cursor: {
    ...typography.bodyLg,
    color: colors.primaryContainer,
  },
  choicesContainer: {
    gap: 6,
    marginTop: 8,
  },
  choiceButton: {
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.gutter,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  choiceText: {
    ...typography.bodyMd,
    color: colors.primaryContainer,
  },
  tapArea: {
    minHeight: 44,
  },
});

export function DialogueBox({
  speaker,
  text,
  choices,
  onSelectChoice,
  onAdvance,
  visible,
}: DialogueBoxProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!visible) {
      setDisplayedLength(0);
      setIsComplete(false);
      return;
    }
    setDisplayedLength(0);
    setIsComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= text.length) {
        setDisplayedLength(text.length);
        setIsComplete(true);
        clearInterval(interval);
      } else {
        setDisplayedLength(current);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, visible]);

  const handleTap = useCallback(() => {
    if (!isComplete) {
      setDisplayedLength(text.length);
      setIsComplete(true);
    } else if (!choices || choices.length === 0) {
      onAdvance?.();
    }
  }, [isComplete, text, choices, onAdvance]);

  if (!visible) return null;

  const shownText = text.slice(0, displayedLength);

  return (
    <View style={styles.overlay}>
      <View style={styles.speakerRow}>
        <Text style={styles.speaker}>{speaker}</Text>
      </View>
      <View style={styles.divider} />
      <Pressable onPress={handleTap} style={styles.tapArea}>
        <View style={styles.textContainer}>
          <Text style={styles.dialogueText}>
            {shownText}
            {!isComplete && <Text style={styles.cursor}>{'|'}</Text>}
          </Text>
        </View>
      </Pressable>
      {isComplete && choices && choices.length > 0 && (
        <View style={styles.choicesContainer}>
          {choices.map((choice) => (
            <TouchableOpacity
              key={choice.id}
              style={styles.choiceButton}
              onPress={() => onSelectChoice?.(choice.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.choiceText}>{choice.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
