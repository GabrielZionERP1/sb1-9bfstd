import { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { CompanyFormData } from '../../types/company';

interface CompanyImportProps {
  onImport: (companies: CompanyFormData[]) => void;
  onCancel: () => void;
}

export const CompanyImport = ({ onImport, onCancel }: CompanyImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const downloadTemplate = () => {
    const headers = [
      'cnpj',
      'name',
      'email',
      'password',
      'categoryId',
      'logo',
      'tags',
      'description',
      'street',
      'number',
      'district',
      'zipCode',
      'city',
      'state',
      'whatsapp'
    ];
    const data = [headers];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    ws['!cols'] = headers.map(() => ({ wch: 20 }));

    XLSX.utils.book_append_sheet(wb, ws, 'Companies');
    XLSX.writeFile(wb, 'company_import_template.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setFile(file);
    setError('');
  };

  const handleImport = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });
        
        const headers = jsonData[0];
        const companies: CompanyFormData[] = jsonData
          .slice(1)
          .filter(row => row.length && row[0])
          .map(row => {
            const company: any = {};
            headers.forEach((header: string, index: number) => {
              if (row[index]) {
                if (header === 'tags') {
                  company[header] = row[index].split(',').map((tag: string) => tag.trim());
                } else {
                  company[header] = row[index].toString().trim();
                }
              }
            });
            return company;
          })
          .filter(company => company.cnpj && company.name && company.email);

        if (companies.length === 0) {
          setError('No valid companies found in the file');
          return;
        }

        onImport(companies);
      } catch (err) {
        console.error('Error parsing Excel file:', err);
        setError('Failed to parse Excel file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600">
                {file ? file.name : 'Click to upload Excel file'}
              </span>
            </div>
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={!file}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Import
        </button>
      </div>
    </div>
  );
};