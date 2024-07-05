declare module 'react-file-base64' {
    export interface FileInfo {
      base64: string;
      name: string;
      type: string;
      size: number;
      file: File;
    }
  
    export interface FileBase64Props {
      multiple?: boolean;
      onDone: (file: FileInfo) => void;
    }
  
    export default class FileBase64 extends React.Component<FileBase64Props> {}
  }
  