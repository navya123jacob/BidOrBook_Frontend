// emoji-mart.d.ts
declare module 'emoji-mart' {
    import * as React from 'react';
  
    export interface Emoji {
      id: string;
      name: string;
      colons: string;
      emoticons: string[];
      unified: string;
      skin: number;
      native: string;
    }
  
    export interface BaseEmoji extends Emoji {
      id: string;
      name: string;
      colons: string;
      emoticons: string[];
      unified: string;
      skin: number;
      native: string;
    }
  
    export interface PickerProps {
      onSelect: (emoji: Emoji) => void;
      // Add other props if needed
    }
  
    export class Picker extends React.Component<PickerProps> {}
  }