import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { addShippingLabel } from '../../store/slices/documentSlice';
import { useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import confetti from 'canvas-confetti';

interface ShippingLabelProps {
  order: any;
  onClose: () => void;
}

const ShippingLabel: React.FC<ShippingLabelProps> = ({ order, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRedirect = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#8b5cf6', '#10b981']
    });

    // Create shipping label document
    dispatch(addShippingLabel({
      id: `DOC-${order.order_id}-LBL`,
      orderId: order.order_id,
      name: 'Shipping Label',
      type: 'Label',
      date: new Date().toISOString(),
      size: '125 KB',
      status: 'Final',
      url: `https://aws-exportedge-dev-order-processing-bucket.s3.us-east-1.amazonaws.com/orders_docs/${order.order_id}/${order.order_id}_label.pdf`
    }));

    // Show success message and redirect after a delay
    setTimeout(() => {
      onClose();
      navigate('/orders');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-2xl m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Shipping Label Preview</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Label Preview */}
          <div className="bg-white border-2 border-gray-200 p-8 rounded-lg mb-6">
            <div className="space-y-6">
              {/* Carrier Logo */}
              <div className="text-center mb-8">
                <img 
                  src="https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg"
                  alt="DHL Express"
                  className="h-12 mx-auto"
                />
              </div>

              {/* Tracking Barcode */}
              <div className="text-center mb-8">
                <div className="text-xs text-gray-500">Tracking Number</div>
                <div className="font-mono text-xl font-bold">TRK{order.order_id}</div>
                <div className="mt-2 flex justify-center">
                  <Barcode 
                    value={`TRK${order.order_id}`}
                    width={1.5}
                    height={50}
                    fontSize={12}
                  />
                </div>
              </div>

              {/* From Address */}
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500">From:</h4>
                <p className="font-medium whitespace-pre-line">{order.seller_address}</p>
              </div>

              {/* To Address */}
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500">To:</h4>
                <p className="font-medium whitespace-pre-line">{order.customer_address}</p>
              </div>

              {/* Package Details */}
              <div className="border-t pt-4">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Package Details:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-medium">{order.product.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dimensions</p>
                    <p className="font-medium">{order.product.dimensions}</p>
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div className="text-center mt-4">
                <div className="inline-block px-4 py-2 bg-gray-100 rounded-full">
                  <span className="font-medium">Express International</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRedirect}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Back to Orders
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShippingLabel;