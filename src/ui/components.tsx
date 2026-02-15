import { colors, spacing, radius, fontSize, fontWeight } from '../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: object;
}

export function Card({ children, style }: CardProps) {
  return (
    <div style={{ 
      backgroundColor: colors.surface, 
      borderRadius: radius.lg, 
      padding: spacing.lg, 
      borderWidth: 1, 
      borderColor: colors.border,
      ...style 
    }}>
      {children}
    </div>
  );
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: object;
}

export function Button({ title, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const buttonStyle = {
    primary: {
      backgroundColor: colors.brand,
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: colors.surfaceSecondary,
      color: colors.text,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.brand,
    },
  }[variant];

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      style={{
        ...buttonStyle,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        fontSize: fontSize.bodyLarge,
        fontWeight: fontWeight.semibold,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: '100%',
        ...style,
      }}
    >
      {title}
    </button>
  );
}
