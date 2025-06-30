export type Options = {
  onClose: () => void;
  onLoad: () => void;
  onFileUpload: (file?: File) => string;
  onSave: (doc: TReaderDocument, html: string) => Promise<void>;
  document?: TReaderDocument;
}

declare function initialize(container: HTMLElement, options?: Options): void;
declare function getDocumentHtml(): string;
declare function getDocument(): Object;
declare const _default: {
    initialize: typeof initialize;
    getDocument: typeof getDocument;
    getDocumentHtml: typeof getDocumentHtml;
};
export default _default;
