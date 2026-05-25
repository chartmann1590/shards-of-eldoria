declare module 'expo-router' {
  export function useRouter(): any;
  export const router: {
    push: (href: string) => void;
    replace: (href: string) => void;
    navigate: (href: string | { pathname: string; params?: Record<string, string> }) => void;
    back: () => void;
  };
  export function useLocalSearchParams<T = Record<string, string>>(): T;
  export function Stack(props: { children?: any; screenOptions?: any }): any;
  export const Stack: any;
}

declare module 'expo-splash-screen' {
  export function preventAutoHideAsync(): Promise<void>;
  export function hideAsync(): Promise<void>;
}
