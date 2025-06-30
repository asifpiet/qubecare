import html2pdf from 'html2pdf.js';
import { createApp, nextTick } from 'vue';
import StatementTemplate from './StatementTemplate.vue';

export const generateMultipleStatementsPDF = async (data) => {
    return new Promise(async (resolve, reject) => {
        let container = null;
        let app = null;

        try {
            // Create a temporary container with visible styling
            container = document.createElement('div');
            Object.assign(container.style, {
                position: 'fixed', // Use fixed positioning
                left: '0',
                top: '0',
                width: '100%',
                height: 'auto',
                visibility: 'visible',
                opacity: '1',
                overflow: 'hidden'
            });
            document.body.appendChild(container);

            // Create and mount the Vue app
            app = createApp(StatementTemplate, { data });
            const instance = app.mount(container);

            // Wait for DOM updates
            await nextTick();
            await nextTick();

            // Access the root element directly
            const pdfContent = container.firstElementChild;

            if (!pdfContent) {
                throw new Error('PDF content element not found');
            }

            // Configure html2pdf
            const opt = {
                margin: 10,
                filename: `statement-${data.statements[0]?.id || 'summary'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    scrollY: 0,
                    async: true
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };

            // Generate PDF and get the blob
            const pdf = await html2pdf()
                .set(opt)
                .from(pdfContent)
                .outputPdf();

            // Create downloadable blob
            const pdfBlob = new Blob([pdf], { type: 'application/pdf' });

            // Create object URL
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Resolve with proper download methods
            resolve({
                open: () => window.open(pdfUrl, '_blank'),
                download: (filename) => {
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = filename || `statement-${data.statements[0]?.id || 'summary'}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
                getBlob: () => pdfBlob
            });

        } catch (error) {
            console.error('Error generating PDF:', error);
            reject(error);
        } finally {
            // Cleanup after PDF generation
            if (app) app.unmount();
            if (container && document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }
    });
};
