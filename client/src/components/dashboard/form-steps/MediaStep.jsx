// components/dashboard/form-steps/MediaStep.jsx
import { useState, useRef } from 'react';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  DocumentIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../../ui/Button';

const MediaStep = ({ formData, errors, onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const isRealEstate = ['homes', 'plots', 'commercials'].includes(formData.productType);

  // Safe media structure aligned with model
  const safeMedia = {
    images: [],
    videos: [],
    documents: [],
    virtualTour: '',
    ...formData.media
  };

  const handleChange = (field, value) => {
    onChange({
      media: {
        ...formData.media,
        [field]: value
      }
    });
  };

  // File validation
  const validateFile = (file, type) => {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
      document: 20 * 1024 * 1024 // 20MB
    };

    const allowedTypes = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/mov'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    if (file.size > maxSizes[type]) {
      throw new Error(`File size must be less than ${maxSizes[type] / (1024 * 1024)}MB`);
    }

    if (!allowedTypes[type].includes(file.type)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes[type].join(', ')}`);
    }

    return true;
  };

  // Handle file upload
  const handleFileUpload = async (files, type) => {
    setUploading(true);
    const newFiles = [];

    try {
      for (const file of files) {
        validateFile(file, type);

        // Create preview URL for images
        const preview = type === 'image' ? URL.createObjectURL(file) : null;
        
        // Store the actual File object along with metadata
        const fileData = {
          id: Date.now() + Math.random(),
          file: file, // Store the actual File object for upload
          filename: file.name,
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          preview: preview, // Preview URL for display
          uploadedAt: new Date().toISOString(),
          isMain: type === 'image' && safeMedia.images.length === 0, // First image is main
          alt: '',
          caption: '',
          tags: []
        };

        newFiles.push(fileData);
      }

      // Update media array
      const currentFiles = safeMedia[type === 'image' ? 'images' : type === 'video' ? 'videos' : 'documents'];
      handleChange(type === 'image' ? 'images' : type === 'video' ? 'videos' : 'documents', [
        ...currentFiles,
        ...newFiles
      ]);

    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const videoFiles = files.filter(f => f.type.startsWith('video/'));
    const documentFiles = files.filter(f => f.type === 'application/pdf' || f.type.includes('document'));

    if (imageFiles.length > 0) handleFileUpload(imageFiles, 'image');
    if (videoFiles.length > 0) handleFileUpload(videoFiles, 'video');
    if (documentFiles.length > 0) handleFileUpload(documentFiles, 'document');
  };

  // Remove file
  const removeFile = (type, id) => {
    const currentFiles = safeMedia[type === 'image' ? 'images' : type === 'video' ? 'videos' : 'documents'];
    
    // Clean up preview URLs to prevent memory leaks
    const fileToRemove = currentFiles.find(file => file.id === id);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = currentFiles.filter(file => file.id !== id);
    handleChange(type === 'image' ? 'images' : type === 'video' ? 'videos' : 'documents', updatedFiles);
  };

  // Set main image
  const setMainImage = (id) => {
    const updatedImages = safeMedia.images.map(img => ({
      ...img,
      isMain: img.id === id
    }));
    handleChange('images', updatedImages);
  };

  // Reorder images
  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...safeMedia.images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    handleChange('images', updatedImages);
  };

  // Update image metadata
  const updateImageMetadata = (id, field, value) => {
    const updatedImages = safeMedia.images.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    );
    handleChange('images', updatedImages);
  };

  const maxFiles = {
    images: isRealEstate ? 20 : 10,
    videos: 3,
    documents: isRealEstate ? 10 : 5
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Media & Documents
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add photos, videos, and documents to showcase your {isRealEstate ? 'property' : 'product'}.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <PhotoIcon className="h-12 w-12 text-gray-400" />
            <VideoCameraIcon className="h-12 w-12 text-gray-400" />
            <DocumentIcon className="h-12 w-12 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Images (JPEG, PNG, WebP), Videos (MP4, WebM), Documents (PDF, DOC)
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Max: {maxFiles.images} images, {maxFiles.videos} videos, {maxFiles.documents} documents
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
            >
              <PhotoIcon className="h-4 w-4 mr-2" />
              Add Images
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
            >
              <VideoCameraIcon className="h-4 w-4 mr-2" />
              Add Videos
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => documentInputRef.current?.click()}
              disabled={uploading}
            >
              <DocumentIcon className="h-4 w-4 mr-2" />
              Add Documents
            </Button>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(Array.from(e.target.files), 'image')}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => handleFileUpload(Array.from(e.target.files), 'video')}
          className="hidden"
        />
        <input
          ref={documentInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileUpload(Array.from(e.target.files), 'document')}
          className="hidden"
        />

        {uploading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Images Section */}
      {safeMedia.images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <PhotoIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Images ({safeMedia.images.length}/{maxFiles.images})
            </h3>
            {safeMedia.images.length >= maxFiles.images && (
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Maximum reached
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeMedia.images.map((image, index) => (
              <div
                key={image.id}
                className={`relative group border-2 rounded-lg overflow-hidden ${
                  image.isMain ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Image Preview */}
                <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={image.preview || image.url}
                    alt={image.alt || image.filename}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Main Image Badge */}
                {image.isMain && (
                  <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Main Photo
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(image)}
                    className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile('image', image.id)}
                    className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Reorder Buttons */}
                <div className="absolute left-2 bottom-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75"
                    >
                      <ArrowUpIcon className="h-3 w-3" />
                    </button>
                  )}
                  {index < safeMedia.images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75"
                    >
                      <ArrowDownIcon className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Image Details */}
                <div className="p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Alt text (for accessibility)"
                    value={image.alt || ''}
                    onChange={(e) => updateImageMetadata(image.id, 'alt', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={image.caption || ''}
                    onChange={(e) => updateImageMetadata(image.id, 'caption', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  
                  {!image.isMain && (
                    <button
                      type="button"
                      onClick={() => setMainImage(image.id)}
                      className="w-full text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                    >
                      Set as main photo
                    </button>
                  )}
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {(image.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {safeMedia.videos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <VideoCameraIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Videos ({safeMedia.videos.length}/{maxFiles.videos})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeMedia.videos.map((video) => (
              <div
                key={video.id}
                className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800">
                  <video
                    src={video.preview || video.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeFile('video', video.id)}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>

                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {video.filename}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(video.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Virtual Tour */}
      {isRealEstate && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Virtual Tour (Optional)
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Virtual Tour URL
            </label>
            <input
              type="url"
              value={safeMedia.virtualTour || ''}
              onChange={(e) => handleChange('virtualTour', e.target.value)}
              placeholder="https://example.com/virtual-tour"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Link to 360° virtual tour, Google Street View, or similar
            </p>
          </div>
        </div>
      )}

      {/* Documents Section */}
      {safeMedia.documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <DocumentIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Documents ({safeMedia.documents.length}/{maxFiles.documents})
          </h3>

          <div className="space-y-2">
            {safeMedia.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(doc.size / 1024).toFixed(1)} KB • {doc.mimeType}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile('document', doc.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
              Media Requirements
            </h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
              <li>• At least 1 image is required</li>
              <li>• First image will be used as the main photo</li>
              <li>• Images: Max 10MB each (JPEG, PNG, WebP)</li>
              <li>• Videos: Max 100MB each (MP4, WebM)</li>
              <li>• Documents: Max 20MB each (PDF, DOC, DOCX)</li>
              {isRealEstate && (
                <>
                  <li>• Include exterior and interior photos</li>
                  <li>• Add floor plans if available</li>
                  <li>• Virtual tours increase viewing interest</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {(errors.media || errors['media.images']) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                Media Issues
              </h4>
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                {errors.media && <li>• {errors.media}</li>}
                {errors['media.images'] && <li>• {errors['media.images']}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Media Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use high-quality, well-lit photos</li>
              <li>• Take photos from multiple angles</li>
              <li>• Include close-ups of important features</li>
              {isRealEstate ? (
                <>
                  <li>• Show the property during different times of day</li>
                  <li>• Include neighborhood and surroundings</li>
                  <li>• Add documents like title deeds or certificates</li>
                </>
              ) : (
                <>
                  <li>• Show the product from all sides</li>
                  <li>• Include any included accessories</li>
                  <li>• Add warranty or manual documents</li>
                </>
              )}
              <li>• Optimize image file sizes for faster loading</li>
              <li>• Add descriptive alt text for accessibility</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <img
              src={previewImage.preview || previewImage.url}
              alt={previewImage.alt || previewImage.filename}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
              <p className="font-medium">{previewImage.filename}</p>
              {previewImage.caption && (
                <p className="text-sm text-gray-300">{previewImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaStep;