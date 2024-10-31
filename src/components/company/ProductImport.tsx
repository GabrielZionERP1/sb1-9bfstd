import { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { ProductImportRow } from '../../types/product';
import * as XLSX from 'xlsx';

interface ProductImportProps {
  onImport: (rows: ProductImportRow[]) => void;
  onCancel: () => void;
}

export const ProductImport = ({ onImport, onCancel }: ProductImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const downloadTemplate = () => {
    const headers = ['name', 'description', 'regularPrice', 'promotionalPrice', 'imageUrls'];
    const data = [headers]; // First row is headers
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Add column widths
    ws['!cols'] = [
      { wch: 30 }, // name
      { wch: 50 }, // description
      { wch: 15 }, // regularPrice
      { wch: 15 }, // promotionalPrice
      { wch: 50 }, // imageUrls
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    // Generate and download file
    XLSX.writeFile(wb, 'product_import_template.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
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
        
        // Get first worksheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });
        
        // First row is headers, skip it and process the rest
        const products: ProductImportRow[] = jsonData
          .slice(1)
          .filter(row => row.length && row[0]) // Ensure row has data and name exists
          .map(row => ({
            name: row[0]?.toString().trim() || '',
            description: row[1]?.toString().trim(),
            regularPrice: row[2]?.toString().trim(),
            promotionalPrice: row[3]?.toString().trim(),
            imageUrls: row[4]?.toString().trim(),
          }))
          .filter(product => product.name); // Filter out products without names

        if (products.length === 0) {
          setError('No valid products found in the file');
          return;
        }

        onImport(products);
      } catch (err) {
        console.error('Error parsing Excel file:', err);
        setError('Failed to parse Excel file. Please ensure it matches the template format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Import Products</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload an Excel file (.xlsx or .xls) with your product data
          </p>
        </div>

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
    </div>
  );
};