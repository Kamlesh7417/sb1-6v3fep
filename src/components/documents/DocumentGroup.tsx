import React from 'react';
import { motion } from 'framer-motion';
import { Document } from '../../utils/mockData';
import DocumentCard from './DocumentCard';

interface DocumentGroupProps {
  orderId: string;
  documents: Document[];
  onView: (doc: Document) => void;
}

const DocumentGroup: React.FC<DocumentGroupProps> = ({ orderId, documents, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-4 border-b bg-gradient-to-r from-primary-50 to-primary-100">
        <h3 className="text-lg font-semibold text-gray-900">Order #{orderId}</h3>
        <p className="text-sm text-gray-600">{documents.length} documents</p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              onView={() => onView(doc)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentGroup;