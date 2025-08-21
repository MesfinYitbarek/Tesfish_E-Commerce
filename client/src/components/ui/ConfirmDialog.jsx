import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  type = 'warning',
  loading = false,
  disabled = false
}) => {
  const getIcon = () => {
    const iconClasses = "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10";
    
    switch (type) {
      case 'danger':
        return (
          <div className={`${iconClasses} bg-red-100 dark:bg-red-900/20`}>
            <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        );
      case 'success':
        return (
          <div className={`${iconClasses} bg-green-100 dark:bg-green-900/20`}>
            <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        );
      case 'info':
        return (
          <div className={`${iconClasses} bg-blue-100 dark:bg-blue-900/20`}>
            <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        );
      default: // warning
        return (
          <div className={`${iconClasses} bg-yellow-100 dark:bg-yellow-900/20`}>
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        );
    }
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  {getIcon()}
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title 
                      as="h3" 
                      className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                  <Button
                    variant={confirmVariant}
                    onClick={handleConfirm}
                    loading={loading}
                    disabled={disabled}
                    className="w-full sm:w-auto"
                  >
                    {confirmText}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                  >
                    {cancelText}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmDialog;