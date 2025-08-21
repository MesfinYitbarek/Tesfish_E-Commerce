import { useState, useRef } from 'react';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  DocumentIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../../ui/Button';
import { formatFileSize } from '../../../utils/helpers';

const MediaStep = ({ formData, errors, onChange }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      onChange({ [field]: value });
    }
  };

  // Show custom notification instead of alert()
  const showNotification = (message, type = 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  };

  const handleFileUpload = async (files, type) => {
    const fileArray = Array.from(files);
    const currentMedia = formData.media[type] || [];
    
    // Check file count limits
    const maxFiles = type === 'images' ? 10 : 5;
    if (currentMedia.length + fileArray.length > maxFiles) {
      showNotification(`Maximum ${maxFiles} ${type} allowed`);
      return;
    }
    
    // Validate file types and sizes
    const validFiles = fileArray.filter(file => {
      if (type === 'images') {
        return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB
      } else if (type === 'videos') {
        return file.type.startsWith('video/') && file.size <= 100 * 1024 * 1024; // 100MB
      } else if (type === 'documents') {
        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) && file.size <= 20 * 1024 * 1024; // 20MB
      }
      return false;
    });

    if (validFiles.length !== fileArray.length) {
      const rejectedCount = fileArray.length - validFiles.length;
      showNotification(`${rejectedCount} file(s) were rejected. Please check file types and sizes.`);
    }

    if (validFiles.length === 0) return;

    // Process valid files - store files for later upload
    const processedFiles = validFiles.map((file) => {
      const fileId = Date.now() + Math.random();
      
      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // Preview URL
        file: file, // Store original file for backend upload
        uploadedAt: new Date().toISOString(),
        status: 'pending', // pending, uploading, uploaded, error
        cloudinaryUrl: null, // Will be set after successful upload
        publicId: null, // Cloudinary public ID
        isPrimary: type === 'images' && currentMedia.length === 0 // First image is primary
      };
    });

    // Update form data immediately for UI responsiveness
    handleChange(`media.${type}`, [...currentMedia, ...processedFiles]);
  };

  const removeFile = (type, fileId) => {
    const currentMedia = formData.media[type] || [];
    const updatedMedia = currentMedia.filter(file => file.id !== fileId);
    
    // If we removed the primary image, make the first remaining image primary
    if (type === 'images' && updatedMedia.length > 0) {
      const hasPrimary = updatedMedia.some(file => file.isPrimary);
      if (!hasPrimary) {
        updatedMedia[0].isPrimary = true;
      }
    }
    
    handleChange(`media.${type}`, updatedMedia);
  };

  const setPrimaryImage = (fileId) => {
    const currentMedia = formData.media.images || [];
    const updatedMedia = currentMedia.map(file => ({
      ...file,
      isPrimary: file.id === fileId
    }));
    handleChange('media.images', updatedMedia);
  };

  const reorderFiles = (type, fromIndex, toIndex) => {
    const currentMedia = [...(formData.media[type] || [])];
    const [movedFile] = currentMedia.splice(fromIndex, 1);
    currentMedia.splice(toIndex, 0, movedFile);
    handleChange(`media.${type}`, currentMedia);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, type);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Get file status icon
  const getFileStatusIcon = (status) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <ArrowUpTrayIcon className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Media Upload
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add photos, videos, and documents to showcase your {formData.productType === 'real-estate' ? 'property' : 'service'}.
        </p>
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <PhotoIcon className="h-5 w-5 mr-2" />
            Photos *
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
          >
            Add Photos
          </Button>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files, 'images')}
          className="hidden"
        />

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }`}
          onDrop={(e) => handleDrop(e, 'images')}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Drag and drop images here
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            or click "Add Photos" to select files
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports: JPG, PNG, GIF up to 10MB each (Max 10 files)
          </p>
        </div>

        {errors['media.images'] && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors['media.images']}</p>
        )}

        {/* Image Preview Grid */}
        {formData.media.images && formData.media.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.media.images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  {uploadProgress[image.id] !== undefined && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-sm">
                        {uploadProgress[image.id]}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Controls */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    {!image.isPrimary && (
                      <button
                        onClick={() => setPrimaryImage(image.id)}
                        className="p-1 bg-blue-500 bg-opacity-80 text-white rounded hover:bg-opacity-100"
                        title="Set as primary"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeFile('images', image.id)}
                      className="p-1 bg-red-500 bg-opacity-80 text-white rounded hover:bg-opacity-100"
                      title="Remove image"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status and Primary Badge */}
                <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                  {image.isPrimary && (
                    <div className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                  {getFileStatusIcon(image.status)}
                </div>

                {/* Image Info */}
                <div className="mt-2">
                  <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(image.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {formData.media.images && formData.media.images.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The primary image will be used as the main thumbnail. Click the eye icon to set a different primary image.
          </p>
        )}
      </div>

      {/* Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <VideoCameraIcon className="h-5 w-5 mr-2" />
            Videos (Optional)
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
          >
            Add Videos
          </Button>
        </div>

        <input
          ref={videoInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => handleFileUpload(e.target.files, 'videos')}
          className="hidden"
        />

        {/* Video Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 transition-colors"
          onDrop={(e) => handleDrop(e, 'videos')}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <VideoCameraIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Add videos to give customers a better view
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports: MP4, MOV, AVI up to 100MB each (Max 5 files)
          </p>
        </div>

        {/* Video List */}
        {formData.media.videos && formData.media.videos.length > 0 && (
          <div className="space-y-3">
            {formData.media.videos.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <VideoCameraIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {video.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(video.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getFileStatusIcon(video.status)}
                  <button
                    onClick={() => window.open(video.url, '_blank')}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Preview video"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFile('videos', video.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                    title="Remove video"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <DocumentIcon className="h-5 w-5 mr-2" />
            Documents (Optional)
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => documentInputRef.current?.click()}
          >
            Add Documents
          </Button>
        </div>

        <input
          ref={documentInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileUpload(e.target.files, 'documents')}
          className="hidden"
        />

        {/* Document Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 transition-colors"
          onDrop={(e) => handleDrop(e, 'documents')}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <DocumentIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {formData.productType === 'real-estate' 
              ? 'Add property documents, floor plans, certificates'
              : 'Add portfolios, certifications, contracts'
            }
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports: PDF, DOC, DOCX up to 20MB each (Max 5 files)
          </p>
        </div>

        {/* Document List */}
        {formData.media.documents && formData.media.documents.length > 0 && (
          <div className="space-y-3">
            {formData.media.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(doc.size)} • {doc.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getFileStatusIcon(doc.status)}
                  <button
                    onClick={() => window.open(doc.url, '_blank')}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="View document"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFile('documents', doc.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                    title="Remove document"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <PhotoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Media Guidelines
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use high-quality, well-lit photos that showcase key features</li>
              <li>• Include multiple angles and different rooms/areas</li>
              <li>• Videos should be stable and provide a walkthrough experience</li>
              <li>• Ensure all media files are relevant and professional</li>
              <li>• The primary image will be used as the main thumbnail</li>
              <li>• Avoid including personal information in images</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Upload Summary
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formData.media.images?.length || 0}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Photos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formData.media.videos?.length || 0}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Videos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formData.media.documents?.length || 0}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Documents</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStep;