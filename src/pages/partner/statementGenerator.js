import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs;

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};

export const generateMultipleStatementsPDF = (data) => {
    // Create content array for all statements
    const content = [];

    // Add overall header
    content.push(
        {
            text: 'Commission Statements Summary',
            style: 'mainHeader'
        },
        {
            text: `Period: ${formatDate(data.date)}`,
            style: 'periodDate'
        },
        {
            text: `Total Commission: $${Number(data.total_commission).toFixed(2)}`,
            style: 'totalAmount'
        },
        { text: '\n\n' }
    );

    // Add each statement
    data.statements.forEach((statement, index) => {
        // Add page break after first statement
        if (index > 0) {
            content.push({ text: '', pageBreak: 'before' });
        }

        // Create statement items table
        const statementItemsTable = {
            style: 'statementTable',
            table: {
                headerRows: 1,
                widths: ['auto', '*', '*', 'auto'],
                body: [
                    // Header row
                    [
                        { text: 'Product ID', style: 'tableHeader' },
                        { text: 'Product', style: 'tableHeader' },
                        { text: 'Provider', style: 'tableHeader' },
                        { text: 'Amount', style: 'tableHeader' }
                    ],
                    // Data rows
                    ...statement.statement_items.map(item => [
                        item.product_id,
                        item.product_name,
                        item.provider_name,
                        `$${Number(item.commission_amount).toFixed(2)}`
                    ])
                ]
            }
        };

        // Add statement section
        content.push(
            {
                text: `Statement #${statement.id}`,
                style: 'statementHeader'
            },
            {
                text: `Statement Date: ${formatDate(statement.statement_date)}`,
                style: 'statementDate'
            },
            { text: '\n' },
            { text: 'Statement Details', style: 'sectionHeader' },
            statementItemsTable,
            { text: '\n' },
            {
                text: `Statement Total: $${Number(statement.total_commission).toFixed(2)}`,
                style: 'statementTotal'
            },
            { text: '\n' },
            // Add a conditional page break before check if needed
            {
                text: '',
                pageBreak: 'beforeIfNotFit'
            },
            // Check section
            {
                style: 'checkBox',
                unbreakable: true, // This ensures the check stays together
                table: {
                    widths: ['*'],
                    body: [[
                        {
                            stack: [
                                {
                                    columns: [
                                        {
                                            width: '60%',
                                            stack: [
                                                { text: 'Bank of America', style: 'bankName' },
                                                { text: '123 Banking Street', style: 'bankAddress' },
                                                { text: 'Everett, MA 02549', style: 'bankAddress' },
                                            ]
                                        },
                                        {
                                            width: '40%',
                                            stack: [
                                                { text: `CHECK NO. ${statement.id}`, style: 'checkNumber' },
                                                { text: `DATE: ${formatDate(statement.statement_date)}`, style: 'date' },
                                            ],
                                            alignment: 'right'
                                        }
                                    ]
                                },
                                { text: '\n' },
                                {
                                    columns: [
                                        {
                                            width: '60%',
                                            text: `PAY TO THE ORDER OF ${statement.user_name || 'JOHN DOE'}`,
                                            style: 'payTo'
                                        },
                                        {
                                            width: '40%',
                                            text: `$${Number(statement.total_commission).toFixed(2)}`,
                                            style: 'amount',
                                            alignment: 'right'
                                        }
                                    ]
                                },
                                {
                                    text: numberToWords(statement.total_commission),
                                    style: 'amountInWords'
                                },
                                { text: '\n' },
                                {
                                    columns: [
                                        { text: 'MEMO: Commission Payment', style: 'memo' },
                                        { text: 'AUTHORIZED SIGNATURE', style: 'signature', alignment: 'right' }
                                    ]
                                },
                                {
                                    text: ':123456789: 987654321',
                                    style: 'routingNumber',
                                    alignment: 'center'
                                }
                            ]
                        }
                    ]]
                }
            }
        );
    });

    const documentDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        defaultStyle: {
            font: 'Roboto'
        },
        content: content,
        styles: {
            mainHeader: {
                fontSize: 24,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            periodDate: {
                fontSize: 14,
                alignment: 'center',
                margin: [0, 0, 0, 5]
            },
            totalAmount: {
                fontSize: 16,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            statementHeader: {
                fontSize: 20,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            statementDate: {
                fontSize: 12,
                margin: [0, 0, 0, 5]
            },
            partnerInfo: {
                fontSize: 12,
                margin: [0, 0, 0, 5]
            },
            sectionHeader: {
                fontSize: 16,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            statementTable: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 12,
                fillColor: '#f0f0f0',
                padding: 8
            },
            statementTotal: {
                fontSize: 14,
                bold: true,
                alignment: 'right'
            },
            checkBox: {
                margin: [0, 20, 0, 0]
            },
            bankName: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 5]
            },
            bankAddress: {
                fontSize: 10,
                color: 'grey'
            },
            checkNumber: {
                fontSize: 12,
                bold: true
            },
            date: {
                fontSize: 12
            },
            payTo: {
                fontSize: 14,
                margin: [0, 20, 0, 5],
                borderBottom: '1px solid silver'
            },
            amount: {
                fontSize: 14,
                bold: true
            },
            amountInWords: {
                fontSize: 12,
                italics: true,
                margin: [0, 10, 0, 10]
            },
            memo: {
                fontSize: 10,
                color: 'grey'
            },
            signature: {
                fontSize: 10,
                decoration: 'underline'
            },
            routingNumber: {
                fontSize: 12,
                margin: [0, 20, 0, 0]
            }
        }
    };

    return pdfMake.createPdf(documentDefinition);
};

const numberToWords = (number) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(number).toUpperCase() + ' DOLLARS';
};
